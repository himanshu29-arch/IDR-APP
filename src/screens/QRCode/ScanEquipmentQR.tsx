import React, { useEffect, useRef } from "react";
import { StyleSheet, Animated, View, Dimensions, Easing } from "react-native";

import QRCodeScanner from "react-native-qrcode-scanner";
import { RNCamera } from "react-native-camera";
import { hp, wp } from "../../utils/resDimensions";
import { AppColors } from "../../utils/colors";
import { useDispatch } from "react-redux";
import { setEquipmentQRData } from "../../redux/slices/EquipmentQRDataSlice";
const { height } = Dimensions.get("window");

const ScanEquipmentQR = ({ navigation }) => {
  const dispatch = useDispatch();
  const onSuccess = (e) => {
    console.log("🚀 ~ onSuccess ~ e:", e?.data);
    dispatch(setEquipmentQRData(e?.data));
    navigation.navigate("Equipment", {
      modelFromQR: e?.data,
      previousRoute: "QR",
    });
  };
  const translateY = useRef(new Animated.Value(-hp(25))).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: hp(25),
          duration: 2200,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.linear),
        }),
        Animated.timing(translateY, {
          toValue: -hp(25),
          duration: 2200,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.linear),
        }),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [translateY]);
  return (
    <QRCodeScanner
      onRead={onSuccess}
      flashMode={RNCamera.Constants.FlashMode.auto}
      cameraStyle={{ height: height + 60 }}
      customMarker={
        <View style={styles.container}>
          <Animated.View
            style={[styles.line, { transform: [{ translateY }] }]}
          />
        </View>
      }
      showMarker
    />
  );
};
const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: "#777",
  },
  textBold: {
    fontWeight: "500",
    color: "#000",
  },
  buttonText: {
    fontSize: 21,
    color: "rgb(0,122,255)",
  },
  buttonTouchable: {
    padding: 16,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  line: {
    width: wp(100),
    height: 1,
    backgroundColor: AppColors.primary,
    position: "absolute",
  },
});

export default ScanEquipmentQR;
