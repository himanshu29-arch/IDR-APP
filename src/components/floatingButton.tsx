import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { AppColors } from "../utils/colors";

const FloatingButton = ({ onPress, IconComp }) => {
  return (
    <TouchableOpacity style={[styles.button]} onPress={onPress}>
      {IconComp}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: AppColors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginVertical: 10, // Adds space between the buttons
  },
});

export default FloatingButton;
