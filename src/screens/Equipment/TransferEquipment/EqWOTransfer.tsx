import { useEffect, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useToast } from "react-native-toast-notifications";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import axios from "axios";
import { BASE_URL } from "../../../services/apiConfig";
import Loader from "../../../components/Loader";
import { AppColors } from "../../../utils/colors";
import { fp, hp, wp } from "../../../utils/resDimensions";
import CustomIcon from "../../../components/customIcon";
import MyText from "../../../components/customtext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Fonts, ShadowStyle } from "../../../utils/constants";
import { Dropdown } from "react-native-element-dropdown";
import CustomButton from "../../../components/customButton";
import { SCREEN_WIDTH } from "../../../utils/Dimensions";
import CustomDatePicker from "../../../components/customDatepicker";
import { getFormattedDate, getFullName } from "../../../utils/helperfunctions";

export default function EqWOTransfer({ navigation, route }) {
  const { EquipmentId } = route.params;
  console.log("🚀 ~ WOTransfer ~ InventoryID:", EquipmentId);

  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const [allClient, setAllClient] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [workOrderByClientId, setWorkOrderByClientId] = useState([]);
  const [technicianByWorkOrderId, setTechnicianByWorkOrderId] = useState([]);
  const [workorder, setWorkorder] = useState({});
  const [technician, setTechnician] = useState({});
  const [date, setDate] = useState(Date);
  const { userData } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const focusListener = navigation.addListener("focus", () => {
      getAllClient();
    });

    // Clean up the listener on component unmount
    return () => {
      focusListener();
    };
  }, [navigation]);
  const getAllClient = async () => {
    console.log("🚀 ~ getAllClient ~ userData.token:", userData.token);

    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/client/all`, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      });
      if (response.status === 200) {
        setIsLoading(false);
        // dispatch(getAllClients(response?.data));
        const clientsData = response?.data?.data;
        const clientInfo = clientsData.map((client) => {
          return {
            label: client.company_name,
            value: client.client_id,
          };
        });
        setAllClient(clientInfo);
        // console.log("🚀 ~ getAllClient ~ response?.data):", response?.data);
      }
    } catch (error) {
      console.log("🚀 ~ getAllClient", error);
      setIsLoading(false);
    }
  };
  const getTechnicianByWorkOrder = async (work_order_id) => {
    try {
      const response = await axios.get(
        `${BASE_URL}work_order/by_id/${work_order_id}`,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      if (response.status === 200) {
        const technicians = response?.data?.workOrder?.assignees;
        console.log("technicians", technicians);

        const techniciansInfo = technicians.map((item) => {
          return {
            label: item?.technician_name,
            value: item?.assignee_id,
          };
        });
        setTechnicianByWorkOrderId(techniciansInfo);
      }
    } catch (error) {
      console.log("🚀 ~ getTechnicianByWorkOrder ~ error:", error);
      setIsLoading(false);
    }
  };
  const getWorkOrderByClientId = async (client_id) => {
    console.log("getWorkOrderByClientId", client_id);
    try {
      const response = await axios.get(
        `${BASE_URL}/work_order/by_client/${client_id}`,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      if (response.status === 200) {
        const workOrders = response?.data?.workorders;
        console.log("workorders", workOrders);

        const workOrderInfo = workOrders
          .filter((item) => item.status !== "Closed")
          .map((item) => {
            return {
              label: item.ticket_number,
              value: item?.work_order_id,
            };
          });
        console.log(
          "🚀 ~ getWorkOrderByClientId ~ workOrderInfo:",
          workOrderInfo
        );
        setWorkOrderByClientId(workOrderInfo);
      }
    } catch (error) {
      console.log("🚀 ~ getWorkOrderByClientId ~ error:", error);
      setIsLoading(false);
    }
  };
  const handleSetClient = (item) => {
    getWorkOrderByClientId(item?.value);
    console.log("🚀 ~ handleSetClient ~ item:", item);
  };
  const handleSetWO = (item) => {
    setWorkorder(item);
    getTechnicianByWorkOrder(item.value);
    console.log("🚀 ~ handleSetWO ~ item:", item);
  };
  const handleSetTechnician = (item) => {
    setTechnician(item);
    console.log("🚀 ~ EqWOTransfer ~ item:", item);
  };
  const renderItem = (item, index) => {
    return (
      <View style={styles.item}>
        <Text style={styles.selectedTextStyle}>{item.label}</Text>
      </View>
    );
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    console.log(
      "🚀 ~ handleSubmit ~ Bearer token:",
      `Bearer ${userData.token}`
    );
    console.log("🚀 ~ handleSubmit ~ apiBody.workorder:", workorder);
    const user = userData.user;
    const apiBody = {
      equipment_id: EquipmentId,
      work_order_id: workorder.value,
      user_id: user.user_id,
      user_name: getFullName(user.first_name, user.last_name),
      signed_out: getFormattedDate(date),
    };
    console.log("🚀 ~ handleSubmit ~ apiBody:", apiBody);
    try {
      const response = await axios.post(
        `${BASE_URL}equipment/transfer/work_order`,
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
        navigation?.navigate("Equipment");
      }
    } catch (error) {
      console.log("🚀 ~ handleSubmit ~ error:", error);
      setIsLoading(false);
      toast.show(error?.response?.data?.message, {
        type: "danger",
      });
    }
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
            Assign IDR Equipment to Work Order
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
              Select Client
            </MyText>
            {/* <View style={[styles.viewcontainer, styles.outlined]}> */}
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              iconStyle={styles.iconStyle}
              data={allClient}
              labelField="label"
              valueField="value"
              placeholder="Select Client"
              value={allClient?.value}
              itemTextStyle={styles.itemTextStyle}
              // search
              maxHeight={hp(20)}
              searchPlaceholder="Search..."
              onChange={handleSetClient}
              // renderLeftIcon={() => (
              //   <AntDesign
              //     style={styles.icon}
              //     color="black"
              //     name="Safety"
              //     size={20}
              //   />
              // )}
              renderItem={renderItem}
            />
            {/* </View> */}
          </View>
          <View style={{}}>
            <MyText style={{ marginVertical: hp(1.2), color: AppColors.black }}>
              Select WorkOrder
            </MyText>
            {/* <View style={[styles.viewcontainer, styles.outlined]}> */}
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              iconStyle={styles.iconStyle}
              data={workOrderByClientId}
              labelField="label"
              valueField="value"
              placeholder="Select workorder"
              value={workOrderByClientId?.value}
              itemTextStyle={styles.itemTextStyle}
              maxHeight={hp(20)}
              searchPlaceholder="Search..."
              onChange={handleSetWO}
              renderItem={renderItem}
            />
            {/* </View> */}
          </View>
          <View style={{}}>
            <MyText style={{ marginVertical: hp(1.2), color: AppColors.black }}>
              Assign to Technician
            </MyText>
            {/* <View style={[styles.viewcontainer, styles.outlined]}> */}
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              iconStyle={styles.iconStyle}
              data={technicianByWorkOrderId}
              labelField="label"
              valueField="value"
              placeholder="Select Technician"
              value={technicianByWorkOrderId?.value}
              itemTextStyle={styles.itemTextStyle}
              maxHeight={hp(20)}
              searchPlaceholder="Search..."
              onChange={handleSetTechnician}
              renderItem={renderItem}
            />
          </View>
          <View style={{}}>
            <CustomDatePicker
              date={date}
              setDate={setDate}
              label="Signed Out date"
              minimumDate={new Date()}
            />
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
});
