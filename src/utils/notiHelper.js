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

export async function checkAndUploadFCMPermission(showModal) {
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
      // Show a custom alert to the user by triggering the modal
      Alert.alert("", "Please allow notification permission from setting.", [
        {
          text: "Cancel",
          onPress: () => handleRequestNotificationAction("cancel"),
        },
        {
          text: "Go to setting",
          onPress: () => handleRequestNotificationAction("setting"),
        },
      ]);
      return Promise.reject(new Error("Notification permission not granted"));
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
    setModalVisible(false);
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
  });
  messaging().onNotificationOpenedApp((remotemessage) => {
    PushNotification.localNotification({
      title: remotemessage.notification.title,
      message: remotemessage.notification.body,
    });
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
