import React, { useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar, Text } from 'react-native';
import Spacer from '../../components/Spacer';
import { NavigationEvents } from 'react-navigation';
import { Feather } from '@expo/vector-icons';
import * as Animatable from "react-native-animatable";
import SlidingScreen from '../SlidingScreen/SlidingScreen';

import { Context as ProductContext } from '../../context/ProductContext';

const ProductDetailScreen = ({ route, navigation }) => {
    const { state, findProduct } = useContext(ProductContext);
    const _id = route.params._id;
    if(_id) {
        useEffect(() => {
            findProduct(_id);
        }, [])
    }
    let product;
    if (state.currentProduct) {
        product = state.currentProduct;
    } else {
        product = {
            name: '',
            skuCode: '',
            category: '',
            baseUnit: '',
            sellingPrice: '',
            purchasingPrice: '',
            brand: '',
            tax: 0,
            discount: 0,
            parLevel: 0,
            description: "",
            shelf: "",
            inventory:{currentStock: 0},
        };
    }
    if (state.loader || !_id) {
        return (
            <View>
                <ActivityIndicator size="large" style={{ marginTop: 200 }} />
            </View>
        )
    }

    const firstComponent = () => {
        return (
            <ScrollView>
                <View style={styles.viewText}>
                        <Text style={styles.text}>Sku Code:</Text>
                        <Text style={styles.textAgain}> {product.skuCode}</Text>
                    </View>
                    <Spacer />
                    <View style={styles.viewText}>
                        <Text style={styles.text}>Category: </Text>
                        <Text style={styles.textAgain}> {product.category}</Text>
                    </View>
                    <Spacer />
                    <View style={styles.viewText}>
                        <Text style={styles.text}>Brand Name: </Text>
                        <Text style={styles.textAgain}> {product.brand}</Text>
                    </View>
                    <Spacer />
                    <View style={styles.viewText}>
                        <Text style={styles.text}>Base Unit: </Text>
                        <Text style={styles.textAgain}> {product.baseUnit}</Text>
                    </View>
                    <Spacer />
                    <View style={styles.viewText}>
                        <Text style={styles.text}>Selling Price:</Text>
                        <Text style={styles.textAgain}> {product.sellingPrice}</Text>
                    </View>
                    <Spacer />
                    <View style={styles.viewText}>
                        <Text style={styles.text}>Purchasing Price:</Text>
                        <Text style={styles.textAgain}> {product.purchasingPrice}</Text>
                    </View>
            </ScrollView>
        )
    }

    const secondComponent = () => {
        return (
            <ScrollView>
                    <View style={styles.viewText}>
                        <Text style={styles.text}>Tax:</Text>
                        <Text style={styles.textAgain}> {product.tax}</Text>
                    </View>
                    <Spacer />
                    <View style={styles.viewText}>
                        <Text style={styles.text}>Discount</Text>
                        <Text style={styles.textAgain}> {product.discount}</Text>
                    </View>
                    <Spacer />
                    <View style={styles.viewText}>
                        <Text style={styles.text}>Par Level:</Text>
                        <Text style={styles.textAgain}> {product.parLevel}</Text>
                    </View>
                    <Spacer />
                    <View style={styles.viewText}>
                        <Text style={styles.text}>Description:</Text>
                        <Text style={styles.textAgain}> {product.description}</Text>
                    </View>
                    <Spacer />
                    <View style={styles.viewText}>
                        <Text style={styles.text}>Shelf:</Text>
                        <Text style={styles.textAgain}> {product.shelf}</Text>
                    </View>
                    <Spacer />
                    <View style={styles.viewText}>
                    <Text style={styles.text}>Current Stock:</Text>
                    <Text style={styles.textAgain}> {product.inventory.currentStock}</Text>
                </View>
            </ScrollView>
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
                <Text style={styles.header_text}>{product.name}</Text>
                <TouchableOpacity onPress={() => navigation.navigate("ProductEdit")}>
                <Feather
                    name="edit"
                    size={30}
                    style={{marginRight: 20}}
                    color='white'
                />
                </TouchableOpacity>
            </Animatable.View>
            <View style={styles.footer}>
                    <SlidingScreen 
                        firstComponentHeader="Basic Details"
                        secondComponentHeader="Advance Details"
                        firstComponent={firstComponent()}
                        secondComponent={secondComponent()}
                    />
            </View>
        </View>
    );
}

ProductDetailScreen.navigationOptions = ({ navigation }) => {
    return {
        header: () => false
    }
}

const styles = StyleSheet.create({
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

export default ProductDetailScreen;