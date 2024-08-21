import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomNavigation from "./BottomNavigator";
import { NavigationContainer } from "@react-navigation/native";
import Splash from "../screens/Splash/Splash";
import Login from "../screens/Login/Login";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import NewWorkOrder from "../screens/WorkOrder/AddTechnician";
import GenerateTicket from "../screens/WorkOrder/GenerateTicket";
import AddTechnician from "../screens/WorkOrder/AddTechnician";
import AddNote from "../screens/WorkOrder/AddNote";
import ViewWorkOrder from "../screens/WorkOrder/ViewWorkOrder";
import Notifications from "../screens/Notifications/Notification";
import Forgotpassword from "../screens/ForgotPassword/ForgotPassword";
import ResetPassword from "../screens/ResetPassword/ResetPassword";
import { Linking } from "react-native";
import ScanQR from "../screens/QRCode/ScanQR";
import ViewInventory from "../screens/Inventory/ViewInventory";
import AddInventory from "../screens/Inventory/AddInventory";
import LocTransfer from "../screens/Inventory/TransferInventory/LocTrasfer";
import WOTransfer from "../screens/Inventory/TransferInventory/WOTransfer";
import Inventory from "../screens/Inventory/Inventory";
import ViewEquipment from "../screens/Equipment/ViewEquipment/ViewEquipment";
import AddEquipment from "../screens/Equipment/AddEquipment/AddEquipment";
import EqEmpTransfer from "../screens/Equipment/TransferEquipment/EqEmpTransfer";
import EqWOTransfer from "../screens/Equipment/TransferEquipment/EqWOTransfer";
import ScanEquipmentQR from "../screens/QRCode/ScanEquipmentQR";

const Stack = createNativeStackNavigator();

export default function EntryStack() {
  const [splash, setSplash] = useState(true);
  const { isLoggedIn, rememberMe } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    setTimeout(() => {
      setSplash(false);
    }, 2500);
  }, []);

  const [resetRoute, setResetRoute] = useState(false);
  const [resetMail, setresetMail] = useState("");

  useEffect(() => {
    // Parse URL parameters when the app loads
    Linking.getInitialURL().then((url) => {
      handleDeepLink(url);
    });

    const handleDeepLink = async (url) => {
      console.log("17", url);
      setResetRoute(false);
      if (url) {
        const items = url.split("=");
        const userEmail = items[1];
        console.log("USER EMAIL", userEmail);
        setResetRoute(true);
        setresetMail(userEmail);
      }
    };

    // Add event listener for deep linking when app is running
    Linking.addEventListener("url", (event) => {
      handleDeepLink(event.url);
    });
    return () => {
      Linking.removeAllListeners("url");
    };
  }, []);
  const initialRoute = resetRoute ? "ResetPassword" : "Login";

  return (
    <NavigationContainer>
      {splash ? (
        <Stack.Screen name="Splash" component={Splash} />
      ) : isLoggedIn ? (
        <AppStack />
      ) : (
        <Authstack initialRoute={initialRoute} resetMail={resetMail} />
      )}
    </NavigationContainer>
  );
}

const AppStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="BottomNavigation" component={BottomNavigation} />
      <Stack.Screen name="GenerateTicket" component={GenerateTicket} />
      <Stack.Screen name="AddTechnician" component={AddTechnician} />
      <Stack.Screen name="AddNote" component={AddNote} />
      <Stack.Screen name="ViewWorkOrder" component={ViewWorkOrder} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="ScanQR" component={ScanQR} />
      <Stack.Screen name="ScanEquipmentQR" component={ScanEquipmentQR} />
      <Stack.Screen name="ViewInventory" component={ViewInventory} />
      <Stack.Screen name="AddInventory" component={AddInventory} />
      <Stack.Screen name="LocTransfer" component={LocTransfer} />
      <Stack.Screen name="WOTransfer" component={WOTransfer} />
      <Stack.Screen name="ViewEquipment" component={ViewEquipment} />
      <Stack.Screen name="AddEquipment" component={AddEquipment} />
      <Stack.Screen name="EqEmpTransfer" component={EqEmpTransfer} />
      <Stack.Screen name="EqWOTransfer" component={EqWOTransfer} />
    </Stack.Navigator>
  );
};

const Authstack = ({ initialRoute, resetMail }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={initialRoute}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Forgotpassword" component={Forgotpassword} />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
        initialParams={{ userEmail: resetMail }}
      />
    </Stack.Navigator>
  );
};
