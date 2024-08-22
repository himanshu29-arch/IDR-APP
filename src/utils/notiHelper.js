import messaging from "@react-native-firebase/messaging";
import { Alert, Linking } from "react-native";
import {
  checkNotifications,
  requestNotifications,
} from "react-native-permissions";
import { PermissionStatusType } from "./Emum";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PushNotification from "react-native-push-notification";
import { CustomAlert } from "../components/CustomAlert";
import { useToast } from "react-native-toast-notifications";
import { navigate } from "../navigation/RootNavigation";

// export async function checkAndUploadFCMPermission() {
//   const enabled = await messaging().hasPermission();
//   if (enabled === 1) {
//     // If permission is already granted, upload the FCM token
//     await uploadFcmToken();
//   } else {
//     const authStatus = await checkNotifications();
//     const permissionEnabled =
//       authStatus.status === PermissionStatusType.Granted ||
//       authStatus.status === PermissionStatusType.Limited;

//     if (permissionEnabled) {
//       // Request permission and upload the FCM token
//       await uploadFcmToken();
//     } else {
//       // If permission not granted, show alert to go to settings
//       showSettingsAlert();
//       return Promise.reject(new Error("Notification permission not granted"));
//     }
//   }
// }
export async function checkAndUploadFCMPermission() {
  const authStatus = await checkNotifications();
  const permissionEnabled =
    authStatus.status === PermissionStatusType.Granted ||
    authStatus.status === PermissionStatusType.Limited;

  if (permissionEnabled) {
    // Request permission and upload the FCM token
    await uploadFcmToken();
  } else {
    // If permission not granted, show alert to go to settings
    showSettingsAlert();
    return Promise.reject(new Error("Notification permission not granted"));
  }
}
export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  if (enabled) {
    console.log("Authorization status:", authStatus);
    uploadFcmToken();
  } else {
    showSettingsAlert();
  }
}

const showSettingsAlert = () => {
  const toast = useToast();
  toast.show("Please allow notification permission from settings.", {
    type: "success",
  });
};

export const uploadFcmToken = async () => {
  try {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      await AsyncStorage.setItem("fcmtoken", fcmToken);
    }
  } catch (error) {
    console.error("Failed to upload FCM token:", error);
    return null;
  }
};

const handleRequestNotificationAction = (elementName: string) => {
  if (elementName == "setting") {
    Linking.openSettings();
  }
};

export const requestNotificationPermission = async () => {
  const { status } = await requestNotifications(["alert", "sound"]);
  return (
    status === PermissionStatusType.Granted ||
    status === PermissionStatusType.Limited
  );
};

export const NotificationListener = () => {
  messaging().onNotificationOpenedApp((remoteMessage) => {});
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
      }
    });
  messaging().onMessage(async (remotemessage) => {
    PushNotification.localNotification({
      title: remotemessage.notification.title,
      message: remotemessage.notification.body,
    });
    // navigate("Notifications");
  });
  messaging().onNotificationOpenedApp((remotemessage) => {
    PushNotification.localNotification({
      title: remotemessage.notification.title,
      message: remotemessage.notification.body,
    });
    // navigate("Notifications");
  });
};
