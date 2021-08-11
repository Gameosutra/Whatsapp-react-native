import React, { useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar, Text, FlatList } from 'react-native';
import { ListItem, Avatar } from "react-native-elements";
import Spacer from '../../components/Spacer';
import { NavigationEvents } from 'react-navigation';
import { Feather } from '@expo/vector-icons';
import * as Animatable from "react-native-animatable";

import { Context as InvoiceContext } from '../../context/InvoiceContext';

const InvoiceDetailScreen = ({ navigation, route }) => {
    const { state, fetchInvoiceDetail, updateInvoice, clearDataForSelectedInvoice } = useContext(InvoiceContext);
    const _id = route.params._id;
    useEffect(() => {
        fetchInvoiceDetail(_id);
        return () => {
            clearDataForSelectedInvoice();
        }
    }, [_id])
    let selectedInvoiceDetails;
    if (state.selectedInvoiceDetails) {
        selectedInvoiceDetails = state.selectedInvoiceDetails;
    } else {
        selectedInvoiceDetails = {
            invoiceNo: '',
            seller: {
                businessName: ''
            },
            subTotal: 0,
            totalTaxAmount: 0,
            totalDiscount: 0,
            total: 0,
            connfirmReceiving: ''
        };
    }
    if (state.loader) {
        return (
            <View>
                <ActivityIndicator size="large" style={{ marginTop: 200 }} />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <Animatable.View
                animation="fadeInDown"
                duration={600}
                style={styles.header}
            >
                <Text style={styles.header_text}>{selectedInvoiceDetails.invoiceNo}</Text>
                <TouchableOpacity onPress={() => {
                    updateInvoice({...selectedInvoiceDetails, isPos: route.params.isPos?route.params.isPos:false},navigation);
                }}>
                <Feather
                    name="edit"
                    size={30}
                    style={{marginRight: 20}}
                    color='white'
                />
                </TouchableOpacity>
            </Animatable.View>
            <View style={styles.footer}>
                <ScrollView>
                <Spacer />
                <View style={styles.viewText}>
                    <Text style={styles.text}>Seller: </Text>
                    <Text style={styles.textAgain}> {selectedInvoiceDetails.seller && selectedInvoiceDetails.seller.businessName}</Text>
                </View>
                <Spacer />
                <View style={styles.viewText}>
                    <Text style={styles.text}>Sub Total Amount:  </Text>
                    <Text style={styles.textAgain}> {selectedInvoiceDetails.subTotal && selectedInvoiceDetails.subTotal.toFixed(2)}</Text>
                </View>
                <Spacer />
                <View style={styles.viewText}>
                    <Text style={styles.text}>Total Tax Amount:  </Text>
                    <Text style={styles.textAgain}> {selectedInvoiceDetails.totalTaxAmount && selectedInvoiceDetails.totalTaxAmount.toFixed(2)}</Text>
                </View>
                <Spacer />
                <View style={styles.viewText}>
                    <Text style={styles.text}>Total Discount Amount: </Text>
                    <Text style={styles.textAgain}> {selectedInvoiceDetails.totalDiscount && selectedInvoiceDetails.totalDiscount.toFixed(2)}</Text>
                </View>
                <Spacer />
                <View style={styles.viewText}>
                    <Text style={styles.text}>Total Amount:</Text>
                    <Text style={styles.textAgain}> {selectedInvoiceDetails.total && selectedInvoiceDetails.total.toFixed(2)}</Text>
                </View>
                <Spacer />
                <View style={styles.viewText}>
                    <Text style={styles.text}>Receiving Status:</Text>
                    <Text style={styles.textAgain}> {selectedInvoiceDetails.connfirmReceiving?"Received":"Not Yet"}</Text>
                </View>
                <View style={styles.viewText}>
                    <Text style={styles.text}>Added Products:</Text>
                    <FlatList
                        style={styles.list}
                        data={selectedInvoiceDetails.items}
                        keyExtractor={item => item._id}
                        renderItem={({ item }) => {
                        return (
                            <ListItem bottomDivider key={item._id}>
                                <Avatar style={styles.avtar} title={item.product.name[0]} />
                                <ListItem.Content>
                                <ListItem.Title>{item.product.name}(Qty: {item.quantity})</ListItem.Title>
                                <ListItem.Subtitle>Price: {item.price}</ListItem.Subtitle>
                                <ListItem.Subtitle>Tax: {item.tax}</ListItem.Subtitle>
                                <ListItem.Subtitle>Discount: {item.discount}</ListItem.Subtitle>
                                </ListItem.Content>
                            </ListItem>
                        );
                        }} />
                </View>
                </ScrollView>
            </View>
        </View>
    );
}

InvoiceDetailScreen.navigationOptions = ({ navigation }) => {
    return {
        header: () => false
    }
}

const styles = StyleSheet.create({
    avtar: {
        height: 30,
        width: 30,
        backgroundColor: "gray",
        borderRadius: 20
    },
    container: {
        flex: 1,
        backgroundColor: "#0D93B3"
    },
    header_text: {
        fontSize: 30,
        color: "white",
        fontWeight: "bold",
        borderWidth: 3,
        marginLeft: 30,
        borderColor: "#0D93B3"
    },
    header: {
        flex: 1,
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    footer: {
        flex: 4,
        backgroundColor: "white",
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    title: {
        color: "#05375a",
        fontWeight: "bold",
        fontSize: 40
    },
    text: {
        color: "gray",
        fontSize: 20,
        fontWeight: 'bold'
    },
    textAgain: {
        color: "gray",
        fontSize: 18,
        marginLeft: 10
    },
    button: {
        alignItems: "flex-end",
        marginTop: 15
    },
    button2: {
        borderRadius: 100
    },
    viewText: {
        flexDirection: 'row',
        marginTop: 15,
    }
});

export default InvoiceDetailScreen;