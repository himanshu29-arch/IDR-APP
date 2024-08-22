import { View, Text, Linking } from "react-native";
import React, { useEffect, useState } from "react";
import EntryStack from "./src/navigation/EntryStack";
import { Provider } from "react-redux";
import { persistor, store } from "./src/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { ToastProvider, useToast } from "react-native-toast-notifications";
import {
  checkAndUploadFCMPermission,
  NotificationListener,
  requestNotificationPermission,
  requestUserPermission,
} from "./src/utils/notiHelper";
import { CustomAlert } from "./src/components/CustomAlert";
import { checkNotifications } from "react-native-permissions";
import { useNavigation } from "@react-navigation/native";
export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ToastProvider
          placement="top"
          duration={2000}
          animationType="zoom-in"
          animationDuration={250}
          successColor="green"
          dangerColor="red"
          warningColor="orange"
          normalColor="gray"
          //  icon={<Icon />}
          //  successIcon={<CustomIcon name='checkmark-circle' color='green' size={30}/>}
          //  dangerIcon={<DangerIcon />}
          //  warningIcon={<WarningIcon />}
          textStyle={{ fontSize: 18 }}
          offset={50} // offset for both top and bottom toasts
          offsetTop={30}
          offsetBottom={40}
          swipeEnabled={true}
          renderType={{
            custom_type: (toast) => (
              <View style={{ padding: 15, backgroundColor: "grey" }}>
                <Text>{toast.message}</Text>
              </View>
            ),
          }}
        >
          <EntryStack />
        </ToastProvider>
      </PersistGate>
    </Provider>
  );
}
