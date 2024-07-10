import {
  View,
  StyleSheet,
  SafeAreaView,
  Pressable,
  StatusBar,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { AppColors } from "../../utils/colors";
import { SCREEN_WIDTH } from "../../utils/Dimensions";
import Loader from "../../components/Loader";
import CustomIcon from "../../components/customIcon";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ShadowStyle } from "../../utils/constants";
import MyText from "../../components/customtext";
import { useToast } from "react-native-toast-notifications";
import { useFocusEffect } from "@react-navigation/native";
import { fp, hp, wp } from "../../utils/resDimensions";
import { BASE_URL } from "../../services/apiConfig";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import CustomButton from "../../components/customButton";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import RBSheet from "react-native-raw-bottom-sheet";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function ViewInventory({ navigation, route }) {
  const { InventoryId } = route.params;
  const [client, setClient] = useState<string | object>("");
  const toast = useToast();
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const [apiBody, setApiBody] = useState({
    inventory_id: InventoryId,
    quantity: "",
    label: "",
    sku: "",
    description: "",
  });
  const { userData } = useSelector((state: RootState) => state.auth);

  const refRBSheet = useRef();
  useEffect(() => {
    const focusListener = navigation.addListener("focus", () => {
      fetchInventory();
      // getAllClient();
    });

    // Clean up the listener on component unmount
    return () => {
      focusListener();
    };
  }, [navigation]);

  useEffect(() => {
    fetchInventory();
  }, [InventoryId]);

  useFocusEffect(
    useCallback(() => {
      fetchInventory();
      return () => {
        // Clean up function if needed
      };
    }, [navigation])
  );

  const fetchInventory = async () => {
    setIsLoading(true);
    console.log("fetch inventory by id");
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
        setApiBody({
          inventory_id: inventoryData?.inventory_id,
          quantity: inventoryData.quantity,
          label: inventoryData.label,
          sku: inventoryData.sku,
          description: inventoryData.description,
        });
        console.log(
          "🚀 ~ fetchInventory ~ response?.data?.inventory:",
          response?.data
        );
      }
    } catch (error) {
      setIsLoading(false);
      toast.show(error?.response?.data, {
        type: "danger",
      });
      console.log("🚀 ~ getWorkOrderById ~ error:", error);
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
        console.log("response?.data", response?.data);
      }
    } catch (error) {
      console.log("🚀 ~ handleSubmit ~ error response:", error?.response);
      console.log("🚀 ~ handleSubmit ~ error message:", error?.message);
      setIsLoading(false);
      toast.show(error?.response?.data, {
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
                editable={false}
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
              Label
            </MyText>
            <View style={[styles.viewcontainer, styles.outlined]}>
              <TextInput
                // value={item.comments}
                value={data?.label}
                onChangeText={(txt) => handleChange("label", txt)}
                style={[styles.default]}
                editable={isEdit}
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
                value={data?.device_type}
                onChangeText={(txt) => handleChange("device_type", txt)}
                style={[styles.default]}
                multiline
                editable={false}
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
                editable={false}
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
                editable={false}
                multiline
              />
            </View>
          </View>
          <View style={{ marginTop: hp(1) }}>
            <MyText style={{ marginVertical: 5, color: AppColors.black }}>
              Sku
            </MyText>
            <View style={[styles.viewcontainer, styles.outlined]}>
              <TextInput
                // value={item.comments}
                value={data?.sku}
                onChangeText={(txt) => handleChange("sku", txt)}
                style={[styles.default]}
                multiline
                editable={isEdit}
              />
            </View>
          </View>
          <View style={{ marginTop: hp(1) }}>
            <MyText style={{ marginVertical: 5, color: AppColors.black }}>
              Location
            </MyText>
            <View style={[styles.viewcontainer, styles.outlined]}>
              <TextInput
                // value={item.comments}
                value={data?.location}
                onChangeText={(txt) => handleChange("gc", txt)}
                style={[styles.default]}
                multiline
                editable={false}
              />
            </View>
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

        {isEdit ? (
          <View style={{ marginVertical: hp(2) }}>
            <CustomButton title={"Submit"} onPress={handleSubmit} />
          </View>
        ) : (
          <View style={{ marginVertical: hp(2) }}>
            <CustomButton title={"Edit"} onPress={() => setIsEdit(true)} />
          </View>
        )}

        <CustomButton
          title="Transfer Inventory"
          onPress={() => refRBSheet.current.open()}
          isdisabled={false}
        />
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
          WOtranferPress={WOtranferPress}
          LocTransferPress={LocTransferPress}
        />
      </RBSheet>
    </SafeAreaView>
  );
}

export function BottomSheetItem({ WOtranferPress, LocTransferPress }) {
  return (
    <View
      style={[
        {
          marginHorizontal: wp(4),
          marginVertical: hp(2),

          // alignItems: "center",
        },
      ]}
    >
      <MyText style={{ marginVertical: 5, color: AppColors.darkgreyColor }}>
        Options
      </MyText>
      {/* <View></View> */}
      <TouchableOpacity
        style={{
          marginTop: hp(2),
          flexDirection: "row",
          alignItems: "center",
        }}
        onPress={WOtranferPress}
      >
        <FontAwesome name="share-square-o" size={22} color={AppColors.black} />
        <MyText
          style={{
            marginVertical: 5,
            color: AppColors.black,
            fontSize: fp(2),
            marginLeft: wp(4),
          }}
        >
          Transfer Inventory to Workorder
        </MyText>
      </TouchableOpacity>
      <View
        style={{
          height: hp(0.1),
          backgroundColor: AppColors.bluishgrey,
          marginTop: hp(1.2),
        }}
      />
      <TouchableOpacity
        style={{
          marginTop: hp(2),
          flexDirection: "row",
          alignItems: "center",
        }}
        onPress={LocTransferPress}
      >
        <MaterialIcons
          name="share-location"
          size={24}
          color={AppColors.black}
        />
        <MyText
          style={{
            marginVertical: 5,
            color: AppColors.black,
            fontSize: fp(2),
            marginLeft: wp(4),
          }}
        >
          Transfer Inventory to Location
        </MyText>
      </TouchableOpacity>
    </View>
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
});
