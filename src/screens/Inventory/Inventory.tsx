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
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Loader from "../../components/Loader";
import { AppColors } from "../../utils/colors";
import CustomIcon from "../../components/customIcon";
import MyText from "../../components/customtext";
import { Fonts, ShadowStyle } from "../../utils/constants";
import { FlatList } from "react-native";
import { hp, wp } from "../../utils/resDimensions";
import FloatingButton from "../../components/floatingButton";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { BASE_URL } from "../../services/apiConfig";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import RBSheet from "react-native-raw-bottom-sheet";
import { BottomSheetItem } from "./ViewInventory";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MultiSelectComponent from "../../components/ElementDropDown";

export default function Inventory({ navigation }) {
  const { model } = useSelector((state) => state.QRData); // Ensure 'PdfStatus' matches the slice name in your Redux store
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { userData } = useSelector((state: RootState) => state.auth);
  const [refreshing, setRefreshing] = useState(false);
  const [locationOptions, setLocationOptions] = useState([]);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate a network request
    setTimeout(() => {
      // Add new data or update the existing data here
      fetchInventory();
      setRefreshing(false);
    }, 1000); // Adjust the timeout duration as needed
  }, []);

  const fetchInventory = async () => {
    setIsLoading(true);
    console.log("fetch inventory");
    try {
      const response = await axios.get(`${BASE_URL}/inventory/all`, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      });
      if (response.status === 200) {
        setIsLoading(false);
        console.log("data", response?.data);
        setData(response?.data?.data);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };
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
      // Snackbar.show({
      //   text: error.response.data.message,
      //   duration: 4000,
      //   backgroundColor: AppColors.red,
      // });
    }
  };
  useEffect(() => {
    if (model == "") {
      fetchInventory();
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
        {/* <MultiSelectComponent
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          clientName={clientName}
          setClientName={setClientName}
          technicianName={technicianName}
          setTechnicianName={setTechnicianName}
          projectManagerName={projectManagerName}
          setProjectManagerName={setProjectManagerName}
          isParentDropdownOpen={isParentDropdownOpen}
          toggleParentDropdown={toggleParentDropdown}
          handleApplyFilter={handleWorkOrderFilter}
          isApplyDisable={isFilterDisable}
          dropDownOptions={locationOptions}
        /> */}
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
            <Pressable style={styles.AC}>
              <CustomIcon name="notifications-outline" />
            </Pressable>
          </View>

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
                          {item.color}
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
              style={{ justifyContent: "center", alignItems: "center" }}
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
