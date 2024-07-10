import {
  View,
  StyleSheet,
  SafeAreaView,
  Pressable,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useToast } from "react-native-toast-notifications";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { useSelector } from "react-redux";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import RBSheet from "react-native-raw-bottom-sheet";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { RootState } from "../../../redux/store";
import { BASE_URL } from "../../../services/apiConfig";
import Loader from "../../../components/Loader";
import { AppColors } from "../../../utils/colors";
import { fp, hp, wp } from "../../../utils/resDimensions";
import CustomIcon from "../../../components/customIcon";
import MyText from "../../../components/customtext";
import { Fonts, ShadowStyle } from "../../../utils/constants";
import CustomButton from "../../../components/customButton";
import { SCREEN_WIDTH } from "../../../utils/Dimensions";
import { Dropdown } from "react-native-element-dropdown";

export default function LocTransfer({ navigation, route }) {
  const { InventoryId } = route.params;
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState();
  const [location, setLocation] = useState();
  const [locationOptions, setLocationOptions] = useState([]);
  const { userData } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    getAllLocations();
  }, []);

  const renderItem = (item, index) => {
    return (
      <View style={styles.item}>
        <Text style={styles.selectedTextStyle}>{item.label}</Text>
      </View>
    );
  };
  const handleSetLoc = (item) => {
    setLocation(item);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    console.log(
      "🚀 ~ handleSubmit ~ Bearer token:",
      `Bearer ${userData.token}`
    );
    const apiBody = {
      inventory_id: InventoryId,
      location_id: location?.value,
      quantity: quantity,
    };
    console.log("🚀 ~ handleSubmit ~ apiBody:", apiBody);
    try {
      const response = await axios.post(
        `${BASE_URL}inventory/location/transfer`,
        apiBody,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      if (response.status === 200) {
        setIsLoading(false);
        console.log("response?.data", response?.data);
        toast.show(response?.data?.message, {
          type: "success",
        });
        navigation?.navigate("Inventory");
      }
    } catch (error) {
      console.log("🚀 ~ handleSubmit ~ error:", error);
      setIsLoading(false);
      toast.show(error?.response?.data?.message, {
        type: "danger",
      });
    }
  };

  const getAllLocations = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(`${BASE_URL}inv_loc/all`, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      });
      if (response.status === 200) {
        setIsLoading(false);
        const data = response?.data?.locations.map((location) => ({
          label: location.location,
          value: location.inventory_location_id,
        }));

        setLocationOptions(data);
      }
    } catch (error) {
      console.log("🚀 ~ AddInventory --> handleGetLocation ~ error:", error);
      setIsLoading(false);
      toast.show(error?.response?.data, {
        type: "danger",
      });
    }
  };

  const handleQunatityChange = (item) => {
    setQuantity(Number(item));
  };

  return (
    <SafeAreaView style={styles.conatiner}>
      <Loader loading={isLoading} />
      <StatusBar
        backgroundColor={AppColors.white}
        barStyle={"dark-content"}
        translucent={false}
      />
      <View style={styles.mainrow}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginLeft: wp(5),
          }}
        >
          <Pressable
            onPress={() => navigation.goBack()}
            style={{
              padding: 5,
              borderRadius: 50,
              borderColor: AppColors.iconsGrey,
              borderWidth: 1,
            }}
          >
            <CustomIcon name="arrow-back" />
          </Pressable>
          <MyText fontType="bold" style={{ marginLeft: 20, fontSize: 20 }}>
            Transfer Inventory to Location
          </MyText>
        </View>
      </View>
      <KeyboardAwareScrollView style={{ marginTop: 30 }}>
        <View style={[styles.card, ShadowStyle]}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <MyText
              fontType="bold"
              style={{ fontSize: 16, marginBottom: hp(2) }}
            >
              Details
            </MyText>
          </View>
          <View style={{}}>
            <MyText style={{ marginVertical: hp(1.2), color: AppColors.black }}>
              Select Location
            </MyText>
            {/* <View style={[styles.viewcontainer, styles.outlined]}> */}
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              iconStyle={styles.iconStyle}
              data={locationOptions}
              labelField="label"
              valueField="value"
              placeholder="Select Location"
              value={locationOptions?.value}
              itemTextStyle={styles.itemTextStyle}
              maxHeight={hp(20)}
              searchPlaceholder="Search..."
              onChange={handleSetLoc}
              renderItem={renderItem}
            />
            {/* </View> */}
          </View>
          <View style={{}}>
            <MyText style={{ marginVertical: hp(1.2), color: AppColors.black }}>
              Quantity
            </MyText>
            <View style={[styles.viewcontainer, styles.outlined]}>
              <TextInput
                // value={item.comments}
                value={quantity}
                onChangeText={handleQunatityChange}
                style={[styles.default]}
                multiline
                editable={true}
                keyboardType="number-pad"
              />
            </View>
          </View>
        </View>

        <View style={{ marginVertical: hp(2) }}>
          <CustomButton title={"Submit"} onPress={handleSubmit} />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    backgroundColor: AppColors.white,
    padding: 10,
  },
  mainrow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  card: {
    backgroundColor: AppColors.white,
    width: SCREEN_WIDTH * 0.9,
    alignSelf: "center",
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
  },
  default: {
    width: "85%",
    borderRadius: 5,
    padding: 10,
    color: "black",
  },
  outlined: {
    borderWidth: 1,
    borderRadius: 10,
  },
  viewcontainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: AppColors.darkgrey,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 30,
    right: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  dropdown: {
    height: 50,
    backgroundColor: AppColors.darkgrey,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  selectedTextStyle: {
    // fontSize: 16,
    fontFamily: Fonts.REGULAR,
    borderRadius: fp(1),
    color: AppColors.black,
  },
  item: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemTextStyle: {
    fontSize: 16,
    color: AppColors.red,
    fontFamily: Fonts.REGULAR,
  },
  iconStyle: {
    width: 28,
    height: 28,
    color: "black",
  },
  placeholderStyle: {
    // fontSize: 16,
    color: AppColors.grey,
    fontFamily: Fonts.REGULAR,
  },
});
