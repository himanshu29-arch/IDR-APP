import React, { Dispatch, SetStateAction, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  FlatList,
  Modal,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ImageStyle, StyleProp, TextStyle, ViewStyle } from "react-native";
import MyText from "./customtext";
import { AppColors } from "../utils/colors";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../utils/Dimensions";

type styleprops = {
  ViewStyles: ViewStyle;
  TextStyle: TextStyle;
  ImageStyle: ImageStyle;
};
type props = {
  options: string[];
  onSelect: Dispatch<SetStateAction<string>>;
  defaultOption?: string;
  style?: styleprops;
  label?: string;
  isDisabled?: boolean;
  isDarker?: boolean;
  type?: string;
};
const CustomDropdown = ({
  options,
  onSelect,
  defaultOption,
  isDarker,
  label,
  isDisabled,
  type,
}: props) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const toggleDropdown = () => {
    if (!isDisabled) {
      setIsVisible(!isVisible);
    }
  };

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    onSelect(option);
    setIsVisible(false);
  };
  const getVal = () => {
    if (type === "client" && selectedOption !== "") {
      return selectedOption.company_name;
    } else if (type === "location" && selectedOption !== "") {
      return selectedOption.address_line_one;
    }
    if (type === "status" && selectedOption !== "") {
      return selectedOption;
    } else if (defaultOption !== "") {
      return defaultOption;
    } else {
      return "Choose Option";
    }
  };
  return (
    <View style={{ marginBottom: 5 }}>
      {label && <MyText style={{ color: AppColors.black }}>{label}</MyText>}
      <View>
        {isDisabled ? (
          <View style={isDarker ? styles.anotherC : styles.mainc}>
            <MyText
              fontType="medium"
              style={isDarker ? styles.anothertxt : styles.maintxt}
            >
              {getVal()}
            </MyText>
            <Ionicons size={25} color={AppColors.black} name="chevron-down" />
          </View>
        ) : (
          <TouchableOpacity
            style={isDarker ? styles.anotherC : styles.mainc}
            onPress={toggleDropdown}
            hitSlop={12}
          >
            <MyText
              fontType="medium"
              style={isDarker ? styles.anothertxt : styles.maintxt}
            >
              {getVal()}
            </MyText>
            <Ionicons size={25} color={AppColors.black} name="chevron-down" />
          </TouchableOpacity>
        )}
        <Modal
          animationType="fade"
          transparent={true}
          visible={isVisible}
          onRequestClose={() => setIsVisible(false)}
        >
          <View style={styles.container}>
            <View style={styles.contentContainer}>
              <Ionicons
                name="close"
                color={AppColors.black}
                size={30}
                style={{ alignSelf: "flex-end" }}
                onPress={() => setIsVisible(false)}
              />
              <FlatList
                data={options}
                style={{
                  maxHeight: SCREEN_HEIGHT * 0.6,
                  width: SCREEN_WIDTH * 0.8,
                }}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    hitSlop={12}
                    key={index}
                    style={styles.option}
                    onPress={() => handleSelectOption(item)}
                  >
                    {type === "client" ? (
                      <MyText fontType="medium">{item.company_name}</MyText>
                    ) : type === "location" ? (
                      <MyText fontType="medium">{item.address_line_one}</MyText>
                    ) : type === "status" ? (
                      <MyText fontType="medium">{item}</MyText>
                    ) : null}
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    height: SCREEN_HEIGHT,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    color: AppColors.black,
  },
  contentContainer: {
    backgroundColor: AppColors.white,
    paddingTop: 20,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: -50,
  },
  header: {
    padding: 10,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    backgroundColor: "white",
  },
  headerText: {
    fontSize: 16,
  },
  optionsContainer: {
    borderWidth: 1,
    borderColor: AppColors.darkgreyColor,
    borderRadius: 5,
    backgroundColor: "white",
    zIndex: 1,
    width: SCREEN_WIDTH * 0.8,
    alignSelf: "center",
  },
  option: {
    padding: 10,
  },
  mainc: {
    width: SCREEN_WIDTH * 0.8,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    borderColor: AppColors.darkgrey,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 5,
  },
  anotherC: {
    width: SCREEN_WIDTH * 0.8,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 20,
    backgroundColor: AppColors.lightgrey,
    marginTop: 5,
  },
  maintxt: {
    color: AppColors.darkgreyColor,
  },
  anothertxt: {
    color: AppColors.darkgreyColor,
  },
});

export default CustomDropdown;
