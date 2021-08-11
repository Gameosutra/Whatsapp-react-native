import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Avatar } from "react-native-elements";
import { AntDesign } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

const InventoryScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Animatable.View
        duration={600}
        animation="fadeInDown"
        style={styles.header}
      >
        <Text style={styles.text_header}>Inventory</Text>
        <Avatar style={styles.avtar} title="RS" />
      </Animatable.View>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => {
            navigation.navigate("InventoryList", {type: "New Consignment"});
          }}
        >
          <Text style={{ fontSize: 20 }}>New Consignment</Text>
          <AntDesign name="right" size={10} style={{ marginTop: 10 }} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => {
            navigation.navigate("InventoryList", {type: "Inventory Audit"});
          }}
        >
          <Text style={{ fontSize: 20 }}>Inventory Audit</Text>
          <AntDesign name="right" size={10} style={{ marginTop: 10 }} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => {
            navigation.navigate("InventoryList", {type: "Wastage Inventory"});
          }}
        >
          <Text style={{ fontSize: 20 }}>Wastage Inventory</Text>
          <AntDesign name="right" size={10} style={{ marginTop: 10 }} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.touchable}
          onPress={() => {
            navigation.navigate("InventoryList", {type: "Sales"});
          }}
        >
          <Text style={{ fontSize: 20 }}>Sales</Text>
          <AntDesign name="right" size={10} style={{ marginTop: 10 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

InventoryScreen.navigationOptions = () => {
  return {
    header: () => false
  };
};

const styles = StyleSheet.create({
  touchable: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: "gray",
    borderBottomWidth: 1
  },
  container: {
    flex: 1,
    backgroundColor: "#0D93B3"
  },
  header: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 40
  },
  footer: {
    flex: 5,
    backgroundColor: "white",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 30
  },
  text_header: {
    color: "white",
    fontSize: "bold",
    fontSize: 30
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18
  },
  action: {
    marginTop: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
    flexDirection: "row"
  },
  textInput: {
    flex: 1,
    paddingLeft: 10,
    color: "#05375a"
  },
  button: {
    marginTop: 30
  },
  error: {
    fontSize: 15,
    color: "red",
    marginTop: 20
  },
  avtar: {
    height: 50,
    width: 50,
    marginRight: 10,
    backgroundColor: "#05375a",
    borderRadius: 30
  }
});

export default InventoryScreen;
