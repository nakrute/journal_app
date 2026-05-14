import { isRunningInExpoGo } from "expo";
import { Platform } from "react-native";

const DAILY_REMINDER_CHANNEL_ID = "daily-check-in";
export const EXPO_GO_NOTIFICATION_UNSUPPORTED = "expo-go-unsupported";

let NotificationsModule = null;
let notificationHandlerConfigured = false;

export const reminderTimeOptions = [
  { label: "9:00 AM", hour: 9, minute: 0 },
  { label: "12:00 PM", hour: 12, minute: 0 },
  { label: "6:00 PM", hour: 18, minute: 0 },
  { label: "9:00 PM", hour: 21, minute: 0 }
];

export function isNotificationRuntimeAvailable() {
  return !(Platform.OS === "android" && isRunningInExpoGo());
}

async function getNotificationsModule() {
  if (!isNotificationRuntimeAvailable()) {
    const error = new Error("Notifications need a development build on Android.");
    error.code = EXPO_GO_NOTIFICATION_UNSUPPORTED;
    throw error;
  }

  if (!NotificationsModule) {
    NotificationsModule = await import("expo-notifications");
  }

  if (!notificationHandlerConfigured) {
    NotificationsModule.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false
      })
    });
    notificationHandlerConfigured = true;
  }

  return NotificationsModule;
}

export async function configureNotificationChannel() {
  if (!isNotificationRuntimeAvailable()) return;
  if (Platform.OS !== "android") return;

  const Notifications = await getNotificationsModule();
  await Notifications.setNotificationChannelAsync(DAILY_REMINDER_CHANNEL_ID, {
    name: "Daily check-in",
    importance: Notifications.AndroidImportance.DEFAULT,
    sound: "default",
    vibrationPattern: [0, 250, 250, 250]
  });
}

export async function getNotificationPermissionStatus() {
  if (!isNotificationRuntimeAvailable()) return EXPO_GO_NOTIFICATION_UNSUPPORTED;

  const Notifications = await getNotificationsModule();
  const permissions = await Notifications.getPermissionsAsync();
  return permissions.status;
}

export async function ensureNotificationPermission(Notifications) {
  const notifications = Notifications || (await getNotificationsModule());
  const currentPermissions = await notifications.getPermissionsAsync();
  if (currentPermissions.granted) return currentPermissions.status;

  const requestedPermissions = await notifications.requestPermissionsAsync();
  return requestedPermissions.status;
}

export async function scheduleDailyCheckInNotification({ hour, minute }) {
  const Notifications = await getNotificationsModule();
  const status = await ensureNotificationPermission(Notifications);
  if (status !== "granted") {
    throw new Error("Notification permission was not granted.");
  }

  return Notifications.scheduleNotificationAsync({
    content: {
      title: "Time to be real",
      body: "Capture today's photo and voice note before the moment gets polished.",
      sound: "default"
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      channelId: DAILY_REMINDER_CHANNEL_ID,
      hour,
      minute
    }
  });
}

export async function cancelNotification(notificationId) {
  if (!notificationId) return;

  const Notifications = await getNotificationsModule();
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

export async function sendTestNotification() {
  const Notifications = await getNotificationsModule();
  const status = await ensureNotificationPermission(Notifications);
  if (status !== "granted") {
    throw new Error("Notification permission was not granted.");
  }

  return Notifications.scheduleNotificationAsync({
    content: {
      title: "OutLoud test",
      body: "Notifications are ready for your daily check-in.",
      sound: "default"
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      channelId: DAILY_REMINDER_CHANNEL_ID,
      seconds: 2
    }
  });
}

export function formatReminderTime({ hour, minute }) {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit"
  });
}
