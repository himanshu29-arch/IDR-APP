import { View, Text } from "react-native";
import React, { useEffect } from "react";
import EntryStack from "./src/navigation/EntryStack";
import { Provider } from "react-redux";
import { persistor, store } from "./src/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { ToastProvider } from "react-native-toast-notifications";
import { checkAndUploadFCMPermission } from "./src/utils/notiHelper";

export default function App() {
  const getToken = async () => {
    try {
      await checkAndUploadFCMPermission();
    } catch (error) {
      console.error("Error retrieving FCM token:", error);
    }
  };

  useEffect(() => {
    getToken();
  }, []);
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
