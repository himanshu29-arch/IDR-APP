import {
  View,
  StyleSheet,
  SafeAreaView,
  Pressable,
  StatusBar,
  TextInput,
  Text,
  Alert,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { AppColors } from "../../utils/colors";
import { SCREEN_WIDTH } from "../../utils/Dimensions";
import Loader from "../../components/Loader";
import CustomIcon from "../../components/customIcon";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  bottomSheetStyles,
  Fonts,
  ShadowStyle,
  StatusData,
} from "../../utils/constants";
import MyText from "../../components/customtext";
import {
  useGetAllClientQuery,
  useGetLocationByClientQuery,
  useUpdateTicketMutation,
} from "../../services/RTKClient";
import CustomInput from "../../components/customInput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { workorderview } from "../../utils/validationScemas";
import CustomDropdown from "../../components/customDropdown";
import ViewTechnician from "./ViewTecnician";
import ViewNotes from "./ViewNotes";
import { useToast } from "react-native-toast-notifications";
import { useFocusEffect } from "@react-navigation/native";
import { fp, hp, wp } from "../../utils/resDimensions";
import { BASE_URL } from "../../services/apiConfig";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import ViewAssignees from "./ViewAssignees";
import { formatDate } from "../../utils/extractDate";
import ViewWOInventories from "./ViewWOInventories";
import RBSheet from "react-native-raw-bottom-sheet";
import { BottomSheetItem } from "../../components/BottomSheetItem";
import { Dropdown } from "react-native-element-dropdown";
import ViewWOEquipments from "./ViewWOEquipments";

