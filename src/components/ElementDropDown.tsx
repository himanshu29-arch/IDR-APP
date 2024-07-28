import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
} from "react-native";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import { AppColors } from "../utils/colors";
import CustomIcon from "./customIcon";
import { Fonts } from "../utils/constants";
import { fp, hp, wp } from "../utils/resDimensions";
import CustomButton from "./customButton";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const MultiSelectComponent: React.FC<MultiSelectComponentProps> = ({
  //inner dropdown
  dropdownPlaceholder,
  firstDropdownValue,
  setFirstDropdownValue,
  dropDownOptions,
  setFirstDropdownLabel,
  //first input
  firstInput,
  setFirstInput,
  firstInputPlaceholder,
  //second input
  secondInput,
  setSecondInput,
  secondInputPlaceholder,
  //third input
  thirdInput,
  setThirdInput,
  thirdInputPlaceholder,
  //parent dropdown
  isParentDropdownOpen,
  toggleParentDropdown,
  //submit/disable
  handleApplyFilter,
  isApplyDisable,
  //Reset filter
  handleResetFilter,
}) => {
  const { userData } = useSelector((state: RootState) => state.auth);

  const renderItem = (item, index) => {
    return (
      <View style={styles.item}>
        <Text style={styles.selectedTextStyle}>{item.label}</Text>
      </View>
    );
  };

  const handleChange = (item) => {
    setFirstDropdownValue((prev) => (prev === item.value ? null : item.value));
    setFirstDropdownLabel((prev) => (prev == item?.label ? null : item.label));
  };
  console.log("🚀 ~ dropdownPlaceholder:", dropdownPlaceholder);

  return (
    <View style={styles.container}>
      {/* Parent Dropdown */}
      <TouchableOpacity
        onPress={toggleParentDropdown}
        style={styles.parentDropdown}
      >
        <Text style={styles.parentDropdownText}>Filters</Text>
        <CustomIcon
          name={isParentDropdownOpen ? "chevron-down" : "chevron-forward"}
          color={AppColors.darkgreyColor}
        />
      </TouchableOpacity>

      {/* Nested Content */}
      {isParentDropdownOpen && (
        <View style={styles.nestedContent}>
          {/* Status MultiSelect */}
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            iconStyle={styles.iconStyle}
            data={dropDownOptions}
            labelField="label"
            valueField="value"
            placeholder={dropdownPlaceholder}
            value={firstDropdownValue}
            itemTextStyle={styles.itemTextStyle}
            searchPlaceholder="Search..."
            onChange={handleChange}
            renderItem={renderItem}
          />

          {dropdownPlaceholder === "Select Location" ? (
            <TextInput
              style={styles.input}
              placeholder={firstInputPlaceholder}
              placeholderTextColor={AppColors.black}
              value={firstInput}
              onChangeText={setFirstInput}
            />
          ) : userData?.user?.user_type !== "Client Employee" ? (
            <TextInput
              style={styles.input}
              placeholder={firstInputPlaceholder}
              placeholderTextColor={AppColors.black}
              value={firstInput}
              onChangeText={setFirstInput}
            />
          ) : null}

          {dropdownPlaceholder === "Select Location" ? (
            <>
              <TextInput
                style={styles.input}
                placeholder={secondInputPlaceholder}
                placeholderTextColor={AppColors.black}
                value={secondInput}
                onChangeText={setSecondInput}
              />

              {/* Project Manager Name TextInput */}
              <TextInput
                style={styles.input}
                placeholder={thirdInputPlaceholder}
                placeholderTextColor={AppColors.black}
                value={thirdInput}
                onChangeText={setThirdInput}
              />
            </>
          ) : userData?.user?.user_type == "Admin" ||
            userData?.user?.user_type == "Subadmin" ? (
            <>
              <TextInput
                style={styles.input}
                placeholder={secondInputPlaceholder}
                placeholderTextColor={AppColors.black}
                value={secondInput}
                onChangeText={setSecondInput}
              />

              {/* Project Manager Name TextInput */}
              <TextInput
                style={styles.input}
                placeholder={thirdInputPlaceholder}
                placeholderTextColor={AppColors.black}
                value={thirdInput}
                onChangeText={setThirdInput}
              />
            </>
          ) : null}

          {/* Technician Name TextInput */}

          <View
            style={{
              marginTop: hp(1),
              alignSelf: "center",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <CustomButton
              _width={wp(35)}
              title="Apply"
              onPress={handleApplyFilter}
              isdisabled={isApplyDisable}
            />
            <View style={{ marginLeft: wp(4) }}>
              <CustomButton
                _width={wp(35)}
                title="Reset"
                onPress={handleResetFilter}
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default MultiSelectComponent;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  parentDropdown: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppColors.darkgrey,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  parentDropdownText: {
    fontSize: 16,
    flex: 1,
    color: "black",
  },
  dropdownIcon: {
    marginLeft: 10,
  },
  nestedContent: {
    marginTop: 12,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
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
  selectedContainer: {
    borderRadius: fp(4),
    // height: hp(5),
    // width: wp(20),
    padding: fp(1),
    alignItems: "center",
    marginBottom: hp(2),
  },
  itemTextStyle: {
    // fontSize: 16,
    color: AppColors.black,
    fontFamily: Fonts.REGULAR,
  },
  iconStyle: {
    width: 28,
    height: 28,
    color: "black",
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  input: {
    // height: 30,
    backgroundColor: AppColors.darkgrey,
    borderRadius: 12,
    paddingLeft: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    fontFamily: Fonts.REGULAR,
    color: AppColors.black,
    fontSize: fp(1.8),
    padding: fp(1),
  },
});
