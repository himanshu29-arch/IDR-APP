import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setQRData } from "../../redux/slices/QRDataSlice";

export default function Equipment() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setQRData(""));
  }, []);

  return (
    <View>
      <Text>Equipment</Text>
    </View>
  );
}
