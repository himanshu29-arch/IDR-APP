import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MyText from "./customtext";
import { Fonts, ShadowStyle } from "../utils/constants";
import { hp, wp } from "../utils/resDimensions";
import CustomButton from "./customButton";
import { AppColors } from "../utils/colors";
import CustomIcon from "./customIcon";

const EquipmentCard = ({
  item,
  onAcceptPress,
  onRejectPress,
  onReturnPress,
}) => {
  console.log("🚀 ~ item: equipment Card", item);
  return (
    <View style={[styles.card, ShadowStyle]}>
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
            {item?.equipments?.device_type}
          </MyText>
        </View>
        <View>
          <MyText fontType="medium" style={{ fontSize: 14 }}>
            Status
          </MyText>
          <MyText
            style={{
              fontSize: 14,
              fontFamily: Fonts.InterBold,
              marginTop: hp(1),
              alignSelf: "center",
            }}
          >
            {item?.status == "Accepted" && item?.is_return_req == true
              ? `Return`
              : item?.status}
          </MyText>
        </View>
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
            {item?.equipments?.make}
          </MyText>
        </View>
        <View>
          <MyText fontType="medium" style={{ fontSize: 14 }}>
            Model
          </MyText>
          <MyText style={{ fontSize: 14, marginTop: 10 }}>
            {item?.equipments?.model}
          </MyText>
        </View>
        <View>
          <MyText fontType="medium" style={{ fontSize: 14 }}>
            Serial Number
          </MyText>
          <MyText style={{ fontSize: 14, marginTop: 10 }}>
            {item?.equipments?.serial_number}
          </MyText>
        </View>
      </View>

      {item?.status == "Pending" ? (
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <TouchableOpacity
            onPress={() => onAcceptPress(item?.assign_equip_id)}
            style={[
              styles.buttonContainer,
              { backgroundColor: AppColors.primary, width: wp(35) },
            ]}
          >
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onRejectPress(item?.assign_equip_id)}
            style={[
              styles.buttonContainer,
              { backgroundColor: "rgba(204, 0, 0, .6)", width: wp(35) },
            ]}
          >
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      ) : item?.status == "Accepted" && item?.is_return_req != true ? (
        <View style={{ alignSelf: "center" }}>
          <TouchableOpacity
            onPress={() => onReturnPress(item?.assign_equip_id)}
            style={[
              styles.buttonContainer,
              { backgroundColor: "rgba(204, 0, 0, .6)", width: wp(75) },
            ]}
          >
            <Text style={styles.buttonText}>Return</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.white,
    borderRadius: 10,
    padding: 20,
    margin: 10,
    marginTop: hp(4),
  },
  buttonContainer: {
    height: hp(4),

    borderRadius: 12,
    marginTop: hp(2),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,

    justifyContent: "center",
  },
  buttonText: {
    fontSize: 14,
    color: AppColors.white,
    alignSelf: "center",
  },
});

export default EquipmentCard;
