import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import Toast from 'react-native-toast-message';


import AccountScreen from "./src/screens/AccountProfile/AccountScreen";

import SigninScreen from "./src/screens/Authentication/SigninScreen";
import SignupScreen from "./src/screens/Authentication/SignupScreen";
import SplashScreen from "./src/screens/Authentication/SplashScreen";
import ResolveAuthScreen from "./src/screens/Authentication/ResolveAuthScreen";

import PartyScreen from "./src/screens/Contacts/PartyScreen";
import PartyDetailScreen from "./src/screens/Contacts/PartyDetailScreen";
import PartyEditScreen from './src/screens/Contacts/PartyEditsScreen';


import AddContactsScreen from './src/screens/Contacts/AddContactsScreen'

import InventoryScreen from "./src/screens/Inventory/InventoryScreen";
import InventoryCreateScreen from "./src/screens/Inventory/InventoryCreateScreen";
import InventoryListScreen from "./src/screens/Inventory/InventoryListScreen";
import InventoryDetailScreen from "./src/screens/Inventory/InventoryDetailsScreen";

import ProductCreateScreen from "./src/screens/Product/ProductCreateScreen";
import ProductDetailScreen from "./src/screens/Product/ProductDetailScreen";
import ProductListScreen from "./src/screens/Product/ProductListScreen";
import ProductEditScreen from "./src/screens/Product/ProductEditScreen";

import InvoiceListScreen from "./src/screens/Invoice/InvoiceListScreen";
import InvoiceCreateScreen from "./src/screens/Invoice/InvoiceCreateScreen";
import InvoiceDetailScreen from "./src/screens/Invoice/InvoiceDetailScreen";

import BusinessCreateScreen from "./src/screens/BusinessCreateScreen";
import HomePageScreen from "./src/screens/HomeScreen/HomePageScreen";


import Main from './Main';

import { setNavigator } from "./src/navigationRef";
import { Provider as AuthProvider } from "./src/context/AuthContext";
import { Provider as BusinessProvider } from "./src/context/BusinessContext";
import { Provider as ProductProvider } from "./src/context/ProductContext";
import { Provider as InventoryProvider } from "./src/context/InventoryContext";
import { Provider as PartyProvider } from './src/context/PartyContext';
import { Provider as InvoiceProvider } from './src/context/InvoiceContext';

const ProductListFlow = createStackNavigator({
  ProductList: ProductListScreen,
  ProductDetail: ProductDetailScreen,
  ProductCreate: ProductCreateScreen,
  ProductEdit: ProductEditScreen
});
ProductListFlow.navigationOptions = {
  title: "Products",
  tabBarIcon: <FontAwesome name="th-list" size={20} />
};

const PartiesFlow = createStackNavigator({
  PartiesList: PartyScreen,
  PartyDetail: PartyDetailScreen,
  AddContacts: AddContactsScreen,
  PartyEdit: PartyEditScreen
});

PartiesFlow.navigationOptions = {
  title: 'Parties',
  tabBarIcon: <Entypo name="book" size={20} />
};

const InventoryFlow = createStackNavigator({
  Inventory: InventoryScreen,
  InventoryCreate: InventoryCreateScreen,
  InventoryList: InventoryListScreen,
  InventoryDetails: InventoryDetailScreen
});

InventoryFlow.navigationOptions = {
  title: "Inventory",
  tabBarIcon: <Entypo name="open-book" size={20} />
};

const InvoiceFlow = createStackNavigator({
  InvoiceList: InvoiceListScreen,
  InvoiceCreate: InvoiceCreateScreen,
  InvoiceDetail: InvoiceDetailScreen,
});

InvoiceFlow.navigationOptions = {
  title: "Invoices",
  tabBarIcon: <Entypo name="open-book" size={20} />
};

const switchNavigator = createSwitchNavigator(
  {
    Resolve: ResolveAuthScreen,
    loginFlow: createStackNavigator({
      Splash: SplashScreen,
      Signin: SigninScreen,
      Signup: SignupScreen
    }),
    HomePage: Main,
  },
  {
    defaultNavigationOptions: {
      tabBarVisible: false
    },
    navigationOptions: {
      lazy: true
    }
  }
);

const mainSwitch = createSwitchNavigator({
  Main: Main 
})

const App = createAppContainer(switchNavigator);
// const App = createAppContainer(mainSwitch);

export default () => {
  return (
    <ProductProvider>
      <InvoiceProvider>
        <InventoryProvider>
          <PartyProvider>
            <BusinessProvider>
              <AuthProvider>
                <App
                  ref={navigator => {
                    setNavigator(navigator);
                  }}
                />
                <Toast ref={(ref) => Toast.setRef(ref)} />
              </AuthProvider>
            </BusinessProvider>
          </PartyProvider>
        </InventoryProvider>
      </InvoiceProvider>
    </ProductProvider>
  );
};
