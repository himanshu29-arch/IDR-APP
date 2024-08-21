import {
  View,
  StyleSheet,
  SafeAreaView,
  Pressable,
  StatusBar,
  TextInput,
  PermissionsAndroid,
  Platform,
  Image,
  Text,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { AppColors } from "../../../utils/colors";
import { SCREEN_WIDTH } from "../../../utils/Dimensions";
import Loader from "../../../components/Loader";
import CustomIcon from "../../../components/customIcon";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Fonts, ShadowStyle } from "../../../utils/constants";
import MyText from "../../../components/customtext";
import { useToast } from "react-native-toast-notifications";
import { fp, hp, wp } from "../../../utils/resDimensions";
import { BASE_URL } from "../../../services/apiConfig";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import CustomButton from "../../../components/customButton";
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";

import { launchImageLibrary } from "react-native-image-picker";
import { Dropdown } from "react-native-element-dropdown";

export default function AddInventory({ navigation }) {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [equipmentBody, setEquipmentBody] = useState({});
  const [location, setLocation] = useState();
  const [locationOptions, setLocationOptions] = useState([]);
  const [imageResponse, setImageResponse] = useState<ImageAsset | {}>({});
  const { userData } = useSelector((state: RootState) => state.auth);

  const postEquipment = async () => {
    setIsLoading(true);
    console.log("Post equipment by id");
    const formData = new FormData();
    formData.append("serial_number", equipmentBody?.serial_number);
    formData.append("make", equipmentBody?.make);
    formData.append("model", equipmentBody?.model);
    formData.append("device_type", equipmentBody?.device_type);
    formData.append("mac_address", equipmentBody?.mac_address);
    formData.append("location_id", location?.value);
    formData.append("location_name", location?.label);
    formData.append("description", equipmentBody?.description);
    if (Object.keys(imageResponse).length !== 0) {
      formData.append("image", {
        uri: imageResponse?.uri,
        name: imageResponse?.fileName,
        type: imageResponse?.type,
      });
    }
    console.log("🚀 ~ postEquipment ~ formData:", JSON.stringify(formData));
    console.log(JSON.stringify(formData));
    console.log("🚀 ~ postEquipment ~ userData?.token:", userData?.token);

    try {
      const response = await axios.post(`${BASE_URL}equipment/add`, formData, {
        headers: {
          Authorization: `Bearer ${userData?.token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        setIsLoading(false);
        navigation.navigate("Equipment");
        console.log("response.data", response?.data);
      }
    } catch (error) {
      setIsLoading(false);
      console.log("🚀 ~ getWorkOrderById ~ error:", error);

      // Snackbar.show({
      //   text: error.response.data.message,
      //   duration: 4000,
      //   backgroundColor: AppColors.red,
      // });
    }
  };

  const getAllLocations = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(`${BASE_URL}/inv_loc/all`, {
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
      console.log("🚀 ~ AddEquipment --> handleGetLocation ~ error:", error);
      setIsLoading(false);
      toast.show(error?.response?.data, {
        type: "danger",
      });
    }
  };

  useEffect(() => {
    getAllLocations();
  }, []);

  const handleChange = (key, val) => {
    setEquipmentBody((prevState) => ({
      ...prevState,
      [key]: val,
    }));
  };

  const handleOpenGallery = async () => {
    if (Platform.OS === "android") {
      if (Number(Platform.Version) >= 33) {
      } else {
        const isStoragePermitted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: "Storage Permission",
            message:
              "This app needs access to your device storage to read files.",
            buttonPositive: "OK",
            buttonNegative: "Cancel",
          }
        );
        console.log(
          "🚀 ~ handleOpenGallery ~ isStoragePermitted:",
          isStoragePermitted
        );

        if (isStoragePermitted !== PermissionsAndroid.RESULTS.GRANTED) {
          toast.show("Storage permission denied", { type: "danger" });
          return;
        }
      }
    }

    launchImageLibrary(
      {
        mediaType: "photo",
      },
      (response) => {
        if (response.didCancel) {
          toast.show("Operation Cancelled", {
            type: "danger",
          });
          return;
        } else if (response.errorCode == "camera_unavailable") {
          toast.show("Operation Cancelled", {
            type: "danger",
          });
          return;
        } else if (response.errorCode == "permission") {
          toast.show("Operation Cancelled", {
            type: "danger",
          });
          return;
        } else if (response.errorCode == "others") {
          toast.show("Operation Cancelled", {
            type: "danger",
          });
          return;
        } else {
          setImageResponse(response?.assets[0]);
          console.log(
            "🚀 ~ handleOpenGallery ~ response?.assets[0]:",
            response?.assets[0]
          );
          return;
        }
      }
    );
  };
  const handleSetLocation = (item) => {
    setLocation((prev) => (prev === item ? null : item));
  };
  const renderItem = (item, index) => {
    return (
      <View style={styles.item}>
        <Text style={styles.selectedTextStyle}>{item.label}</Text>
      </View>
    );
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
            Add Equipment
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

            {/* { ticket ?
                     <CustomButton
                     title={"Submit"}
                     onPress={handleSubmit(onSubmit)}
                     />
                     :
                     <CustomButton
                     title={"Edit"}
                     onPress={() => setTicket(true)}
                     />
                   } */}
          </View>
          <View style={{}}>
            <MyText style={{ marginVertical: 5, color: AppColors.black }}>
              Serial Number
            </MyText>
            <View style={[styles.viewcontainer, styles.outlined]}>
              <TextInput
                // value={item.comments}
                value={equipmentBody?.serial_number}
                onChangeText={(txt) => handleChange("serial_number", txt)}
                style={[styles.default]}
                editable={true}
                multiline
              />
            </View>
          </View>
          <View style={{}}>
            <MyText style={{ marginVertical: 5, color: AppColors.black }}>
              Make
            </MyText>
            <View style={[styles.viewcontainer, styles.outlined]}>
              <TextInput
                // value={item.comments}
                value={equipmentBody?.make}
                onChangeText={(txt) => handleChange("make", txt)}
                style={[styles.default]}
                editable={true}
                multiline
              />
            </View>
          </View>
          <View style={{ marginTop: hp(1) }}>
            <MyText style={{ marginVertical: 5, color: AppColors.black }}>
              Model
            </MyText>
            <View style={[styles.viewcontainer, styles.outlined]}>
              <TextInput
                // value={item.comments}
                value={equipmentBody?.model}
                onChangeText={(txt) => handleChange("model", txt)}
                style={[styles.default]}
                editable={true}
                multiline
              />
            </View>
          </View>
          <View style={{ marginTop: hp(1) }}>
            <MyText style={{ marginVertical: 5, color: AppColors.black }}>
              Device type
            </MyText>
            <View style={[styles.viewcontainer, styles.outlined]}>
              <TextInput
                // value={item.comments}
                value={equipmentBody?.device_type}
                onChangeText={(txt) => handleChange("device_type", txt)}
                style={[styles.default]}
                editable={true}
                multiline
              />
            </View>
          </View>
          <View style={{ marginTop: hp(1) }}>
            <MyText style={{ marginVertical: 5, color: AppColors.black }}>
              Mac Address
            </MyText>
            <View style={[styles.viewcontainer, styles.outlined]}>
              <TextInput
                // value={item.comments}
                value={equipmentBody?.mac_address}
                onChangeText={(txt) => handleChange("mac_address", txt)}
                style={[styles.default]}
                editable={true}
                multiline
              />
            </View>
          </View>
          <View style={{ marginTop: hp(1) }}>
            <MyText style={{ marginVertical: 5, color: AppColors.black }}>
              Location
            </MyText>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              iconStyle={styles.iconStyle}
              data={locationOptions}
              labelField="label"
              valueField="value"
              placeholder="Select status"
              value={location?.value}
              itemTextStyle={styles.itemTextStyle}
              // search
              searchPlaceholder="Search..."
              onChange={handleSetLocation}
              renderItem={renderItem}
            />
          </View>
          <View style={{ marginTop: hp(1) }}>
            <MyText style={{ marginVertical: 5, color: AppColors.black }}>
              Description
            </MyText>
            <View style={[styles.viewcontainer, styles.outlined]}>
              <TextInput
                // value={item.comments}
                value={equipmentBody?.description}
                onChangeText={(txt) => handleChange("description", txt)}
                style={[styles.default]}
                editable={true}
                multiline
              />
            </View>
          </View>
          <View style={{ marginTop: hp(1) }}>
            <MyText style={{ marginVertical: 5, color: AppColors.black }}>
              QR code
            </MyText>
            {/* <View style={[styles.viewcontainer, styles.outlined]}> */}

            <Pressable
              onPress={
                Object.keys(imageResponse).length === 0
                  ? handleOpenGallery
                  : null
              }
              style={[
                {
                  height:
                    Object.keys(imageResponse).length === 0 ? hp(6) : hp(12),
                  backgroundColor: "rgba(0,0,0,0.01)",
                  borderWidth: 1,
                  borderRadius: 10,
                  borderColor: AppColors.darkgrey,
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                },
              ]}
            >
              {Object.keys(imageResponse).length === 0 ? (
                <>
                  <MyText
                    style={{
                      marginHorizontal: 5,
                      color: AppColors?.darkgreyColor,
                    }}
                  >
                    Click here to upload
                  </MyText>
                  <Ionicons
                    name="cloud-upload-outline"
                    size={24}
                    color={AppColors?.darkgreyColor}
                  />
                </>
              ) : (
                <>
                  <Image
                    source={{ uri: imageResponse?.uri }}
                    style={{
                      height: hp(10),
                      width: wp(70),
                      alignSelf: "center",
                    }}
                    resizeMode="cover"
                  />
                  <Pressable
                    onPress={() => setImageResponse({})}
                    style={{ position: "absolute", right: 0, top: 0 }}
                  >
                    <Entypo name="circle-with-cross" size={24} color="red" />
                  </Pressable>
                </>
              )}
            </Pressable>
            {/* </View> */}
          </View>
        </View>

        <View style={{ marginTop: hp(2) }}>
          <CustomButton
            title="Add"
            onPress={postEquipment}
            isdisabled={false}
          />
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
  dropdown: {
    height: 50,
    backgroundColor: AppColors.darkgrey,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
});
