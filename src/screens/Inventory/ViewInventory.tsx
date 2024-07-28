import {
  View,
  StyleSheet,
  SafeAreaView,
  Pressable,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Alert,
  Text,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { AppColors } from "../../utils/colors";
import { SCREEN_WIDTH } from "../../utils/Dimensions";
import Loader from "../../components/Loader";
import CustomIcon from "../../components/customIcon";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Fonts, ShadowStyle } from "../../utils/constants";
import MyText from "../../components/customtext";
import { useToast } from "react-native-toast-notifications";
import { useFocusEffect } from "@react-navigation/native";
import { fp, hp, wp } from "../../utils/resDimensions";
import { BASE_URL } from "../../services/apiConfig";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import CustomButton from "../../components/customButton";

import RBSheet from "react-native-raw-bottom-sheet";
import { BottomSheetItem } from "../../components/BottomSheetItem";
import { Dropdown } from "react-native-element-dropdown";
import {
  keysToRemoveFromInventoryResToEditInventory,
  removeKeys,
} from "../../utils";

export default function ViewInventory({ navigation, route }) {
  const { InventoryId } = route.params;

  const toast = useToast();
  const [isEdit, setIsEdit] = useState(false);

  const [menuPress, setMenuPress] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const [locationOptions, setLocationOptions] = useState([]);
  const [location, setLocation] = useState({});
  const [apiBody, setApiBody] = useState({});
  const { userData } = useSelector((state: RootState) => state.auth);

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
      console.log("🚀 ~ AddInventory --> handleGetLocation ~ error:", error);
      setIsLoading(false);
      toast.show(error?.response?.data?.message, {
        type: "danger",
      });
    }
  };

  useEffect(() => {
    getAllLocations();
  }, []);

  const refRBSheet = useRef();
  useEffect(() => {
    const focusListener = navigation.addListener("focus", () => {
      fetchInventory();
    });

    // Clean up the listener on component unmount
    return () => {
      focusListener();
    };
  }, [navigation]);

  useEffect(() => {
    fetchInventory();
  }, [InventoryId]);

  // useFocusEffect(
  //   useCallback(() => {
  //     fetchInventory();
  //     return () => {
  //       // Clean up function if needed
  //     };
  //   }, [navigation])
  // );

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
  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}inventory/${InventoryId}`, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      });
      if (response.status === 200) {
        setIsLoading(false);
        const inventoryData = response?.data?.inventory;
        setData(inventoryData);
        const apiBody = removeKeys(
          inventoryData,
          keysToRemoveFromInventoryResToEditInventory
        );

        setLocation({
          label: inventoryData.location,
          value: inventoryData.location_id,
        });
        setApiBody(apiBody);
      }
    } catch (error) {
      setIsLoading(false);
      toast.show(error?.response?.data?.message, {
        type: "danger",
      });
    }
  };
  const handleSubmit = async () => {
    setIsLoading(true);
    console.log("edit inventory", apiBody);
    console.log(
      "🚀 ~ handleSubmit ~ Bearer token:",
      `Bearer ${userData.token}`
    );
    try {
      const response = await axios.post(
        `${BASE_URL}inventory/update`,
        apiBody,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      if (response.status === 200) {
        setIsLoading(false);
        setIsEdit(false);
        toast.show(response?.data?.message, {
          type: "success",
        });
        navigation?.navigate("Inventory");
      }
    } catch (error) {
      console.log("🚀 ~ handleSubmit ~ error response:", error?.response?.data);
      setIsLoading(false);
      toast.show(error?.response?.data?.message, {
        type: "danger",
      });
    }
  };

  const handleChange = (key, val) => {
    setApiBody((prev) => ({ ...prev, [key]: val }));
    setData((prev) => ({ ...prev, [key]: val }));
  };
  const WOtranferPress = () => {
    navigation.navigate("WOTransfer", { InventoryId: InventoryId });
    refRBSheet.current.close();
  };
  const LocTransferPress = () => {
    navigation.navigate("LocTransfer", { InventoryId: InventoryId });
    refRBSheet.current.close();
  };

  const onDeleteConfirm = async () => {
    setIsLoading(true);
    let url = `${BASE_URL}inventory/${InventoryId}`;
    try {
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      });
      if (response.status === 200) {
        navigation?.navigate("Inventory");
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleDeleteInventory = () => {
    Alert.alert(
      "Are you sure?",
      "Do you really want to delete this Inventory?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => onDeleteConfirm(),
        },
      ],
      { cancelable: false }
    );
    refRBSheet.current.close();
  };

  const BottomSheetData = [
    {
      label: "Transfer Inventory to Workorder",
      iconFamily: "FontAwesome",
      iconName: "share-square-o",
      value: "tranfer_inventory_wo",
      onPress: WOtranferPress,
    },
    {
      label: "Transfer Inventory to Location",
      iconFamily: "MaterialIcons",
      iconName: "share-location",
      value: "transfer_inventory_loc",
      onPress: LocTransferPress,
    },
  ];

  const BottomSheetDataDeleteItem = [
    {
      label: "Delete Inventory",
      iconFamily: "Ionicons",
      iconName: "trash-bin",
      value: "delete_inventory",
      onPress: handleDeleteInventory,
    },
  ];

  const userType = userData?.user?.user_type;

  const isNotIDROrClientEmployee =
    userType !== "IDR Employee" && userType !== "Client Employee";
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
            Inventory Details
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
            <CustomIcon
              name="ellipsis-vertical"
              onPress={() => {
                setMenuPress(true);
                refRBSheet.current.open();
              }}
            />
          </View>
          <View style={{}}>
            <MyText style={{ marginVertical: 5, color: AppColors.black }}>
              Make
            </MyText>
            <View style={[styles.viewcontainer, styles.outlined]}>
              <TextInput
                // value={item.comments}
                value={data?.make}
                onChangeText={(txt) => handleChange("make", txt)}
                style={[styles.default]}
                multiline
                editable={isEdit}
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
                value={data?.model}
                onChangeText={(txt) => handleChange("make", txt)}
                style={[styles.default]}
                multiline
                editable={false}
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
                value={data?.device_type}
                onChangeText={(txt) => handleChange("device_type", txt)}
                style={[styles.default]}
                multiline
                editable={isEdit}
              />
            </View>
          </View>
          <View style={{ marginTop: hp(1) }}>
            <MyText style={{ marginVertical: 5, color: AppColors.black }}>
              Quantity
            </MyText>
            <View style={[styles.viewcontainer, styles.outlined]}>
              <TextInput
                // value={item.comments}
                value={data?.quantity ? data?.quantity.toString() : "-"}
                onChangeText={(txt) => handleChange("quantity", Number(txt))}
                style={[styles.default]}
                editable={isEdit}
                multiline
                keyboardType="number-pad"
              />
            </View>
          </View>
          <View style={{ marginTop: hp(1) }}>
            <MyText style={{ marginVertical: 5, color: AppColors.black }}>
              Size
            </MyText>
            <View style={[styles.viewcontainer, styles.outlined]}>
              <TextInput
                // value={item.comments}
                value={data?.size}
                onChangeText={(txt) => handleChange("size", txt)}
                style={[styles.default]}
                editable={isEdit}
                multiline
                keyboardType="number-pad"
              />
            </View>
          </View>
          <View style={{ marginTop: hp(1) }}>
            <MyText style={{ marginVertical: 5, color: AppColors.black }}>
              Color
            </MyText>
            <View style={[styles.viewcontainer, styles.outlined]}>
              <TextInput
                // value={item.comments}
                value={data?.color}
                onChangeText={(txt) => handleChange("color", txt)}
                style={[styles.default]}
                editable={isEdit}
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
              placeholder="Select Location"
              value={location?.value}
              itemTextStyle={styles.itemTextStyle}
              onChange={handleSetLocation}
              renderItem={renderItem}
              maxHeight={hp(20)}
              disable={!isEdit}
              containerStyle={{ borderRadius: fp(1.4), padding: hp(0.8) }}
            />
          </View>

          <View style={{ marginTop: hp(1) }}>
            <MyText style={{ marginVertical: 5, color: AppColors.black }}>
              Description
            </MyText>
            <View style={[styles.viewcontainer, styles.outlined]}>
              <TextInput
                // value={item.comments}
                value={data?.description}
                onChangeText={(txt) => handleChange("description", txt)}
                style={[styles.default]}
                editable={isEdit}
                multiline
              />
            </View>
          </View>
        </View>
        {isNotIDROrClientEmployee ? (
          <View style={{ marginVertical: hp(2) }}>
            <CustomButton
              title={isEdit ? "Submit" : "Edit"}
              onPress={isEdit ? handleSubmit : () => setIsEdit(true)}
            />
          </View>
        ) : null}
        {userData?.user?.user_type !== "Client Employee" && (
          <CustomButton
            title="Transfer Inventory"
            onPress={() => {
              setMenuPress(false);
              refRBSheet.current.open();
            }}
            isdisabled={false}
            _width={wp(90)}
          />
        )}
      </KeyboardAwareScrollView>
      <RBSheet
        ref={refRBSheet}
        useNativeDriver={false}
        height={hp(30)}
        draggable
        customStyles={{
          wrapper: {
            backgroundColor: "transparent",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.5,
            shadowRadius: 4.65,

            elevation: 6,
          },
          draggableIcon: {
            marginTop: hp(3),
            width: wp(15),
            backgroundColor: "rgba(236, 236, 236, 1)",
          },
        }}
        customModalProps={{
          animationType: "slide",
          statusBarTranslucent: true,
        }}
        customAvoidingViewProps={{
          enabled: false,
        }}
      >
        <BottomSheetItem
          BottomSheetData={
            menuPress == true
              ? BottomSheetDataDeleteItem
              : userData?.user?.user_type === "IDR Employee"
              ? [BottomSheetData[0]]
              : BottomSheetData
          }
        />
      </RBSheet>
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
  itemTextStyle: {
    fontSize: 16,
    color: AppColors.red,
    fontFamily: Fonts.REGULAR,
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
    height: 40,
    backgroundColor: AppColors.darkgrey,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  placeholderStyle: {
    // fontSize: 16,
    color: AppColors.grey,
    fontFamily: Fonts.REGULAR,
  },
  selectedTextStyle: {
    // fontSize: 16,
    fontFamily: Fonts.REGULAR,
    borderRadius: fp(1),
    color: AppColors.black,
  },
  iconStyle: {
    width: 28,
    height: 28,
    color: "black",
  },
  item: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
