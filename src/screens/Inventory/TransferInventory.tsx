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
      const response = await axios.get(`${BASE_URL}/inventory/${InventoryId}`, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      });
      if (response.status === 200) {
        setIsLoading(false);
        setData(response?.data?.inventory);
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
    try {
      const response = await axios.post(
        `${BASE_URL}/inventory/update`,
        apiBody,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      if (response.status === 200) {
        setIsLoading(false);
        setData(response?.data?.inventory);
      }
    } catch (error) {
      setIsLoading(false);
      toast.show(error?.response?.data, {
        type: "danger",
      });
      console.log("🚀 ~ getWorkOrderById ~ error:", error);
    }
  };

  const handleChange = (key, val) => {
    setApiBody((prev) => ({ ...prev, [key]: val }));
    setData((prev) => ({ ...prev, [key]: val }));
  };
  const WOtranferPress = () => {
    console.log("Transfer inventory to workorder");
  };
  const LocTransferPress = () => {
    console.log("Transfer inventory to location");
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
          <View style={{ marginTop: hp(1) }}>
            <MyText style={{ marginVertical: 5, color: AppColors.black }}>
              Model
            </MyText>
            <View style={[styles.viewcontainer, styles.outlined]}>
              <TextInput
                // value={item.comments}
                value={data?.model}
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
                style={[styles.default]}
                multiline
                editable={false}
              />
            </View>
          </View>
        </View>

        <CustomButton
          title="Transfer Inventory"
          onPress={() => console.log("sdfas")}
          //   onPress={() => refRBSheet.current.open()}
          isdisabled={false}
        />
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
});
