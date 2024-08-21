import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableWithoutFeedback,
  StyleSheet,
  Pressable,
  RefreshControl,
  Alert,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Loader from "../../components/Loader";
import { AppColors } from "../../utils/colors";
import CustomIcon from "../../components/customIcon";
import MyText from "../../components/customtext";
import { bottomSheetStyles, Fonts, ShadowStyle } from "../../utils/constants";
import { FlatList } from "react-native";
import { fp, hp, wp } from "../../utils/resDimensions";
import FloatingButton from "../../components/floatingButton";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { BASE_URL } from "../../services/apiConfig";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import MultiSelectComponent from "../../components/ElementDropDown";
import { useToast } from "react-native-toast-notifications";

export default function Inventory({ navigation }) {
  const { model } = useSelector((state) => state.QRData); // Ensure 'PdfStatus' matches the slice name in your Redux store
  const toast = useToast();
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedLocationLabel, setSelectedLocationLabel] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [modelText, setModelText] = useState("");
  const [make, setMake] = useState("");
  const [isParentDropdownOpen, setIsParentDropdownOpen] = useState(true);
  const [isFilterDisable, setIsFilterDisable] = useState(true);

  const { userData } = useSelector((state: RootState) => state.auth);
  const [refreshing, setRefreshing] = useState(false);
  const [locationOptions, setLocationOptions] = useState([]);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate a network request
    setTimeout(() => {
      // Add new data or update the existing data here
      fetchInventory("");
      setRefreshing(false);
    }, 1000); // Adjust the timeout duration as needed
  }, []);

  const onDeleteConfirm = async (inventory_id) => {
    setIsLoading(true);
    let url = `${BASE_URL}inventory/${inventory_id}`;
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

  const fetchInventory = async (value) => {
    setIsLoading(true);
    console.log("fetch inventory");

    let url = `${BASE_URL}inventory/all`;
    const params = new URLSearchParams();

    if (selectedLocation) params.append("location", selectedLocationLabel);
    if (make) params.append("search", make);
    if (modelText) params.append("model", modelText);
    if (deviceType) params.append("device_type", deviceType);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    console.log("🚀 ~ fetchInventory ~ url:", url);
    try {
      const response = await axios.get(
        value == "reset" ? `${BASE_URL}inventory/all` : url,
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
    if (selectedLocation || deviceType || make || modelText) {
      setIsFilterDisable(false);
    } else {
      setIsFilterDisable(true);
    }
  }, [selectedLocation, deviceType, make, modelText]);

  const fetchInventoryByQR = async () => {
    setIsLoading(true);
    console.log("fetch inventory by Qr");
    try {
      const response = await axios.post(
        `${BASE_URL}/inventory/by_qr`,
        {
          model: model,
        },
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      if (response.status === 200) {
        setIsLoading(false);
        console.log("data", response?.data);
        setData(response?.data?.inventories);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (model == "") {
      fetchInventory("");
    } else {
      fetchInventoryByQR();
    }
  }, [model]);

  const refRBSheet = useRef();

  const WOtranferPress = () => {
    navigation?.navigate("WOTransfer", { InVentoryId: InventoryID });
  };
  const LocTransferPress = () => {
    console.log("Transfer inventory to location");
  };
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
      console.log("🚀 ~ AddInventory --> handleGetLocation ~ error:", error);
      setIsLoading(false);
      toast.show(error?.response?.data, {
        type: "danger",
      });
    }
  };
  function handleResetFilter() {
    setSelectedLocation("");
    setDeviceType("");
    setMake("");
    setModelText("");
    fetchInventory("reset");
    toggleParentDropdown();
  }

  const toggleParentDropdown = () => {
    setIsParentDropdownOpen(!isParentDropdownOpen);
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
          onPress: () => onDeleteConfirm(inventoryId),
        },
      ],
      { cancelable: false }
    );
    refRBSheet.current.close();
  };
  const BottomSheetDataDeleteItem = [
    {
      label: "Delete Inventory",
      iconFamily: "Ionicons",
      iconName: "trash-bin",
      value: "delete_inventory",
      onPress: handleDeleteInventory,
    },
  ];

  return (
    <SafeAreaView style={{ backgroundColor: AppColors.white, flex: 1 }}>
      <StatusBar
        backgroundColor={AppColors.white}
        barStyle={"dark-content"}
        translucent={false}
      />
      <Loader loading={isLoading} />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={AppColors?.primary}
          />
        }
      >
        <View style={{ padding: 15, marginTop: StatusBar.currentHeight }}>
          <View style={styles.mainRow}>
            <MyText
              fontType="bold"
              style={{
                fontSize: 20,
                color: AppColors.black,
              }}
            >
              Inventory
            </MyText>
            <Pressable
              style={styles.AC}
              onPress={() => navigation.navigate("Notifications")}
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
              thirdInputPlaceholder={"Enter make"}
              thirdInput={make}
              setThirdInput={setMake}
              // parent dropdown
              isParentDropdownOpen={isParentDropdownOpen}
              toggleParentDropdown={toggleParentDropdown}
              handleApplyFilter={fetchInventory}
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
                      navigation.navigate("ViewInventory", {
                        InventoryId: item.inventory_id,
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
                          {item.device_type}
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
                          {item.make}
                        </MyText>
                      </View>
                      <View>
                        <MyText fontType="medium" style={{ fontSize: 14 }}>
                          Model
                        </MyText>
                        <MyText style={{ fontSize: 14, marginTop: 10 }}>
                          {item.model}
                        </MyText>
                      </View>
                      <View>
                        <MyText fontType="medium" style={{ fontSize: 14 }}>
                          Location
                        </MyText>
                        <MyText style={{ fontSize: 14, marginTop: 10 }}>
                          {item.location}
                        </MyText>
                      </View>
                    </View>
                  </Pressable>
                );
              }}
              keyExtractor={(item) => item.inventory_id.toString()}
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
        {model == "" && (
          <FloatingButton
            onPress={() => navigation?.navigate("ScanQR")}
            IconComp={
              <MaterialCommunityIcons
                name="qrcode-scan"
                size={20}
                color="#fff"
              />
            }
          />
        )}

        <FloatingButton
          onPress={() => navigation?.navigate("AddInventory")}
          IconComp={<AntDesign name="plus" size={25} color="#fff" />}
        />
      </View>
    </SafeAreaView>
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
