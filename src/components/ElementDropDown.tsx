import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
} from "react-native";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import AntDesign from "react-native-vector-icons/AntDesign";
import { AppColors } from "../utils/colors";
import CustomIcon from "./customIcon";
import { Fonts } from "../utils/constants";
import { fp, hp, wp } from "../utils/resDimensions";
import CustomButton from "./customButton";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const data = [
  { label: "Open", value: "Open" },
  { label: "Design", value: "Design" },
  { label: "In Progress", value: "In Progress" },
  { label: "Reviewing", value: "Reviewing" },
  { label: "Closed", value: "Closed" },
];

const MultiSelectComponent = ({
  selectedStatus,
  setSelectedStatus,
  clientName,
  setClientName,
  technicianName,
  setTechnicianName,
  projectManagerName,
  setProjectManagerName,
  isParentDropdownOpen,
  toggleParentDropdown,
  handleApplyFilter,
  isApplyDisable,
}) => {
  const { userData } = useSelector((state: RootState) => state.auth);
  console.log(userData?.user?.user_type, "userType");

  const renderItem = (item, index) => {
    return (
      <View style={styles.item}>
        <Text style={styles.selectedTextStyle}>{item.label}</Text>
      </View>
    );
  };

  const handleChange = (item) => {
    setSelectedStatus((prev) => (prev === item.value ? null : item.value));
  };

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
            data={data}
            labelField="label"
            valueField="value"
            placeholder="Select status"
            value={selectedStatus}
            itemTextStyle={styles.itemTextStyle}
            // search
            searchPlaceholder="Search..."
            onChange={handleChange}
            // renderLeftIcon={() => (
            //   <AntDesign
            //     style={styles.icon}
            //     color="black"
            //     name="Safety"
            //     size={20}
            //   />
            // )}
            renderItem={renderItem}
          />

          {/* Client Name TextInput */}
          {userData?.user?.user_type != "Client Employee" ? (
            <TextInput
              style={styles.input}
              placeholder="Enter client name"
              placeholderTextColor={AppColors.black}
              value={clientName}
              onChangeText={(text) => setClientName(text)}
            />
          ) : null}

          {/* Technician Name TextInput */}
          {userData?.user?.user_type == "Admin" ||
          userData?.user?.user_type == "Subadmin" ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Enter technician name"
                placeholderTextColor={AppColors.black}
                value={technicianName}
                onChangeText={(text) => setTechnicianName(text)}
              />

              {/* Project Manager Name TextInput */}
              <TextInput
                style={styles.input}
                placeholder="Enter project manager name"
                placeholderTextColor={AppColors.black}
                value={projectManagerName}
                onChangeText={(text) => setProjectManagerName(text)}
              />
            </>
          ) : null}

          <CustomButton
            title="Apply"
            onPress={handleApplyFilter}
            isdisabled={isApplyDisable}
          />
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
