import {
  View,
  Text,
  StatusBar,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Linking,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { ImagePaths } from "../../utils/imagepaths";
import { AppColors } from "../../utils/colors";
import MyText from "../../components/customtext";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../utils/Dimensions";
import CustomIcon from "../../components/customIcon";
import CustomDropdown from "../../components/customDropdown";
import { IconsPath } from "../../utils/InconsPath";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  useGetAllClientQuery,
  useGetAllWorkOrderQuery,
  useGetWorkOrderByClientIdQuery,
} from "../../services/RTKClient";
import Loader from "../../components/Loader";
import { Fonts, dashboardStatusData } from "../../utils/constants";
import { fp, hp, wp } from "../../utils/resDimensions";
import { countStatuses } from "../../utils/dashboardHelpers/helpers";
import axios from "axios";
import { BASE_URL } from "../../services/apiConfig";
import Snackbar from "react-native-snackbar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signOut } from "../../redux/slices/authSlice";
import { useFocusEffect } from "@react-navigation/native";
import { setQRData } from "../../redux/slices/QRDataSlice";
import messaging from "@react-native-firebase/messaging";
import { checkAndUploadFCMPermission } from "../../utils/notiHelper";
import { setEquipmentQRData } from "../../redux/slices/EquipmentQRDataSlice";
export default function Dashboard({ navigation }) {
  const [select, setSelect] = useState({});
  const [counts, setCounts] = useState({
    Closed: 0,
    Design: 0,
    InProgress: 0,
    Open: 0,
    Reviewing: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [allClient, setAllClient] = useState({});
  const [workOrderByClientId, setWorkOrderByClientId] = useState([]);
  const { userData } = useSelector((state: RootState) => state.auth);
  const firstNameInitial = userData?.user?.first_name?.[0] || "";
  const lastNameInitial = userData?.user?.last_name?.[0] || "";
  // const {
  //   data: clientData,
  //   isLoading,
  //   refetch: getAllRefetch,
  // } = useGetAllClientQuery();
  const {
    data: workOrders,
    error,
    isLoading: isLoadingAllWorkOrder,
    refetch: allWorkOrderRefetch,
  } = useGetAllWorkOrderQuery();
  const dispatch = useDispatch();
  const [showAllItems, setShowAllItems] = useState(false);
  useFocusEffect(
    useCallback(() => {
      getWorkOrderByClientId();
      // If you want to fetch clients as well, you can call getAllClient() here
      // getAllClient();
    }, [select])
  );
  console.log("🚀 ~ getWorkOrderByClientId ~ userData.token:", userData.token);
  const getWorkOrderByClientId = async () => {
    console.log("getWorkOrderByClientId", select?.client_id);
    try {
      const response = await axios.get(
        `${BASE_URL}/work_order/by_client/${select?.client_id}`,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      if (response.status === 200) {
        console.log("render open work order api done ");
        setWorkOrderByClientId(response?.data?.workorders);

        const OpenOrder = response?.data?.workorders.filter(
          (i) => i.status === "Open"
        );
        setOpenWorkOrder(OpenOrder);
        const tempCount = countStatuses(response?.data?.workorders);
        setCounts(tempCount);
      }
    } catch (error) {
      console.log("🚀 ~ getWorkOrderByClientId ~ error:", error);
      setIsLoading(false);
      if (error.response && error.response.status === 401) {
        // Dispatch the logout action
        AsyncStorage.removeItem("persist:root").then(() => {
          dispatch(signOut());
        });
      }
    }
  };

  useEffect(() => {
    dispatch(setQRData(""));
    dispatch(setEquipmentQRData(""));
  }, []);

  const [openWorkOrder, setOpenWorkOrder] = useState([]);

  const toggleShowAllItems = () => {
    setShowAllItems(!showAllItems);
  };

  const renderStatus = ({ item, index }) => {
    let count = 0;

    switch (item.value) {
      case "all":
        count = workOrderByClientId.length;
        break;
      case "Design":
        count = counts.Design;
        break;
      case "In Progress":
        count = counts.InProgress;
        break;
      case "Reviewing":
        count = counts.Reviewing;
        break;
      case "Closed":
        count = counts.Closed;
        break;
      case "Open":
        count = counts.Open;
        break;
      default:
        count = 0;
    }
    return (
      <View style={styles.assigncontainer}>
        <View style={styles.opentasks}>
          <MyText
            style={{
              color: AppColors.darkgreyColor,
              alignSelf: "center",
              fontSize: fp(2.4),
              fontFamily: Fonts.MEDIUM,
            }}
          >
            {count}
          </MyText>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: hp(1),
          }}
        >
          <Image
            source={item.img}
            style={{ width: 12, height: 12, marginRight: 10 }}
          />
          <MyText style={{ fontSize: 14 }}>{item.name}</MyText>
        </View>
      </View>
    );
  };
  return (
    <ScrollView>
      <StatusBar translucent={true} />
      {/* <Loader loading={isLoading || isLoading1} /> */}
      <View>
        <StatusBar translucent backgroundColor="transparent" />
        <View style={styles.blueContainer}>
          <Image
            source={ImagePaths.TOPCIRCLE}
            style={{ width: 190, marginTop: -65, position: "absolute" }}
            resizeMode="contain"
          />
          <View style={styles.mainRow}>
            <View style={styles.row}>
              <View style={styles.nameBanner}>
                <MyText
                  fontType="bold"
                  style={{
                    fontSize: 20,
                    color: AppColors.primary,
                    fontWeight: "800",
                  }}
                >
                  {firstNameInitial}
                  {lastNameInitial}
                </MyText>
              </View>
              <View style={{ marginLeft: 10 }}>
                <MyText
                  fontType="bold"
                  style={{
                    fontSize: 20,
                    color: AppColors.white,
                    fontFamily: Fonts.InterBold,
                  }}
                >
                  {userData?.user?.first_name} {userData?.user?.last_name}
                </MyText>
                <MyText
                  style={{
                    fontSize: 16,
                    color: AppColors.InActiveBottomC,
                  }}
                >
                  {userData?.user?.user_type}
                </MyText>
              </View>
            </View>

            <View style={[styles.nameBanner, styles.row]}>
              <CustomIcon
                name="notifications-outline"
                onPress={() => navigation.navigate("Notifications")}
                // onPress={() => navigation.navigate("ScanQR")}
              />
            </View>
          </View>
        </View>
        {/* Card */}

        <View style={[styles.card, { marginTop: -SCREEN_HEIGHT * 0.2 }]}>
          {userData?.user?.user_type === "Admin" ? (
            <>
              <MyText
                fontType="medium"
                style={{ fontSize: 18, marginVertical: 10 }}
              >
                Select Client
              </MyText>

              <CustomDropdown
                options={allClient?.data}
                type="client"
                defaultOption={""}
                onSelect={setSelect}
                isDarker
              />
            </>
          ) : null}

          <Pressable
            onPress={toggleShowAllItems}
            style={{
              flexDirection: "row",
              marginTop: hp(1),
              alignItems: "center",
            }}
          >
            <MyText fontType="medium" style={{ fontSize: 18 }}>
              Assignments
            </MyText>
            <Ionicons
              size={25}
              color={AppColors.black}
              name={showAllItems ? "chevron-up" : "chevron-down"}
              style={{ marginLeft: "auto", marginRight: wp(2) }}
            />
          </Pressable>

          <FlatList
            data={
              showAllItems
                ? dashboardStatusData
                : dashboardStatusData.slice(0, 2)
            }
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            renderItem={renderStatus}
            numColumns={2}
          />
        </View>
        <View style={styles.card}>
          <MyText fontType="medium" style={{ fontSize: 18 }}>
            Open Work Order
          </MyText>
          <FlatList
            data={openWorkOrder}
            scrollEnabled={false}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("ViewWorkOrder", {
                    OrderId: item.work_order_id,
                  })
                }
                style={{
                  backgroundColor: AppColors.lightgrey,
                  padding: 15,
                  borderRadius: 5,
                  justifyContent: "space-between",
                  flexDirection: "row",
                  marginTop: index == 0 ? hp(2) : hp(1),
                  marginVertical: 5,
                }}
              >
                <MyText style={{ fontSize: 14 }}>{item.issue}</MyText>
                <CustomIcon name="chevron-forward" />
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  blueContainer: {
    backgroundColor: AppColors.primary,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    paddingBottom: 30,
  },
  mainRow: {
    flexDirection: "row",
    height: SCREEN_HEIGHT * 0.35,
    justifyContent: "space-between",
  },
  nameBanner: {
    backgroundColor: AppColors.white,
    borderRadius: 50,
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  subtitle: {
    fontSize: 16,
    color: AppColors.primary,
    backgroundColor: AppColors.white,
    borderRadius: 50,
    padding: 8,
  },
  card: {
    backgroundColor: AppColors.white,
    width: SCREEN_WIDTH * 0.9,
    alignSelf: "center",
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
    shadowColor: "#000", // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.18, // Shadow opacity
    shadowRadius: 2, // Shadow radius
    elevation: 2,
  },
  row: {
    marginTop: 50,
    marginHorizontal: 20,
    flexDirection: "row",
    // alignItems: "center",
  },
  assigncontainer: {
    height: hp(10),
    width: wp(35),
    backgroundColor: AppColors.lightgrey,
    alignItems: "center",
    margin: 10,
    borderRadius: fp(1),
    justifyContent: "center",
  },
  opentasks: {
    backgroundColor: AppColors.darkgrey,
    borderRadius: fp(20),
    justifyContent: "center",
    aspectRatio: 1, // This will maintain a 1:1 aspect ratio (width:height)
    alignItems: "center",
    padding: fp(1),
    // minWidth: fp(3),
    // minHeight: fp(3),
    // padding: fp(2),
  },
});
