import { View, StyleSheet, FlatList, TextInput, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { AppColors } from "../../utils/colors";
import { SCREEN_WIDTH } from "../../utils/Dimensions";
import { ShadowStyle } from "../../utils/constants";
import MyText from "../../components/customtext";
import { hp, wp } from "../../utils/resDimensions";
import Entypo from "react-native-vector-icons/Entypo";

export default function ViewWOEquipments({ InventoriesData }) {
  console.log("🚀 ~ ViewWOEquipments ~ EquipmentsData:", InventoriesData);
  const [showAll, setShowAll] = useState(false);

  const toggleShowAll = () => {
    setShowAll((prevShowAll) => !prevShowAll);
  };

  function renderNotes({ item, index }) {
    return (
      <View style={[styles.innerCard, ShadowStyle]}>
        <MyText style={{ marginVertical: 5, color: AppColors.black }}>
          Model
        </MyText>
        <View style={[styles.viewcontainer, styles.outlined]}>
          <TextInput
            // value={item.comments}
            value={item?.model}
            style={[styles.default]}
            editable={false}
            multiline
          />
        </View>
        <MyText style={{ marginVertical: 5, color: AppColors.black }}>
          Make
        </MyText>
        <View style={[styles.viewcontainer, styles.outlined]}>
          <TextInput
            value={item?.make}
            style={[styles.default]}
            editable={false}
            multiline
          />
        </View>
        <MyText style={{ marginVertical: 5, color: AppColors.black }}>
          Device Type
        </MyText>
        <View style={[styles.viewcontainer, styles.outlined]}>
          <TextInput
            value={item?.device_type}
            style={[styles.default]}
            editable={false}
            multiline
          />
        </View>
        <MyText style={{ marginVertical: 5, color: AppColors.black }}>
          Location
        </MyText>
        <View style={[styles.viewcontainer, styles.outlined]}>
          <TextInput
            value={item?.location_name}
            style={[styles.default]}
            editable={false}
            multiline
          />
        </View>
      </View>
    );
  }

  return (
    <View>
      <View style={[styles.card, ShadowStyle]}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <MyText fontType="bold" style={{ fontSize: 22 }}>
            Assigned Equipments
          </MyText>
          <Pressable onPress={toggleShowAll}>
            <Entypo
              name={`chevron-thin-${showAll ? "down" : "up"}`}
              size={24}
              color="black"
            />
          </Pressable>
        </View>

        <View style={{ marginTop: 10 }}>
          <FlatList
            scrollEnabled={false}
            data={showAll ? InventoriesData : InventoriesData.slice(0, 2)}
            renderItem={renderNotes}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    </View>
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
  innerCard: {
    backgroundColor: AppColors.white,
    width: SCREEN_WIDTH * 0.79,
    alignSelf: "center",
    borderRadius: 20,
    padding: 10,
    marginVertical: 5,
    marginBottom: hp(1),
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
