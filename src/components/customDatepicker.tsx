import {
  View,
  KeyboardType,
  TextInput,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheetProperties,
  StyleProp,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
  Control,
  Controller,
  FieldValues,
  RegisterOptions,
} from "react-hook-form";
import { AppColors } from "../utils/colors";
import MyText from "./customtext";
import { SCREEN_WIDTH } from "../utils/Dimensions";
import { getDate, getFormattedDate } from "../utils/helperfunctions";

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 10,
    // width: DEVICE_WIDTH * 0.9,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
    alignSelf: "center",
  },
  input: {
    width: "87%",
    color: AppColors.black,
    height: "100%",
    marginHorizontal: 10,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  phoneicon: {
    color: AppColors.white,
    fontSize: 14,
    marginLeft: 20,
  },
  err: {
    color: AppColors.red,
    fontSize: 12,
    margin: 5,
  },
});
enum datetypes {
  date = "date",
  time = "time",
  datetime = "datetime",
  undefined = "undefined",
}

type props = {
  onPress?: () => void;
  touched?: any;
  errors?: any;
  iconleft?: ImageSourcePropType;
  label?: string;
  iconRight?: ImageSourcePropType;
  noborder?: boolean;
  issearch?: boolean;
  setDate: React.Dispatch<React.SetStateAction<string>>;
  date: Date;
  maximumDate?: Date;
  minimumDate?: Date;
  isSmall?: boolean;
  isDisabled: boolean;
  mode: String;
  // control: Control<FieldValues, any>;
  // rules?: Omit<RegisterOptions<FieldValues>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>,
  // name: string;
  // errortxt: string
};

export default function CustomDatePicker({
  errors,
  touched,
  iconleft,
  label,
  iconRight,
  onPress,
  noborder,
  issearch,
  setDate,
  date,
  maximumDate,
  minimumDate,
  isSmall,
  isDisabled,
}: props) {
  const [mode, setMode] = useState<datetypes>(datetypes.date);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = (mode: datetypes) => {
    setDatePickerVisibility(true);
    setMode(mode);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.log("🚀 ~ handleConfirm ~ date:", date);
    const newdate = new Date(date);
    setDate(newdate);
    hideDatePicker();
  };

  return (
    <>
      <Pressable
        style={{ marginVertical: 8 }}
        onPress={() => {
          if (!isDisabled) {
            showDatePicker("date");
          }
        }}
      >
        {label && (
          <MyText
            style={{
              fontSize: 16,
              marginVertical: 10,
            }}
          >
            {label}
          </MyText>
        )}
        <View
          style={[
            styles.container,
            {
              height: 50,
              width: isSmall ? SCREEN_WIDTH * 0.4 : SCREEN_WIDTH * 0.8,
              borderColor:
                touched && errors
                  ? AppColors.red
                  : noborder
                  ? "transparent"
                  : AppColors.darkgrey,
              backgroundColor: issearch ? "#F9FAFB" : "#fff",
            },
          ]}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {iconleft ? (
              <Pressable onPress={onPress}>
                <Image
                  source={iconleft}
                  resizeMode={"cover"}
                  style={{ marginHorizontal: 10 }}
                />
              </Pressable>
            ) : null}
            <MyText style={{ fontSize: 14, marginLeft: 10 }}>
              {getFormattedDate(date)}
            </MyText>

            {iconRight ? (
              <Pressable onPress={onPress}>
                <Image source={iconRight} resizeMode={"cover"} />
              </Pressable>
            ) : null}
          </View>
        </View>
        {touched && errors && <MyText style={styles.err}>{errors}</MyText>}
      </Pressable>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        // mode={mode}
        mode={"datetime"}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        is24Hour={true}
      />
    </>
  );
}
