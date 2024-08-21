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
import {
  getDate,
  getFormattedDate,
  getFullName,
} from "../../../utils/helperfunctions";

export default function EqEmpTransfer({ navigation, route }) {
  const { EquipmentId } = route.params;
  console.log("🚀 ~ EqEmpTransfer ~ EquipmentId:", EquipmentId);

  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [allEmployee, setAllEmployee] = useState([]);
  const [employee, setEmployee] = useState({});
  const [date, setDate] = useState(Date);
  const [description, setDescription] = useState("");
  const { userData } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const focusListener = navigation.addListener("focus", () => {
      getAllEmployees();
    });

    // Clean up the listener on component unmount
    return () => {
      focusListener();
    };
  }, [navigation]);

  const getAllEmployees = async () => {
    console.log("🚀 ~ getAllClient ~ userData.token:", userData.token);
    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}idr_emp/all`, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      });
      if (response.status === 200) {
        setIsLoading(false);
        // dispatch(getAllClients(response?.data));
        const employeesData = response?.data?.employees;
        const employeeInfo = employeesData.map((employee) => {
          return {
            label: getFullName(employee.first_name, employee.last_name),
            value: employee.user_id,
          };
        });
        setAllEmployee(employeeInfo);
      }
    } catch (error) {
      console.log("🚀 ~ getAllEmployees ~ error:", error);
      setIsLoading(false);
    }
  };

  const handleSetEmployee = (item) => {
    setEmployee(item);
    console.log("🚀 ~ handleSetEmployee ~ item:", item);
  };

  const handleDescriptionChange = (item) => {
    setDescription(item);
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
    console.log("🚀 ~ handleSubmit ~ userData:", userData);
    const user = userData.user;
    const apiBody = {
      equipment_id: EquipmentId,
      user_id: employee.value,
      user_name: employee.label,
      signed_out: getFormattedDate(date),
      assign_desc: description,
    };
    console.log("🚀 ~ handleSubmit ~ apiBody:", apiBody);
    try {
      const response = await axios.post(
        `${BASE_URL}equipment/assign`,
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
            Assign Equipment to IDR Employee
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
              Assign to IDR Employee
            </MyText>
            {/* <View style={[styles.viewcontainer, styles.outlined]}> */}
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              iconStyle={styles.iconStyle}
              data={allEmployee}
              labelField="label"
              valueField="value"
              placeholder="Select Employee"
              value={allEmployee?.value}
              itemTextStyle={styles.itemTextStyle}
              // search
              maxHeight={hp(20)}
              searchPlaceholder="Search..."
              onChange={handleSetEmployee}
              renderItem={renderItem}
            />
            {/* </View> */}
          </View>
          <View style={{}}>
            <CustomDatePicker
              date={date}
              setDate={setDate}
              label="Signed Out date"
              minimumDate={new Date()}
            />
          </View>
          <View style={{}}>
            <MyText style={{ marginVertical: hp(1.2), color: AppColors.black }}>
              Description
            </MyText>
            <View style={[styles.viewcontainer, styles.outlined]}>
              <TextInput
                value={description}
                onChangeText={handleDescriptionChange}
                style={[styles.default]}
                multiline
                editable={true}
              />
            </View>
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
