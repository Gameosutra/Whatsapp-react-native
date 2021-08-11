import React, { useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar, Text } from 'react-native';
import Spacer from '../../components/Spacer';
import { NavigationEvents } from 'react-navigation';
import { Feather } from '@expo/vector-icons';
import * as Animatable from "react-native-animatable";

import { Context as PartyContext } from '../../context/PartyContext';

const ProductDetailScreen = ({ route,navigation }) => {
    const { state, findParty } = useContext(PartyContext);
    const _id = route.params._id;
    if(_id) {
        useEffect(() => {
            findParty(_id);
        }, [])
    }
    let party;
    if (state.currentParty) {
        party = state.currentParty;
    } else {
        party = {
            businessName: '',
            phone: '',
            brandName:'',
            state:'',
            city:''
        };
    }
    if (state.loader || !_id) {
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
                <Text style={styles.header_text}>{party.businessName}</Text>
                <TouchableOpacity onPress={() => navigation.navigate("PartyEdit")}>
                <Feather
                    name="edit"
                    size={30}
                    style={{marginRight: 20}}
                    color='white'
                />
                </TouchableOpacity>
            </Animatable.View>
            <View style={styles.footer}>
                <Spacer />
                <View style={styles.viewText}>
                    <Text style={styles.text}>Business Name:</Text>
                    <Text style={styles.textAgain}> {party.businessName}</Text>
                </View>
                <Spacer />
                <View style={styles.viewText}>
                    <Text style={styles.text}>Phone: </Text>
                    <Text style={styles.textAgain}> {party.phone}</Text>
                </View>
                <Spacer />
                <View style={styles.viewText}>
                    <Text style={styles.text}>Brand Name: </Text>
                    <Text style={styles.textAgain}> {party.brandName}</Text>
                </View>
                <Spacer />
                <View style={styles.viewText}>
                    <Text style={styles.text}>City: </Text>
                    <Text style={styles.textAgain}> {party.city}</Text>
                </View>
                <Spacer />
                <View style={styles.viewText}>
                    <Text style={styles.text}>State:</Text>
                    <Text style={styles.textAgain}> {party.state}</Text>
                </View>
                <Spacer />
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
        fontSize: 25,
        color: "white",
        fontWeight: "bold",
        borderWidth: 3,
        marginLeft: 30,
        flexWrap:'wrap',
        flex:1,
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
        fontWeight: 'bold',
    },
    textAgain: {
        color: "gray",
        fontSize: 18,
        marginLeft: 10,
        flex:1,
        flexWrap:'wrap'
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