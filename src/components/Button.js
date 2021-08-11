import React from "react";
import { View, StyleSheet } from "react-native";
import * as Animatable from "react-native-animatable";
import { Feather } from "@expo/vector-icons";

const PopButton = ({ children }) => {
  return (
    <Animatable.View animation="bounce">
      <Feather name="shopping-cart" size={20} color="#0D93B3" />
    </Animatable.View>
  );
};
const styles = StyleSheet.create({});

export default PopButton;
