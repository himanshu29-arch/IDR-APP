import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardTypeOptions,
} from "react-native";
import React from "react";
import { AppColors } from "../utils/colors";
import MyText from "./customtext";
import CustomIcon from "./customIcon";
import {
  useForm,
  Controller,
  Control,
  FieldValues,
  RegisterOptions,
} from "react-hook-form";

type props = {
  label?: string;
  placeholder: string;
  isOutline?: boolean;
  rightIcon?: string;
  leftIcon?: string;
  onRighticonPress?: () => void;
  onLefticonPress?: () => void;
  secureTextEntry?: boolean;
  control: Control<FieldValues, any>;
  rules?: Omit<
    RegisterOptions<FieldValues>,
    "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
  >;
  name: string;
  defaultValue?: string;
  errors: any;
  externalValue?: string;
  keyboardType?: KeyboardTypeOptions;
  isDisabled?: boolean;
};
export default function CustomInput({
  label,
  placeholder,
  isOutline,
  rightIcon,
  leftIcon,
  onRighticonPress,
  onLefticonPress,
  secureTextEntry,
  rules,
  name,
  control,
  defaultValue,
  errors,
  externalValue,
  keyboardType,
  isDisabled,
}: props) {
  return (
    <View style={{ width: "100%", alignSelf: "center" }}>
      {label && (
        <MyText
          style={{
            marginVertical: 5,
            color: isOutline ? AppColors.iconsGrey : AppColors.black,
          }}
        >
          {label}
        </MyText>
      )}
      <View
        style={[
          styles.viewcontainer,
          !isOutline ? styles.outlined : styles.notoutlined,
        ]}
      >
        {leftIcon && (
          <CustomIcon
            name={leftIcon}
            color={AppColors.iconsGrey}
            onPress={onLefticonPress}
          />
        )}
        <Controller
          control={control}
          name={name}
          rules={rules}
          defaultValue={defaultValue}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder={placeholder}
              value={value ?? externalValue}
              onChangeText={onChange}
              style={[styles.default]}
              secureTextEntry={secureTextEntry}
              keyboardType={keyboardType}
              editable={!isDisabled}
              placeholderTextColor={AppColors.grey}
              multiline
            />
          )}
        />
        {rightIcon && (
          <CustomIcon
            name={rightIcon}
            color={AppColors.iconsGrey}
            onPress={onRighticonPress}
          />
        )}
      </View>
      {errors[name]?.message ? (
        <Text style={styles.err}>{errors[name]?.message}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  default: {
    width: "85%",
    borderRadius: 5,
    padding: 10,
    color: AppColors.black,
  },
  outlined: {
    borderWidth: 1,
    borderRadius: 10,
  },
  notoutlined: {
    borderBottomWidth: 1,
  },
  viewcontainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: AppColors.darkgrey,
  },
  err: {
    color: AppColors.red,
    fontSize: 12,
    margin: 5,
  },
});
