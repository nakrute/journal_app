import { useEffect } from "react";
import { Alert } from "react-native";
import {
  cancelNotification,
  configureNotificationChannel,
  EXPO_GO_NOTIFICATION_UNSUPPORTED,
  formatReminderTime,
  getNotificationPermissionStatus,
  scheduleDailyCheckInNotification,
  sendTestNotification
} from "../utils/notifications";
import { usePersistedState } from "./usePersistedState";

const initialNotificationSettings = {
  enabled: false,
  hour: 18,
  minute: 0,
  permissionStatus: "unknown",
  scheduledId: null
};

export function useDailyReminderNotifications() {
  const [notificationSettings, setNotificationSettings] = usePersistedState(
    "voiceReal.notificationSettings",
    initialNotificationSettings
  );

  useEffect(() => {
    async function prepareNotifications() {
      try {
        await configureNotificationChannel();
        const permissionStatus = await getNotificationPermissionStatus();
        setNotificationSettings((current) => ({
          ...current,
          permissionStatus
        }));
      } catch (error) {
        console.warn("Notification setup failed", error);
      }
    }

    prepareNotifications();
  }, []);

  async function toggleDailyReminder() {
    if (notificationSettings.enabled) {
      await cancelNotification(notificationSettings.scheduledId);
      setNotificationSettings((current) => ({
        ...current,
        enabled: false,
        scheduledId: null
      }));
      return;
    }

    try {
      const scheduledId = await scheduleDailyCheckInNotification(notificationSettings);
      setNotificationSettings((current) => ({
        ...current,
        enabled: true,
        permissionStatus: "granted",
        scheduledId
      }));
      Alert.alert("Reminder set", `You will get a daily check-in reminder at ${formatReminderTime(notificationSettings)}.`);
    } catch (error) {
      if (isExpoGoNotificationError(error)) {
        showDevelopmentBuildAlert("The app is ready for notifications in a development build.");
        return;
      }

      setNotificationSettings((current) => ({
        ...current,
        enabled: false,
        permissionStatus: "denied",
        scheduledId: null
      }));
      Alert.alert("Notifications blocked", "Enable notifications for OutLoud in your device settings to use reminders.");
    }
  }

  async function changeReminderTime(option) {
    let scheduledId = notificationSettings.scheduledId;

    try {
      if (notificationSettings.enabled) {
        await cancelNotification(notificationSettings.scheduledId);
        scheduledId = await scheduleDailyCheckInNotification(option);
      }

      setNotificationSettings((current) => ({
        ...current,
        hour: option.hour,
        minute: option.minute,
        scheduledId
      }));
    } catch (error) {
      if (isExpoGoNotificationError(error)) {
        showDevelopmentBuildAlert("The app is ready for notifications in a development build.");
        return;
      }

      setNotificationSettings((current) => ({
        ...current,
        enabled: false,
        scheduledId: null
      }));
      Alert.alert("Reminder not updated", "OutLoud could not reschedule the notification on this device.");
    }
  }

  async function handleSendTestNotification() {
    try {
      await sendTestNotification();
      setNotificationSettings((current) => ({
        ...current,
        permissionStatus: "granted"
      }));
      Alert.alert("Test sent", "You should see a notification in a couple of seconds.");
    } catch (error) {
      if (isExpoGoNotificationError(error)) {
        setNotificationSettings((current) => ({
          ...current,
          permissionStatus: EXPO_GO_NOTIFICATION_UNSUPPORTED
        }));
        showDevelopmentBuildAlert("Use a development build to test them.");
        return;
      }

      setNotificationSettings((current) => ({
        ...current,
        permissionStatus: "denied"
      }));
      Alert.alert("Notifications blocked", "Enable notifications for OutLoud in your device settings, then try again.");
    }
  }

  return {
    changeReminderTime,
    notificationSettings,
    sendTestNotification: handleSendTestNotification,
    toggleDailyReminder
  };
}

function isExpoGoNotificationError(error) {
  return error?.code === EXPO_GO_NOTIFICATION_UNSUPPORTED;
}

function showDevelopmentBuildAlert(detail) {
  Alert.alert(
    "Development build needed",
    `Android Expo Go cannot run notifications on this Expo SDK. ${detail}`
  );
}
