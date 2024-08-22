import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Platform,
  StatusBar,
  Pressable,
  ScrollView,
  RefreshControl,
  FlatList,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { AppColors } from "../../utils/colors";
import { Fonts, ShadowStyle } from "../../utils/constants";
import { fp, hp, wp } from "../../utils/resDimensions";
import { SCREEN_WIDTH } from "../../utils/Dimensions";
import MyText from "../../components/customtext";
import Loader from "../../components/Loader";
import CustomIcon from "../../components/customIcon";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MultiSelectComponent from "../../components/ElementDropDown";
import FloatingButton from "../../components/floatingButton";
import { BASE_URL } from "../../services/apiConfig";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useToast } from "react-native-toast-notifications";

export default function Equipment({ navigation }) {
  const toast = useToast();
  const { serial_number } = useSelector((state) => state.EquipmentQRData); // Ensure 'PdfStatus' matches the slice name in your Redux store
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedLocationLabel, setSelectedLocationLabel] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [modelText, setModelText] = useState("");
  const [searchList, setSearchList] = useState("");
  const [data, setData] = useState([]);
  const [isParentDropdownOpen, setIsParentDropdownOpen] = useState(true);
  const [isFilterDisable, setIsFilterDisable] = useState(true);
  const [locationOptions, setLocationOptions] = useState([]);

  const { userData } = useSelector((state: RootState) => state.auth);
  const userType = userData?.user?.user_type;

  const isNotIDROrClientEmployee =
    userType !== "IDR Employee" && userType !== "Client Employee";
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate a network request
    setTimeout(() => {
      // Add new data or update the existing data here
      fetchEquipments("");
      setRefreshing(false);
    }, 1000); // Adjust the timeout duration as needed
  }, []);

  const fetchEquipments = async (value) => {
    setIsLoading(true);
    console.log("fetch equipments");

    let url = `${BASE_URL}equipment/all`;
    const params = new URLSearchParams();

    if (selectedLocation) params.append("location_name", selectedLocationLabel);
    if (searchList) params.append("search", searchList);
    if (modelText) params.append("model", modelText);
    if (deviceType) params.append("device_type", deviceType);
    console.log("🚀 ~ fetchEquipments ~ deviceType:", deviceType);
    console.log("🚀 ~ fetchEquipments ~ modelText:", modelText);
    console.log("🚀 ~ fetchEquipments ~ searchList:", searchList);
    console.log(
      "🚀 ~ fetchEquipments ~ selectedLocationLabel:",
      selectedLocationLabel
    );

    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    console.log("🚀 ~ fetchEquipments ~ url:", url);
    console.log("🚀 ~ fetchEquipments ~ userData.token:", userData.token);

    try {
      const response = await axios.get(
        value == "reset" ? `${BASE_URL}equipment/all` : url,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      if (response.status === 200) {
        setIsLoading(false);
        console.log("data", response?.data);
        setData(response?.data?.data);
        toggleParentDropdown();
      }
    } catch (error) {
      toggleParentDropdown();
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (selectedLocation || deviceType || searchList || modelText) {
      setIsFilterDisable(false);
    } else {
      setIsFilterDisable(true);
    }
  }, [selectedLocation, deviceType, searchList, modelText]);

  const fetchEquipmentByQR = async () => {
    console.log("fetch equipment by Qr");
    console.log("🚀 ~ fetchEquipmentByQR ~ serial_number:", serial_number);

    setIsLoading(true);
    // let cleanUrl = serial_number.replace("http://", "");
    try {
      const response = await axios.post(
        `${BASE_URL}equipment/by_qr`,
        {
          serial_number: serial_number,
        },
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      if (response.status === 200) {
        setIsLoading(false);
        console.log("data by QR", response?.data?.equipment);
        let res = [];
        res.push(response?.data?.equipment);
        console.log("🚀 ~ fetchEquipmentByQR ~ res:", res);
        setData(res);
      } else {
        console.log(response?.data);
      }
    } catch (error) {
      console.log("🚀 ~ fetchEquipmentByQR ~ error:", error.data.message);
      setIsLoading(false);
    }
  };

  console.log("🚀 ~ fetchEquipmentByQR ~ Data:", data);

  useEffect(() => {
    console.log("🚀 ~ useEffect ~ serial_number:", serial_number);
    if (serial_number == "") {
      fetchEquipments("");
    } else {
      fetchEquipmentByQR();
    }
  }, [serial_number]);

  useEffect(() => {
    getAllLocations();
  }, []);

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
      console.log("🚀 ~ AddEquipment --> handleGetLocation ~ error:", error);
      setIsLoading(false);
      toast.show(error?.response?.data, {
        type: "danger",
      });
    }
  };

  function handleResetFilter() {
    setSelectedLocation("");
    setDeviceType("");
    setSearchList("");
    setModelText("");
    fetchEquipments("reset");
    toggleParentDropdown();
  }

  const toggleParentDropdown = () => {
    setIsParentDropdownOpen(!isParentDropdownOpen);
  };

  return (
    <SafeAreaView style={styles.conatiner}>
      <Loader loading={isLoading} />
      <StatusBar
        backgroundColor={AppColors.white}
        barStyle={"dark-content"}
        translucent={false}
      />

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={AppColors?.primary}
          />
        }
      >
        <View style={{ padding: 15 }}>
          <View style={styles.mainRow}>
            <MyText
              fontType="bold"
              style={{
                fontSize: 20,
                color: AppColors.black,
              }}
            >
              Company Equipments
            </MyText>
            <Pressable
              style={styles.AC}
              onPress={() => {
                navigation.navigate("Notifications");
              }}
            >
              <CustomIcon name="notifications-outline" />
            </Pressable>
          </View>
          {userData?.user?.user_type !== "Client Employee" && (
            <MultiSelectComponent
              //dropDown
              dropdownPlaceholder={"Select Location"}
              firstDropdownValue={selectedLocation}
              dropDownOptions={locationOptions}
              setFirstDropdownLabel={setSelectedLocationLabel}
              setFirstDropdownValue={setSelectedLocation}
              // first input
              firstInputPlaceholder={"Enter device type"}
              firstInput={deviceType}
              setFirstInput={setDeviceType}
              // second input
              secondInputPlaceholder={"Enter model"}
              secondInput={modelText}
              setSecondInput={setModelText}
              // third input
              thirdInputPlaceholder={"Search List"}
              thirdInput={searchList}
              setThirdInput={setSearchList}
              // parent dropdown
              isParentDropdownOpen={isParentDropdownOpen}
              toggleParentDropdown={toggleParentDropdown}
              handleApplyFilter={fetchEquipments}
              isApplyDisable={isFilterDisable}
              //
              handleResetFilter={handleResetFilter}
            />
          )}

          {data?.length > 0 ? (
            <FlatList
              data={data}
              showsHorizontalScrollIndicator={false}
              // refreshControl={
              //   <RefreshControl
              //     refreshing={refreshing}
              //     onRefresh={onRefresh}
              //     colors={[AppColors?.red]}
              //   />
              // }
              scrollEnabled={false}
              renderItem={({ item }) => {
                return (
                  <Pressable
                    style={[styles.card, ShadowStyle]}
                    onPress={() =>
                      navigation.navigate("ViewEquipment", {
                        EquipmentId: item.equipment_id,
                      })
                    }
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <View>
                        <MyText fontType="medium" style={{ fontSize: 14 }}>
                          Device type
                        </MyText>
                        <MyText
                          style={{
                            fontSize: 14,
                            fontFamily: Fonts.InterBold,
                            marginTop: hp(1),
                          }}
                        >
                          {item?.device_type}
                        </MyText>
                      </View>
                      {/* <CustomIcon
                        name="ellipsis-vertical"
                        onPress={() => refRBSheet.current.open()}
                      /> */}
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: "100%",
                        marginTop: 30,
                      }}
                    >
                      <View>
                        <MyText fontType="medium" style={{ fontSize: 14 }}>
                          Make
                        </MyText>
                        <MyText style={{ fontSize: 14, marginTop: 10 }}>
                          {item?.make}
                        </MyText>
                      </View>
                      <View>
                        <MyText fontType="medium" style={{ fontSize: 14 }}>
                          Model
                        </MyText>
                        <MyText style={{ fontSize: 14, marginTop: 10 }}>
                          {item?.model}
                        </MyText>
                      </View>
                      <View>
                        <MyText fontType="medium" style={{ fontSize: 14 }}>
                          Serial Number
                        </MyText>
                        <MyText style={{ fontSize: 14, marginTop: 10 }}>
                          {item?.serial_number}
                        </MyText>
                      </View>
                    </View>

                    <View></View>
                  </Pressable>
                );
              }}
              // keyExtractor={(item) => item.inventory_id.toString()}
            />
          ) : (
            <MyText
              fontType="medium"
              style={{
                fontSize: fp(2),
                alignSelf: "center",
              }}
            >
              No data available
            </MyText>
          )}
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        {serial_number == "" && (
          <FloatingButton
            onPress={() => navigation?.navigate("ScanEquipmentQR")}
            IconComp={
              <MaterialCommunityIcons
                name="qrcode-scan"
                size={20}
                color="#fff"
              />
            }
          />
        )}
        {isNotIDROrClientEmployee && (
          <FloatingButton
            onPress={() => navigation?.navigate("AddEquipment")}
            IconComp={<AntDesign name="plus" size={25} color="#fff" />}
          />
        )}
      </View>
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
  blueContainer: {
    backgroundColor: AppColors.primary,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    paddingBottom: 30,
  },
  mainRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: wp(5),
  },
  AC: {
    backgroundColor: AppColors.lightgrey,
    borderRadius: 50,
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  filter: {
    justifyContent: "space-between",
    flexDirection: "row",
    borderRadius: 5,
    padding: 10,
    backgroundColor: AppColors.darkgrey,
    marginTop: 10,
  },
  card: {
    backgroundColor: AppColors.white,
    alignItems: "flex-start",
    borderRadius: 10,
    padding: 20,
    margin: 10,
    marginTop: hp(4),
  },
  fab: {
    backgroundColor: AppColors.primary,
    borderRadius: 50,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 50,
    right: 20,
  },

  buttonContainer: {
    position: "absolute",
    bottom: 30,
    right: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});
