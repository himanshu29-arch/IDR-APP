import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  FlatList,
  Modal,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ImageStyle, StyleProp, TextStyle, ViewStyle } from "react-native";
import MyText from "./customtext";
import { AppColors } from "../utils/colors";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../utils/Dimensions";
import { fp, hp } from "../utils/resDimensions";
import axios from "axios";
import { BASE_URL } from "../services/apiConfig";
import { useSelector } from "react-redux";
import Snackbar from "react-native-snackbar";
import Loader from "./Loader";

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
  onSelect,
  defaultOption,
  isDarker,
  label,
  isDisabled,
  type,
}: props) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [allClient, setAllClient] = useState({});
  const { userData } = useSelector((state: RootState) => state.auth);

  const toggleDropdown = () => {
    getAllClient();
    if (!isDisabled) {
      setIsVisible(!isVisible);
    }
  };

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    onSelect(option);
    setIsVisible(false);
  };

  const getAllClient = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/client/all`, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      });
      if (response.status === 200) {
        setIsLoading(false);
        setAllClient(response?.data);
      }
    } catch (error) {
      console.log("🚀 ~ handleWorkOrderFilter ~ error:", error);
      setIsLoading(false);
      Snackbar.show({
        text: error.response.data.message,
        duration: 4000,
        backgroundColor: AppColors.red,
      });
    }
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
              {isLoading ? (
                <View
                  style={{
                    maxHeight: SCREEN_HEIGHT * 0.6,
                    width: SCREEN_WIDTH * 0.8,
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ActivityIndicator color={AppColors.primary} size="small" />
                </View>
              ) : (
                <FlatList
                  data={allClient?.data}
                  style={{
                    maxHeight: SCREEN_HEIGHT * 0.6,
                    width: SCREEN_WIDTH * 0.8,
                  }}
                  renderItem={({ item, index }) => (
                    <View style={{}}>
                      <TouchableOpacity
                        hitSlop={12}
                        key={index}
                        style={styles.option}
                        onPress={() => handleSelectOption(item)}
                      >
                        {type === "client" ? (
                          <MyText
                            fontType="medium"
                            style={{ fontSize: fp(2.2) }}
                          >
                            {item.company_name}
                          </MyText>
                        ) : type === "location" ? (
                          <MyText fontType="medium">
                            {item.address_line_one}
                          </MyText>
                        ) : type === "status" ? (
                          <MyText fontType="medium">{item}</MyText>
                        ) : null}
                      </TouchableOpacity>
                      <View
                        style={{
                          height: hp(0.1),
                          width: "100%",
                          backgroundColor: "rgba(241,241,241,1)",
                        }}
                      />
                    </View>
                  )}
                />
              )}
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
    borderRadius: fp(1),
    marginBottom: 20,
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
    fontSize: fp(2),
    alignSelf: "center",
    color: AppColors.darkgreyColor,
  },
  anothertxt: {
    fontSize: fp(2),
    alignSelf: "center",
    color: AppColors.darkgreyColor,
  },
});

export default CustomDropdown;
