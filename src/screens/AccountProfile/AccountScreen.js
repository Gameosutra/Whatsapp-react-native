import React, { useContext, useState } from "react";
import { View, StyleSheet, ScrollView, TextInput, Button } from "react-native";
import { Text, Input, Avatar } from "react-native-elements";
import { SafeAreaView, NavigationEvents } from "react-navigation";
import Spacer from "../../components/Spacer";
import { Context as AuthContext } from "../../context/AuthContext";
import { Context as BusinessContext } from "../../context/BusinessContext";
import {
  FontAwesome,
  MaterialIcons,
  MaterialCommunityIcons
} from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

const AccountScreen = () => {
  const { state, signout } = useContext(AuthContext);
  const {
    state: { user },
    editBusiness,
    clearErrorMessage
  } = useContext(BusinessContext);
  let business;
  if (state.user) {
    business = state.user ? state.user.business : null;
  } else {
    business = {
      businessName: "",
      brandName: "",
      city: "",
      stateBuisness: "",
      address: "",
      concernedPerson: ""
    };
  }

  const [businessName, setBusinessName] = useState(business.businessName);
  const [brandName, setBrandName] = useState(business.brandName);
  const [city, setCity] = useState(business.city);
  const [stateBuisness, setState] = useState(business.state);
  const [address, setAddress] = useState(business.address);
  const [concernedPerson, SetPerson] = useState(business.concernedPerson);

  return (
    <View style={styles.container}>
      <NavigationEvents
        onWillBlur={clearErrorMessage}
        onWillFocus={clearErrorMessage}
      />
      <Animatable.View
        duration={600}
        animation="fadeInDown"
        style={styles.header}
      >
        <Text style={styles.text_header}>Account Details</Text>
        <Avatar style={styles.avtar} title="RS" />
      </Animatable.View>
      <Animatable.View duration={600} animation="" style={styles.footer}>
        <ScrollView>
          <Text style={styles.text_footer}>Business Name</Text>
          <View style={styles.action}>
            <MaterialIcons name="person" color="#05375a" size={20} />
            <TextInput
              placeholder="Enter Business Name"
              style={styles.textInput}
              autoCapitalize="none"
              autoCorrect={false}
              label="Business Name"
              value={businessName}
              onChangeText={setBusinessName}
            />
          </View>

          <Text
            style={[
              styles.text_footer,
              {
                marginTop: 35
              }
            ]}
          >
            Brand Name
          </Text>
          <View style={styles.action}>
            <MaterialIcons name="person" color="#05375a" size={20} />
            <TextInput
              placeholder="Enter Brand Name"
              style={styles.textInput}
              autoCapitalize="none"
              autoCorrect={false}
              label="Brand Name"
              value={brandName}
              onChangeText={setBrandName}
            />
          </View>
          <Text
            style={[
              styles.text_footer,
              {
                marginTop: 35
              }
            ]}
          >
            City
          </Text>
          <View style={styles.action}>
            <MaterialCommunityIcons name="city" color="#05375a" size={20} />
            <TextInput
              placeholder="Enter City"
              style={styles.textInput}
              autoCapitalize="none"
              autoCorrect={false}
              label="City"
              value={city}
              onChangeText={setCity}
            />
          </View>
          <Text
            style={[
              styles.text_footer,
              {
                marginTop: 35
              }
            ]}
          >
            State
          </Text>
          <View style={styles.action}>
            <MaterialCommunityIcons name="city" color="#05375a" size={20} />
            <TextInput
              placeholder="Enter State"
              style={styles.textInput}
              autoCapitalize="none"
              autoCorrect={false}
              label="State"
              value={stateBuisness}
              onChangeText={setState}
            />
          </View>
          <Text
            style={[
              styles.text_footer,
              {
                marginTop: 35
              }
            ]}
          >
            Address
          </Text>
          <View style={styles.action}>
            <FontAwesome name="address-book-o" color="#05375a" size={20} />
            <TextInput
              placeholder="Enter Address"
              style={styles.textInput}
              autoCapitalize="none"
              autoCorrect={false}
              label="Address"
              value={address}
              onChangeText={setAddress}
            />
          </View>
          <Text
            style={[
              styles.text_footer,
              {
                marginTop: 35
              }
            ]}
          >
            Concerned Person
          </Text>
          <View style={styles.action}>
            <MaterialIcons name="person" color="#05375a" size={20} />
            <TextInput
              placeholder="Enter Concerned Person"
              style={styles.textInput}
              autoCapitalize="none"
              autoCorrect={false}
              label="Concerned Person Name"
              value={concernedPerson}
              onChangeText={SetPerson}
            />
          </View>

          {state.errorMessage ? (
            <Text style={styles.error}>Something went wrong!!</Text>
          ) : null}
          <View style={styles.button}>
            <Button
              title="Update Details"
              onPress={() => {
                editBusiness({
                  business,
                  businessName,
                  brandName,
                  city,
                  stateBuisness,
                  address,
                  concernedPerson
                });
              }}
              loading={state.loader}
              color="#0D93B3"
            />
            <Spacer />
            <Button
              title="Logout"
              onPress={signout}
              loading={state.loader}
              color="red"
            />
          </View>
        </ScrollView>
      </Animatable.View>
    </View>
  );
};

AccountScreen.navigationOptions = {
  tabBarIcon: <FontAwesome name="gear" size={20} />
};

const styles = StyleSheet.create({
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

export default AccountScreen;
