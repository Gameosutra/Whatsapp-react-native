import React, { useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  Dimensions,
  TouchableOpacity
} from "react-native";
import { Button } from "react-native-elements";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";


import { Context as AuthContext } from '../../context/AuthContext';

const HomePageScreen = ({ navigation }) => {
  const { state: { user } } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Animatable.View
        animation="fadeInDown"
        duration={600}
        style={styles.header}
      >
        <Text style={styles.header_text}>Recordसूची</Text>
      </Animatable.View>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => {
            navigation.navigate("InvoiceList", { isPos: false });
          }}
        >
          <Text style={{ fontSize: 20 }}>Invoices</Text>
          <AntDesign name="right" size={10} style={{ marginTop: 10 }} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => {
            navigation.navigate("InvoiceList", { isPos: user.business._id });
          }}
        >
          <Text style={{ fontSize: 20 }}>POS</Text>
          <AntDesign name="right" size={10} style={{ marginTop: 10 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

HomePageScreen.navigationOptions = () => {
  return {
    title: "Recordसूची",
    tabBarIcon: <FontAwesome name="home" size={20} />
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D93B3"
  },
  header_text: {
    fontSize: 40,
    color: "white",
    fontStyle: "italic",
    fontWeight: "bold",
    borderWidth: 3,
    borderColor: "#0D93B3"
  },
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  footer: {
    flex: 4,
    backgroundColor: "white",
    paddingVertical: 50,
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
    marginTop: 15
  },
  button: {
    alignItems: "flex-end",
    marginTop: 15
  },
  button2: {
    borderRadius: 100
  },
  touchable: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: "gray",
    borderBottomWidth: 1
  },
});

export default HomePageScreen;
