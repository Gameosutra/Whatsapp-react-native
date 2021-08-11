import React, { useState } from "react";
import { Button, Text } from "react-native-elements";
import {
  View,
  StyleSheet,
  ScrollView,
  Picker,
  TextInput,
  FlatList
} from "react-native";
import * as Animatable from "react-native-animatable";

const PartyForm = ({
  party,
  onSubmit,
  onSubmitButton,
  title,
  error,
  loader
}) => {
  const [businessName, setBusinessName] = useState(party.businessName);
  const [phone, setPhone] = useState(party.phone);
  const [brandName, setBrandName] = useState(party.brandName);
  const [city, setCity] = useState(party.city);
  const [state, setState] = useState(party.state);
  
  return (
    <View style={styles.container}>
      <Animatable.View
        duration={600}
        animation="fadeInDown"
        style={styles.header}
      >
        <Text style={styles.text_header}>{title}</Text>
      </Animatable.View>
      <Animatable.View duration={600} animation="" style={styles.footer}>
        <ScrollView>
          <Text style={styles.text_footer}>Business Name</Text>
          <View style={styles.action}>
            <TextInput
              placeholder="Enter Business Name"
              style={styles.textInput}
              autoCapitalize="none"
              autoCorrect={false}
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
            Phone
          </Text>
          <View style={styles.action}>
            <TextInput
              placeholder="Enter Phone"
              style={styles.textInput}
              autoCapitalize="none"
              autoCorrect={false}
              value={phone}
              onChangeText={setPhone}
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
            <TextInput
              placeholder="Enter Brand Name"
              style={styles.textInput}
              autoCapitalize="none"
              autoCorrect={false}
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
            <TextInput
              placeholder="Enter City Name"
              style={styles.textInput}
              autoCapitalize="none"
              autoCorrect={false}
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
            <Picker
              placeholder="Select State"
              selectedValue={state}
              style={{ height: 50, width: 150 }}
              onValueChange={(state, itemIndex) => setState(state)}
            >
              <Picker.Item label="Delhi" value="delhi" />
              <Picker.Item label="Punjab" value="punjab" />
              <Picker.Item label="Haryana" value="haryana" />
              <Picker.Item label="UP" value="up" />
            </Picker>
          </View>
          {error ? (
            <Text style={styles.error}>Something went wrong!!</Text>
          ) : null}
          <View style={styles.button}>
            <Button
              title={onSubmitButton}
              onPress={() => {
                onSubmit(
                  businessName,
                  phone,
                  brandName,
                  city,
                  state
                );
              }}
              loading={loader}
            />
          </View>
        </ScrollView>
      </Animatable.View>
    </View>
  );
};

PartyForm.defaultProps = {
    party : {
        businessName: '',
        phone: '',
        brandName:'',
        state:'',
        city:''
    }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D93B3"
  },
  header: {
    flex: 1,
    margin: 30,
    marginTop: 40
  },
  footer: {
    flex: 5,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  text_header: {
    color: "white",
    fontSize: "bold",
    fontSize: 30
  },
  text_footer: {
    color: "#05375a",
    fontSize: 20
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
  }
});

export default PartyForm;
