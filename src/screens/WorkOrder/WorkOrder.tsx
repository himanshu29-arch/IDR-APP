import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TouchableWithoutFeedback,
  Alert,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { AppColors } from "../../utils/colors";
import { SCREEN_HEIGHT } from "../../utils/Dimensions";
import CustomIcon from "../../components/customIcon";
import MyText from "../../components/customtext";
import { Fonts, ShadowStyle } from "../../utils/constants";
import {
  useDeleteWorkOrderMutation,
  useGetAllWorkOrderQuery,
} from "../../services/RTKClient";
import Loader from "../../components/Loader";
import { useFocusEffect } from "@react-navigation/native";
import MultiSelectComponent from "../../components/ElementDropDown";
import { BASE_URL } from "../../services/apiConfig";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { hp } from "../../utils/resDimensions";

export default function WorkOrder({ navigation }) {
  const {
    data: workOrder,
    isLoading: isLoading1,
    refetch,
  } = useGetAllWorkOrderQuery();
  const [show, setShow] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [selected, setSelected] = useState({});
  const [deleteWorkOrder, { isLoading: isLoading2 }] =
    useDeleteWorkOrderMutation();
  //filter
  const [selectedStatus, setSelectedStatus] = useState("");
  const [clientName, setClientName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [technicianName, setTechnicianName] = useState("");
  const [projectManagerName, setProjectManagerName] = useState("");
  const [isParentDropdownOpen, setIsParentDropdownOpen] = useState(false);
  const [isFilterDisable, setIsFilterDisable] = useState(true);
  const [workOrderData, setWorkOrderData] = useState([]);
  const { userData } = useSelector((state: RootState) => state.auth);
  const showAlert = () => {
    Alert.alert(
      "Delete",
      "Are you confirm to delete this work order?", // <- this part is optional, you can pass an empty string
      [
        { text: "DELETE", onPress: () => onDelete() },
        { text: "Cancel", onPress: () => setShow(false) },
      ],
      { cancelable: false }
    );
  };

  const onDelete = () => {
    deleteWorkOrder(selected)
      .unwrap()
      .then((payload) => {
        setShow(false);
        refetch();
        setShow(false);
        handleWorkOrderFilter();
      })
      .catch((error) => {
        console.log("Error", error);
        setShow(false);
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [])
  );

  function toggleShowFilter(params: type) {
    setShowFilter(!showFilter);
  }
  const toggleParentDropdown = () => {
    setIsParentDropdownOpen(!isParentDropdownOpen);
  };
  useEffect(() => {
    const focusListener = navigation.addListener("focus", () => {
      handleWorkOrderFilter();
      // getAllClient();
    });

    // Clean up the listener on component unmount
    return () => {
      focusListener();
    };
  }, [navigation]);
  console.log("🚀 ~ handleWorkOrderFilter ~ selectedStatus:", selectedStatus);
  const handleWorkOrderFilter = async () => {
    setIsLoading(true);
    setIsParentDropdownOpen(false);
    console.log(
      "🚀 ~ handleWorkOrderFilter ~ userData?.token:",
      userData?.token
    );
    try {
      let url = `${BASE_URL}work_order/all`;

      // Check if any filter options are filled
      if (
        selectedStatus ||
        clientName ||
        technicianName ||
        projectManagerName
      ) {
        // Initialize an array to store query parameters
        let queryParams = [];

        // Conditionally add each parameter to the queryParams array
        if (selectedStatus) {
          queryParams.push(`status=${selectedStatus}`);
        }

        if (clientName) {
          queryParams.push(`client_name=${clientName}`);
        }
        if (technicianName) {
          queryParams.push(`technician=${technicianName}`);
        }
        if (projectManagerName) {
          queryParams.push(`project_manager=${projectManagerName}`);
        }

        // Construct the URL with the query parameters
        if (queryParams.length > 0) {
          url += "?" + queryParams.join("&");
        }
      }

      console.log("🚀 ~ handleWorkOrderFilter ~ url:", url);
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${userData?.token}`,
        },
      });

      if (response.status === 200) {
        response?.data?.workOrder.forEach((workOrder, index) => {
          console.log(`Notes at index ${index}:`, workOrder.notes);
        });
        setWorkOrderData(response?.data?.workOrder);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("🚀 ~ handleWorkOrderFilter ~ error:", error);
      setIsLoading(false);
      //  Snackbar.show({
      //    text: error.response.data.message,
      //    duration: 4000,
      //    backgroundColor: colors.RED,
      //  });
    }
  };

  // Call handleWorkOrderFilter when filter values change
  // useEffect(() => {
  //   handleWorkOrderFilter();
  // }, [selectedStatus]);

  // useEffect(() => {
  //   handleWorkOrderFilter();
  // }, []);
  function handleApplyFilter() {}
  // Effect to manage isFilterDisable

  useEffect(() => {
    if (selectedStatus || clientName || technicianName || projectManagerName) {
      setIsFilterDisable(false);
    } else {
      setIsFilterDisable(true);
    }
  }, [selectedStatus, clientName, technicianName, projectManagerName]);

  return (
    <SafeAreaView style={{ backgroundColor: AppColors.white, flex: 1 }}>
      <StatusBar
        backgroundColor={AppColors.white}
        barStyle={"dark-content"}
        translucent={false}
      />
      <Loader loading={isLoading1 || isLoading2 || isLoading} />
      <ScrollView>
        <TouchableWithoutFeedback
          style={{ marginTop: StatusBar.currentHeight }}
          onPress={() => {
            setSelected({});
            setShow(false);
          }}
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
                Work Order
              </MyText>
              <View style={styles.AC}>
                <CustomIcon name="notifications-outline" />
              </View>
            </View>

            <MultiSelectComponent
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
            />
            {workOrderData.length > 0 ? (
              <FlatList
                data={workOrderData}
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false}
                renderItem={({ item }) => {
                  console.log("🚀 ~ WorkOrder ~ item:", item);
                  return (
                    <Pressable
                      style={[styles.card, ShadowStyle]}
                      onPress={() =>
                        navigation.navigate("ViewWorkOrder", {
                          OrderId: item.work_order_id,
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
                            Work Order Code
                          </MyText>
                          <MyText
                            style={{
                              fontSize: 14,
                              fontFamily: Fonts.InterBold,
                              marginTop: hp(1),
                            }}
                          >
                            {item.ticket_number}
                          </MyText>
                        </View>
                        <CustomIcon
                          name="ellipsis-vertical"
                          onPress={() => {
                            setSelected(item);
                            setShow(true);
                          }}
                        />
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
                            Client name
                          </MyText>
                          <MyText style={{ fontSize: 14, marginTop: 10 }}>
                            {item.client_name}
                          </MyText>
                        </View>
                        <View>
                          <MyText fontType="medium" style={{ fontSize: 14 }}>
                            Status
                          </MyText>
                          <MyText style={{ fontSize: 14, marginTop: 10 }}>
                            {item.status}
                          </MyText>
                        </View>
                      </View>
                      <View style={{ marginTop: hp(2) }}>
                        <MyText fontType="medium" style={{ fontSize: 14 }}>
                          Service Request
                        </MyText>
                        <MyText style={{ fontSize: 14, marginTop: 10 }}>
                          {item.issue}
                        </MyText>
                      </View>
                    </Pressable>
                  );
                }}
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MyText fontType="medium" style={{ fontSize: 14 }}>
                  Oops! Data not found.
                </MyText>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
      {show && (
        <View
          style={[
            {
              backgroundColor: AppColors.white,
              paddingVertical: 30,
              margin: 10,
              borderRadius: 10,
              alignItems: "center",
            },
            ShadowStyle,
          ]}
        >
          {/* {selected?.notes.length == 0 && ( */}
          <MyText
            style={{ fontSize: 16, marginBottom: hp(2) }}
            fontType="medium"
            onPress={() => {
              navigation.navigate("AddNote", {
                OrderId: selected?.work_order_id,
              }),
                setShow(false);
            }}
          >
            Add note
          </MyText>
          {/* )} */}
          <View
            style={{
              height: hp(0.1),
              width: "70%",
              backgroundColor: AppColors.grey,
            }}
          />
          {/* <MyText
            style={{ fontSize: 16, margin: 10 }}
            fontType="medium"
            onPress={() => {
              navigation.navigate("ViewWorkOrder", {
                OrderId: selected?.work_order_id,
              }),
                setShow(false);
            }}
          >
            Edit record
          </MyText> */}
          {userData?.user?.user_type == "Admin" ? (
            <MyText
              style={{ fontSize: 16, marginTop: hp(2) }}
              fontType="medium"
              onPress={() => showAlert()}
            >
              Delete record
            </MyText>
          ) : null}
        </View>
      )}

      {/* <TouchableOpacity
        style={[styles.fab, ShadowStyle]}
        onPress={() => navigation.navigate("GenerateTicket")}
      >
        <CustomIcon name="add" color={AppColors.white} size={30} />
      </TouchableOpacity> */}
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
});
