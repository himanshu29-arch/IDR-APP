import React from "react";
import {
  Text as RNText,
  StyleSheet,
  TextProps,
} from "react-native";
import { Fonts } from "../utils/constants";
import { AppColors } from "../utils/colors";


type FontType = "regular" | "bold" | "medium" | "InterBold";

interface TypographyProps extends TextProps {
  fontType?: FontType;
}

const MyText = (props: TypographyProps) => {
  const { style, fontType, ...otherProps } = props;

  let fontFamily;

  switch (fontType) {
    case "bold":
      fontFamily = Fonts.BOLD;
      break;
    case "medium":
      fontFamily = Fonts.MEDIUM;
      break;
    case "InterBold":
      fontFamily = Fonts.InterBold;
      break;
    default:
      fontFamily = Fonts.REGULAR;
  }

  return (
    <RNText
      style={[styles.defaultText, { fontFamily }, style]}
      {...otherProps}
    />
  );
};

const styles = StyleSheet.create({
  defaultText: {
    color: AppColors.black,
  },
});

export default MyText;