export default function ViewWorkOrder({ navigation, route }) {
  const { OrderId } = route.params;
  // const {
  //   data,
  //   isLoading,
  //   refetch: refetchworkorder,
  //   // } = useGetWorkOrderByIDQuery(OrderId, { refetchOnMountOrArgChange: true });
  // } = useGetWorkOrderByIDQuery(OrderId);
  const { data: clientData, isLoading: isLoading1 } = useGetAllClientQuery();
  const [client, setClient] = useState<string | object>("");
  const toast = useToast();
  const [date, setDate] = useState(Date);
  const [filteredWO, setFilteredWO] = useState({});
  const [status, setStatus] = useState({ label: "", value: "" });
  const [location, setLocation] = useState("");
  const [ticket, setTicket] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editStatus, SetEditStatus] = useState(false);
  const [data, setData] = useState({});
  const [notesData, setNoteData] = useState([]);
  const { data: locationData, refetch } = useGetLocationByClientQuery(client);
  const { userData } = useSelector((state: RootState) => state.auth);
  const [updateTicket, { isLoading: isLoading2 }] = useUpdateTicketMutation();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    reset,
  } = useForm({
    mode: "all",
    defaultValues: {
      WorkOrdertype: "",
      PONumber: "",
      ClientSite: "",
      ContactPerson: "",
      ContactPhone: "",
      Issue: "",
      ServiceDate: "",
      ContactEmail: "",
    },

    resolver: yupResolver(workorderview),
  });
  const refRBSheet = useRef();
  useEffect(() => {
    if (client?.client_id) {
      refetch();
    }
  }, [client?.client_id, refetch]);

  useEffect(() => {
    const focusListener = navigation.addListener("focus", () => {
      refetchworkorder();
      // getAllClient();
    });

    // Clean up the listener on component unmount
    return () => {
      focusListener();
    };
  }, [navigation]);

  useEffect(() => {
    refetchworkorder();
  }, [OrderId]);

  useEffect(() => {
    if (typeof data !== "undefined") {
      setClient(data?.workOrder?.client_name);
      setStatus({
        label: data?.workOrder?.status,
        value: data?.workOrder?.status,
      });
      setLocation(data?.workOrder?.job_location);
      reset({
        WorkOrdertype: data?.workOrder?.work_order_type,
        PONumber: data?.workOrder?.po_number,
        ClientSite: data?.workOrder?.client_site,
        ContactPerson: data?.workOrder?.contact_person,
        ContactPhone: data?.workOrder?.contact_phone_number,
        ContactEmail: data?.workOrder?.contact_mail_id,
        Issue: data?.workOrder?.issue,
        ServiceDate: data?.workOrder?.service_date,
      });
    }
  }, [data]);

  function navigateToAddNote(params: type) {
    navigation.navigate("AddNote", {
      OrderId: OrderId,
    });
    refRBSheet.current.close();
  }

  const refetchworkorder = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/work_order/by_id/${OrderId}`,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      if (response.status === 200) {
        const workorderData = response?.data?.workOrder;
        console.log("🚀 ~ refetchworkorder ~ workorderData:", workorderData);
        setData(response?.data);
        setNoteData(response?.data?.workOrder?.notes);
        setFilteredWO(extractAllowedFields(workorderData, allowedFields));
      }
    } catch (error) {
      console.log("🚀 ~ getWorkOrderById ~ error:", error);
      setIsLoading(false);
    }
  };
  // Allowed fields
  console.log("🚀 ~ refetchworkorder ~ userData:", userData);
  const allowedFields = [
    "work_order_id",
    "client_id",
    "location_id",
    "client_name",
    "work_order_type",
    "generated_date",
    "generated_time",
    "po_number",
    "client_site",
    "job_location",
    "service_date",
    "contact_person",
    "contact_phone_number",
    "contact_mail_id",
    "issue",
    "status",
    "local_onsite_person",
    "local_onsite_person_contact",
    "client_emp_user_id",
  ];
  const extractAllowedFields = (obj, allowedFields) => {
    return allowedFields.reduce((acc, field) => {
      if (obj.hasOwnProperty(field)) {
        acc[field] = obj[field];
      }
      return acc;
    }, {});
  };

  const handleEditWorkorder = async (item) => {
    setStatus({ label: item?.label, value: item?.value });
    setFilteredWO((prev) => ({ ...prev, status: item?.value }));
    SetEditStatus(false);
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}work_order/update_ticket`,
        filteredWO,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.show(response?.data?.message, {
          type: "success",
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.log("🚀 ~ getWorkOrderById ~ error:", error);
      setIsLoading(false);
      toast.show(error?.response?.data?.message, {
        type: "danger",
      });
    }
  };
  useFocusEffect(
    useCallback(() => {
      refetchworkorder();
      return () => {
        // Clean up function if needed
      };
    }, [navigation])
  );
  const onEditStatusPress = () => {
    SetEditStatus(true);
    refRBSheet.current?.close();
  };
  const BottomSheetData = [
    {
      label: "Add Note",
      iconFamily: "MaterialIcons",
      iconName: "note-add",
      value: "add_note",
      onPress: navigateToAddNote,
    },
    {
      label: "Edit Workorder Status",
      iconFamily: "MaterialCommunityIcons",
      iconName: "list-status",
      value: "edit_status",
      onPress: onEditStatusPress,
    },
  ];

  const renderItem = (item, index) => {
    return (
      <>
        <View style={styles.item}>
          <Text style={styles.selectedTextStyle}>{item.label}</Text>
        </View>
        <View
          style={{
            borderBottomColor: AppColors.lightgrey,
            borderBottomWidth: 1,
            alignSelf: "center",
            width: "100%",
          }}
        ></View>
      </>
    );
  };
  const handleSetStatus = (item) => {
    Alert.alert(
      "Are you sure?",
      "Do you really want to edit workorder status?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => handleEditWorkorder(item),
        },
      ],
      { cancelable: false }
    );
  };

  console.log(status, "status");
  return (
    <SafeAreaView style={styles.conatiner}>
      <Loader loading={isLoading || isLoading1 || isLoading2} />
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
            Work Order Details
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
            <MyText fontType="bold" style={{ fontSize: 22 }}>
              Ticket
            </MyText>
            <CustomIcon
              name="ellipsis-vertical"
              onPress={() => {
                refRBSheet.current.open();
              }}
            />
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
          <MyText fontType="bold" style={{ fontSize: 16, marginTop: hp(1) }}>
            {data?.workOrder?.ticket_number}
          </MyText>
          <View style={{ marginTop: 10 }}>
            <CustomDropdown
              options={clientData?.data}
              type="client"
              defaultOption={client}
              onSelect={setClient}
              isDisabled={!ticket}
            />
            <CustomDropdown
              label="Location"
              options={locationData?.locations}
              type="location"
              defaultOption={location}
              onSelect={setLocation}
              isDisabled={typeof locationData === "undefined" || !ticket}
            />
            {data?.workOrder?.client_location?.address_line_two && (
              <>
                <MyText style={{ marginVertical: 5, color: AppColors.black }}>
                  Address Line 1
                </MyText>
                <View style={[styles.viewcontainer, styles.outlined]}>
                  <TextInput
                    value={data?.workOrder?.client_location?.address_line_two}
                    // value={}
                    style={[styles.default]}
                    multiline
                  />
                </View>
              </>
            )}
            {data?.workOrder?.client_location?.address_line_three && (
              <>
                <MyText style={{ marginVertical: 5, color: AppColors.black }}>
                  Address Line 2
                </MyText>
                <View style={[styles.viewcontainer, styles.outlined]}>
                  <TextInput
                    value={data?.workOrder?.client_location?.address_line_three}
                    // value={}
                    style={[styles.default]}
                    multiline
                  />
                </View>
              </>
            )}
            {data?.workOrder?.client_location?.city && (
              <>
                <MyText style={{ marginVertical: 5, color: AppColors.black }}>
                  City
                </MyText>
                <View style={[styles.viewcontainer, styles.outlined]}>
                  <TextInput
                    value={data?.workOrder?.client_location?.city}
                    // value={}
                    style={[styles.default]}
                    multiline
                  />
                </View>
              </>
            )}
            {data?.workOrder?.client_location?.state && (
              <>
                <MyText style={{ marginVertical: 5, color: AppColors.black }}>
                  State
                </MyText>
                <View style={[styles.viewcontainer, styles.outlined]}>
                  <TextInput
                    value={data?.workOrder?.client_location?.state}
                    // value={}
                    style={[styles.default]}
                    multiline
                  />
                </View>
              </>
            )}
            {data?.workOrder?.client_location?.zipcode && (
              <>
                <MyText style={{ marginVertical: 5, color: AppColors.black }}>
                  Zip Code
                </MyText>
                <View style={[styles.viewcontainer, styles.outlined]}>
                  <TextInput
                    value={data?.workOrder?.client_location?.zipcode}
                    // value={}
                    style={[styles.default]}
                    multiline
                  />
                </View>
              </>
            )}
            <CustomInput
              control={control}
              errors={errors}
              name="WorkOrdertype"
              label="Work Order type"
              isDisabled={!ticket}
            />
            <CustomInput
              control={control}
              errors={errors}
              name="PONumber"
              label="PO Number"
              isDisabled={!ticket}
            />
            <CustomInput
              control={control}
              errors={errors}
              name="ClientSite"
              label="Client Site"
              isDisabled={!ticket}
            />
            {data?.workOrder?.local_onsite_person && (
              <>
                <MyText style={{ marginVertical: 5, color: AppColors.black }}>
                  Local Contact Person
                </MyText>
                <View style={[styles.viewcontainer, styles.outlined]}>
                  <TextInput
                    value={data?.workOrder?.local_onsite_person}
                    // value={}
                    style={[styles.default]}
                    multiline
                  />
                </View>
              </>
            )}
            {data?.workOrder?.local_onsite_person_contact && (
              <>
                <MyText style={{ marginVertical: 5, color: AppColors.black }}>
                  Local Contact Phone
                </MyText>
                <View style={[styles.viewcontainer, styles.outlined]}>
                  <TextInput
                    value={data?.workOrder?.local_onsite_person_contact}
                    // value={}
                    style={[styles.default]}
                    multiline
                  />
                </View>
              </>
            )}
            <CustomInput
              control={control}
              errors={errors}
              name="ContactPerson"
              label="Contact Person"
              isDisabled={!ticket}
            />
            <CustomInput
              control={control}
              errors={errors}
              name="ContactPhone"
              label="Contact Phone"
              isDisabled={!ticket}
            />
            <CustomInput
              control={control}
              errors={errors}
              name="ContactEmail"
              label="Contact Email"
              isDisabled={!ticket}
            />
            <CustomInput
              control={control}
              errors={errors}
              name="Issue"
              label="Issue"
              isDisabled={!ticket}
            />

            <View style={{ marginTop: hp(1) }}>
              <MyText style={{ marginVertical: 5, color: AppColors.black }}>
                Status
              </MyText>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                iconStyle={styles.iconStyle}
                data={StatusData}
                labelField="label"
                valueField="value"
                placeholder="Select status"
                value={status?.value}
                itemTextStyle={styles.itemTextStyle}
                onChange={handleSetStatus}
                renderItem={renderItem}
                disable={!editStatus}
                maxHeight={hp(20)}
                containerStyle={{ borderRadius: fp(1.4), padding: hp(0.8) }}
              />
            </View>
            <MyText style={{ marginVertical: 5, color: AppColors.black }}>
              Service Date
            </MyText>
            <View style={[styles.viewcontainer, styles.outlined]}>
              <TextInput
                // value={item.comments}
                value={formatDate(date)}
                style={[styles.default]}
                multiline
              />
            </View>
            {/* <CustomDatePicker
              setDate={setDate}
              date={date}
              label="Service Date"
              isDisabled={!ticket}
            /> */}
          </View>
        </View>
        {data?.workOrder?.technicians &&
          data?.workOrder?.technicians.length !== 0 && (
            <ViewTechnician
              technicians={data?.workOrder?.technicians}
              refetchworkorder={refetchworkorder}
            />
          )}

        {data?.workOrder?.assignees &&
          data?.workOrder?.assignees.length !== 0 && (
            <ViewAssignees
              assignees={data?.workOrder?.assignees}
              refetchworkorder={refetchworkorder}
            />
          )}

        {data?.workOrder?.notes && data?.workOrder?.notes.length !== 0 && (
          <ViewNotes
            NavigateToAddNote={navigateToAddNote}
            NotesData={data?.workOrder?.notes}
            refetchworkorder={refetchworkorder}
          />
        )}
        {data?.workOrder?.inventories &&
          data?.workOrder?.inventories.length !== 0 && (
            <ViewWOInventories InventoriesData={data?.workOrder?.inventories} />
          )}
        {data?.workOrder?.equipment &&
          data?.workOrder?.equipment.length !== 0 && (
            <ViewWOEquipments InventoriesData={data?.workOrder?.equipment} />
          )}
      </KeyboardAwareScrollView>
      <RBSheet
        ref={refRBSheet}
        useNativeDriver={false}
        height={hp(25)}
        draggable
        customStyles={bottomSheetStyles}
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
            userData?.user?.user_type == "Admin" ||
            userData?.user?.user_type == "Subadmin"
              ? BottomSheetData
              : [BottomSheetData[0]]
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
  dropdown: {
    height: 50,
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
  item: {
    padding: 15,
  },
});
