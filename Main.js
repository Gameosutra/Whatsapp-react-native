import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
    View,
    StatusBar,
    TouchableOpacity
} from "react-native";
import { Feather as Icon } from "@expo/vector-icons";

import PartyScreen from "./src/screens/Contacts/PartyScreen";
import PartyDetailScreen from "./src/screens/Contacts/PartyDetailScreen";
import PartyEditScreen from './src/screens/Contacts/PartyEditsScreen';
import AddContactsScreen from './src/screens/Contacts/AddContactsScreen'


import InventoryScreen from "./src/screens/Inventory/InventoryScreen";
import InventoryCreateScreen from "./src/screens/Inventory/InventoryCreateScreen";
import InventoryListScreen from "./src/screens/Inventory/InventoryListScreen";
import InventoryDetailScreen from "./src/screens/Inventory/InventoryDetailsScreen";

import InvoiceListScreen from "./src/screens/Invoice/InvoiceListScreen";
import InvoiceCreateScreen from "./src/screens/Invoice/InvoiceCreateScreen";
import InvoiceDetailScreen from "./src/screens/Invoice/InvoiceDetailScreen";

import ProductCreateScreen from "./src/screens/Product/ProductCreateScreen";
import ProductDetailScreen from "./src/screens/Product/ProductDetailScreen";
import ProductListScreen from "./src/screens/Product/ProductListScreen";
import ProductEditScreen from "./src/screens/Product/ProductEditScreen";

import AccountScreen from "./src/screens/AccountProfile/AccountScreen";

import SlidingScreen from "./src/screens/SlidingScreen/SlidingScreen";

const Stack = createStackNavigator();

const Tab = createMaterialTopTabNavigator();

const MaterialTopTab = () => {
    return (
        <Tab.Navigator
            tabBarOptions={{
                activeTintColor: "#fff",
                indicatorStyle: {
                    backgroundColor: "#fff",
                },
                labelStyle: { fontSize: 16, fontWeight: "500" },
                style: {
                    backgroundColor: "#0D93B3"
                }
            }}
        >
            <Tab.Screen name="ProductList" component={ProductListScreen} />
            {/* <Tab.Screen name="Sliding" component={SlidingScreen} /> */}
            <Tab.Screen name="PartiesList" component={PartyScreen} />
            {/* <Tab.Screen name="InventoryList" component={InventoryListScreen} /> */}
            <Tab.Screen name="InvoiceList" component={InvoiceListScreen} />
        </Tab.Navigator>
    )
}

const Main = () => {
    return (
        <View style={{ flex: 1 }}>
            <StatusBar backgroundColor="#9cd0dd" />
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen
                        options={({ navigation, route }) => ({
                            title: "RecordSuchi",
                            headerTintColor: "#fff",
                            headerStyle: {
                                elevation: 0,
                                backgroundColor: "#0D93B3",
                            },
                            headerRight: () => {
                                return (
                                    <View style={{
                                        flexDirection: "row",
                                        alignItems: "center"
                                    }}>
                                        <TouchableOpacity style={{ marginHorizontal: 10 }}>
                                            <Icon name="search" size={26} color="#fff" />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => navigation.navigate("Account")}>
                                            <Icon name="more-vertical" size={26} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                )
                            }
                        })}
                        name="HomePage" component={MaterialTopTab}
                    />

                    <Stack.Screen options={{
                        headerShown: false
                    }} name="Account" component={AccountScreen} />

                    {/* Product */}
                    <Stack.Screen options={{
                        headerShown: false
                    }} name="ProductDetail" component={ProductDetailScreen} />

                    <Stack.Screen name="ProductCreate" component={ProductCreateScreen} />

                    <Stack.Screen name="ProductEdit" component={ProductEditScreen} />

                    {/* Party */}
                    <Stack.Screen options={{
                        headerShown: false
                    }} name="PartyDetail" component={PartyDetailScreen} />

                    <Stack.Screen options={{
                        headerShown: false
                    }} name="AddContacts" component={AddContactsScreen} />

                    <Stack.Screen options={{
                        headerShown: false
                    }} name="PartyEdit" component={PartyEditScreen} />

                    {/* Invoice */}
                    <Stack.Screen options={{
                        headerShown: false
                    }} name="InvoiceCreate" component={InvoiceCreateScreen} />

                    <Stack.Screen options={{
                        headerShown: false
                    }} name="InvoiceDetail" component={InvoiceDetailScreen} />

                    {/* Inventory */}
                    <Stack.Screen options={{
                        headerShown: false
                    }} name="InventoryList" component={InventoryListScreen} />

                    <Stack.Screen options={{
                        headerShown: false
                    }} name="InventoryCreate" component={InventoryCreateScreen} />

                    <Stack.Screen options={{
                        headerShown: false
                    }} name="InventoryDetails" component={InventoryDetailScreen} />

                </Stack.Navigator>
            </NavigationContainer>
        </View>
    )
}

export default Main;