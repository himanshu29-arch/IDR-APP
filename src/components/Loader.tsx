import { View, Text, Modal, ActivityIndicator } from "react-native";
import React from "react";
import { AppColors } from "../utils/colors";


type prop = {
    loading: boolean;
};

export default function Loader({ loading }: prop) {
  return (
    <Modal visible={loading} style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator
          animating
          color={AppColors.primary}
          size="large"
        />
        <Text style={{ fontSize: 22, color: AppColors.primary, margin: 20 }}>
          Loading...
        </Text>
      </View>
    </Modal>
  );
}
