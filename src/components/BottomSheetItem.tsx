import React from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import MyText from "./customtext";
import { AppColors } from "../utils/colors";
import { fp, hp, wp } from "../utils/resDimensions";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
export function BottomSheetItem({ BottomSheetData }) {
  const iconComponents = {
    FontAwesome: FontAwesome,
    MaterialIcons: MaterialIcons,
    Ionicons: Ionicons,
    MaterialCommunityIcons: MaterialCommunityIcons,
    // Add other icon families here if needed
  };

  function renderItem({ item }) {
    const IconComponent = iconComponents[item.iconFamily];

    return (
      <>
        <TouchableOpacity
          style={{
            marginTop: hp(2),
            flexDirection: "row",
            alignItems: "center",
          }}
          onPress={item?.onPress}
        >
          <IconComponent
            name={item.iconName}
            size={22}
            color={AppColors.black}
          />
          <MyText
            style={{
              marginVertical: 5,
              color: AppColors.black,
              fontSize: fp(2),
              marginLeft: wp(4),
            }}
          >
            {item?.label}
          </MyText>
        </TouchableOpacity>
        <View
          style={{
            height: hp(0.1),
            backgroundColor: AppColors.bluishgrey,
            marginTop: hp(1.2),
          }}
        />
      </>
    );
  }

  return (
    <View
      style={[
        {
          marginHorizontal: wp(4),
          marginVertical: hp(2),

          // alignItems: "center",
        },
      ]}
    >
      <MyText style={{ marginVertical: 5, color: AppColors.darkgreyColor }}>
        Options
      </MyText>
      <FlatList renderItem={renderItem} data={BottomSheetData} />
    </View>
  );
}
