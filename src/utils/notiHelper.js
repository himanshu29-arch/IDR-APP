import messaging from "@react-native-firebase/messaging";
import { Alert, Linking } from "react-native";
import {
  checkNotifications,
  requestNotifications,
} from "react-native-permissions";
import { PermissionStatusType } from "./Emum";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function checkAndUploadFCMPermission() {
  const enabled = await messaging().hasPermission();

  if (enabled === messaging.AuthorizationStatus.AUTHORIZED) {
    // If permission is already granted, upload the FCM token
    uploadFcmToken();
  } else {
    const authStatus = await checkNotifications();
    const permissionEnabled =
      authStatus.status === PermissionStatusType.Granted ||
      authStatus.status === PermissionStatusType.Limited;
    if (permissionEnabled) {
      // Request permission and upload the FCM token
      uploadFcmToken();
    } else {
      // Show an alert to the user
      return new Promise((resolve, reject) => {
        Alert.alert(
          "",
          "Please allow notification permission from settings.",
          [
            {
              text: "Cancel",
              onPress: () => handleRequestNotificationAction("cancel"),
              style: "cancel",
            },
            {
              text: "Go to settings",
              onPress: () => handleRequestNotificationAction("settings"),
            },
          ],
          { cancelable: false }
        );
        // Reject the promise since user is being asked to go to settings
        reject(new Error("Notification permission not granted"));
      });
    }
  }
}

export const uploadFcmToken = async () => {
  try {
    const authStatus = await messaging().requestPermission();

    if (authStatus) {
      const fcmToken = await messaging().getToken();
      await AsyncStorage.setItem("fcmtoken", fcmToken);
    }

    // Return null if there is no token or permission is not granted
    return null;
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

export const isNotificationPermission = async () => {
  return checkNotifications().then(({ status }) => {
    const permissionEnabled =
      status === PermissionStatusType.Granted ||
      status === PermissionStatusType.Limited;
    return permissionEnabled;
  });
};

export const requestNotificationPermission = async () => {
  return requestNotifications(["alert", "sound"]).then(({ status }) => {
    const permissionEnabled =
      status === PermissionStatusType.Granted ||
      status === PermissionStatusType.Limited;
    return permissionEnabled;
  });
};
