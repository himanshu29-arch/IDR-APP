import { View, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import MyText from "./customtext";
import { AppColors } from "../utils/colors";
import { wp } from "../utils/resDimensions";
type props = {
  isdisabled?: boolean;
  title: string;
  onPress: () => void;
  _width: StyleSheet.NamedStyles;
};
export default function CustomButton({
  isdisabled,
  title,
  onPress,
  _width = wp(90),
}: props) {
  return (
    <>
      {isdisabled ? (
        <View
          style={[
            styles.container,
            { backgroundColor: AppColors.iconsGrey, width: _width },
          ]}
        >
          <MyText fontType="InterBold" style={styles.txt}>
            {title}
          </MyText>
        </View>
      ) : (
        <TouchableOpacity
          style={[
            styles.container,
            { backgroundColor: AppColors.primary, width: _width },
          ]}
          onPress={onPress}
        >
          <MyText fontType="InterBold" style={styles.txt}>
            {title}
          </MyText>
        </TouchableOpacity>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    alignSelf: "center",
  },
  txt: {
    fontSize: 14,
    color: AppColors.white,
  },
});
