import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useStyles, useTheme } from "../../theme";
import {
  EXPO_GO_NOTIFICATION_UNSUPPORTED,
  formatReminderTime,
  reminderTimeOptions
} from "../../utils/notifications";
import { validateHandle, validateTimeValue } from "../../utils/validation";

export function SettingsSection({
  activityLog,
  isDarkMode,
  notificationSettings,
  onClearActivityLog,
  onClearLocalPosts,
  onChangeReminderTime,
  onRequestCameraPermission,
  onRequestMicrophonePermission,
  onPickProfilePhoto,
  onResetOnboarding,
  onRestoreDemoData,
  onRunBugScenario,
  onSendTestNotification,
  onSimulateFriendPost,
  onTogglePrivacySetting,
  onToggleDailyReminder,
  onToggleDarkMode,
  onToggleNotificationPreference,
  onUpdateSecuritySettings,
  onUpdateQuietHours,
  onUpdateProfile,
  permissionStatuses,
  profile,
  privacySettings,
  promptHistory,
  reports,
  safetySettings,
  securitySettings
}) {
  const styles = useStyles();
  const [settingsSection, setSettingsSection] = useState("account");
  const notificationsUnsupported =
    notificationSettings.permissionStatus === EXPO_GO_NOTIFICATION_UNSUPPORTED;

  return (
    <View style={styles.profilePanel}>
      <SettingsMenu active={settingsSection} onChange={setSettingsSection} />

      {settingsSection === "account" ? (
        <AccountSettings
          isDarkMode={isDarkMode}
          onToggleDarkMode={onToggleDarkMode}
          onPickProfilePhoto={onPickProfilePhoto}
          onUpdateProfile={onUpdateProfile}
          onUpdateSecuritySettings={onUpdateSecuritySettings}
          profile={profile}
          securitySettings={securitySettings}
        />
      ) : null}

      {settingsSection === "notifications" ? (
        <NotificationSettings
          notificationSettings={notificationSettings}
          notificationsUnsupported={notificationsUnsupported}
          onChangeReminderTime={onChangeReminderTime}
          onSendTestNotification={onSendTestNotification}
          onSimulateFriendPost={onSimulateFriendPost}
          onToggleDailyReminder={onToggleDailyReminder}
          onToggleNotificationPreference={onToggleNotificationPreference}
          onUpdateQuietHours={onUpdateQuietHours}
        />
      ) : null}

      {settingsSection === "permissions" ? (
        <View style={styles.settingGroup}>
          <Text style={styles.profileLabel}>Permissions</Text>
          <PermissionRow
            icon="camera-outline"
            label="Camera"
            status={permissionStatuses.camera}
            onPress={onRequestCameraPermission}
          />
          <PermissionRow
            icon="mic-outline"
            label="Microphone"
            status={permissionStatuses.microphone}
            onPress={onRequestMicrophonePermission}
          />
          <PermissionRow
            icon="notifications-outline"
            label="Notifications"
            status={permissionStatuses.notifications}
            onPress={onSendTestNotification}
          />
        </View>
      ) : null}

      {settingsSection === "privacy" ? (
        <PrivacySettings privacySettings={privacySettings} onTogglePrivacySetting={onTogglePrivacySetting} />
      ) : null}

      {settingsSection === "safety" ? (
        <SafetySettings reports={reports} safetySettings={safetySettings} />
      ) : null}

      {settingsSection === "history" ? (
        <PromptHistory promptHistory={promptHistory} />
      ) : null}

      {settingsSection === "debug" ? (
        <DebugSettings
          activityLog={activityLog}
          onClearActivityLog={onClearActivityLog}
          onClearLocalPosts={onClearLocalPosts}
          onResetOnboarding={onResetOnboarding}
          onRestoreDemoData={onRestoreDemoData}
          onRunBugScenario={onRunBugScenario}
        />
      ) : null}
    </View>
  );
}

function SettingsMenu({ active, onChange }) {
  const styles = useStyles();

  return (
    <View style={styles.settingsMenu}>
      {[
        ["account", "Account"],
        ["permissions", "Permissions"],
        ["privacy", "Privacy"],
        ["notifications", "Alerts"],
        ["safety", "Safety"],
        ["history", "History"],
        ["debug", "Debug"]
      ].map(([key, label]) => (
        <Pressable
          key={key}
          style={[styles.reminderTimeButton, active === key && styles.activeReminderTimeButton]}
          onPress={() => onChange(key)}
        >
          <Text style={[styles.reminderTimeText, active === key && styles.activeReminderTimeText]}>
            {label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function AccountSettings({
  isDarkMode,
  onToggleDarkMode,
  onPickProfilePhoto,
  onUpdateProfile,
  onUpdateSecuritySettings,
  profile,
  securitySettings
}) {
  const styles = useStyles();

  return (
    <>
      <Pressable style={styles.settingRow} onPress={onToggleDarkMode}>
        <View>
          <Text style={styles.settingTitle}>Dark mode</Text>
          <Text style={styles.subtle}>Switch the app to a darker color theme.</Text>
        </View>
        <View style={[styles.switchTrack, isDarkMode && styles.switchTrackActive]}>
          <View style={[styles.switchThumb, isDarkMode && styles.switchThumbActive]} />
        </View>
      </Pressable>

      <Pressable style={styles.settingRow} onPress={onPickProfilePhoto}>
        <View>
          <Text style={styles.settingTitle}>Profile photo</Text>
          <Text style={styles.subtle}>Pick a picture from this device.</Text>
        </View>
        <Ionicons name="image-outline" size={20} color="#111" />
      </Pressable>

      <ProfileField
        label="Display name"
        value={profile.name}
        onChangeText={(value) => onUpdateProfile("name", value)}
        placeholder="Your name"
      />
      <ProfileField
        label="Handle"
        value={profile.handle}
        onChangeText={(value) => onUpdateProfile("handle", value)}
        placeholder="@yourhandle"
        autoCapitalize="none"
        error={validateHandle(profile.handle)}
      />
      <ProfileField
        label="Profile photo URL"
        value={profile.avatarUri || ""}
        onChangeText={(value) => onUpdateProfile("avatarUri", value)}
        placeholder="https://example.com/photo.jpg"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <ProfileField
        label="Bio"
        value={profile.bio}
        onChangeText={(value) => onUpdateProfile("bio", value)}
        placeholder="Say something real..."
        multiline
      />

      <SecuritySection
        securitySettings={securitySettings}
        onUpdateSecuritySettings={onUpdateSecuritySettings}
      />
    </>
  );
}

function NotificationSettings({
  notificationSettings,
  notificationsUnsupported,
  onChangeReminderTime,
  onSendTestNotification,
  onSimulateFriendPost,
  onToggleDailyReminder,
  onToggleNotificationPreference,
  onUpdateQuietHours
}) {
  const styles = useStyles();

  return (
    <View style={styles.settingGroup}>
      <Pressable
        style={[styles.settingRow, notificationsUnsupported && styles.disabledButton]}
        onPress={onToggleDailyReminder}
        disabled={notificationsUnsupported}
      >
        <View style={styles.settingCopy}>
          <Text style={styles.settingTitle}>Daily reminders</Text>
          <Text style={styles.subtle}>
            {notificationsUnsupported
              ? "Android Expo Go needs a development build for notifications."
              : notificationSettings.enabled
              ? `Scheduled for ${formatReminderTime(notificationSettings)}.`
              : "Get a local reminder to make today's post."}
          </Text>
        </View>
        <View style={[styles.switchTrack, notificationSettings.enabled && styles.switchTrackActive]}>
          <View style={[styles.switchThumb, notificationSettings.enabled && styles.switchThumbActive]} />
        </View>
      </Pressable>

      <View style={styles.reminderTimes}>
        {reminderTimeOptions.map((option) => {
          const selected =
            option.hour === notificationSettings.hour && option.minute === notificationSettings.minute;

          return (
            <Pressable
              key={option.label}
              style={[
                styles.reminderTimeButton,
                selected && styles.activeReminderTimeButton,
                notificationsUnsupported && styles.disabledButton
              ]}
              onPress={() => onChangeReminderTime(option)}
              disabled={notificationsUnsupported}
            >
              <Text style={[styles.reminderTimeText, selected && styles.activeReminderTimeText]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        style={[styles.testNotificationButton, notificationsUnsupported && styles.disabledButton]}
        onPress={onSendTestNotification}
        disabled={notificationsUnsupported}
      >
        <Ionicons name="notifications-outline" size={18} color="#111" />
        <Text style={styles.testNotificationText}>Send test notification</Text>
      </Pressable>
      <Pressable style={styles.secondaryActionButton} onPress={onSimulateFriendPost}>
        <Text style={styles.secondaryActionText}>Simulate new friend post</Text>
      </Pressable>

      <ToggleRow
        enabled={notificationSettings.friendPostsEnabled}
        label="Friend post alerts"
        description="Notify when a friend posts a new check-in."
        onPress={() => onToggleNotificationPreference("friendPostsEnabled")}
      />
      <ToggleRow
        enabled={notificationSettings.friendRequestsEnabled}
        label="Friend request alerts"
        description="Notify when someone asks to connect."
        onPress={() => onToggleNotificationPreference("friendRequestsEnabled")}
      />
      <ToggleRow
        enabled={notificationSettings.quietHoursEnabled}
        label="Quiet hours"
        description={`Pause social alerts from ${notificationSettings.quietHoursStart} to ${notificationSettings.quietHoursEnd}.`}
        onPress={() => onToggleNotificationPreference("quietHoursEnabled")}
      />
      <View style={styles.friendAddRow}>
        <TextInput
          style={styles.friendAddInput}
          value={notificationSettings.quietHoursStart}
          onChangeText={(value) => onUpdateQuietHours("quietHoursStart", value)}
          placeholder="22:00"
          placeholderTextColor="#8a867d"
        />
        <TextInput
          style={styles.friendAddInput}
          value={notificationSettings.quietHoursEnd}
          onChangeText={(value) => onUpdateQuietHours("quietHoursEnd", value)}
          placeholder="08:00"
          placeholderTextColor="#8a867d"
        />
      </View>
      {notificationSettings.quietHoursEnabled &&
      (validateTimeValue(notificationSettings.quietHoursStart) ||
        validateTimeValue(notificationSettings.quietHoursEnd)) ? (
        <Text style={styles.errorText}>
          {validateTimeValue(notificationSettings.quietHoursStart) ||
            validateTimeValue(notificationSettings.quietHoursEnd)}
        </Text>
      ) : null}
    </View>
  );
}

function PrivacySettings({ privacySettings, onTogglePrivacySetting }) {
  const styles = useStyles();

  return (
    <View style={styles.settingGroup}>
      <Text style={styles.profileLabel}>Privacy</Text>
      <ToggleRow
        enabled={privacySettings.allowFriendRequests}
        label="Allow friend requests"
        description="Let people send local mock requests."
        onPress={() => onTogglePrivacySetting("allowFriendRequests")}
      />
      <ToggleRow
        enabled={privacySettings.allowProfileDiscovery}
        label="Profile discovery"
        description="Let your profile appear in friend search."
        onPress={() => onTogglePrivacySetting("allowProfileDiscovery")}
      />
      <ToggleRow
        enabled={privacySettings.privateProfile}
        label="Private profile"
        description="Mark this profile as private in local settings."
        onPress={() => onTogglePrivacySetting("privateProfile")}
      />
      <ToggleRow
        enabled={privacySettings.savePostsToArchive}
        label="Save posts to archive"
        description="Keep check-ins in prompt history."
        onPress={() => onTogglePrivacySetting("savePostsToArchive")}
      />
      <ToggleRow
        enabled={privacySettings.muteDailyReminders}
        label="Mute reminders"
        description="A local preference for future notification logic."
        onPress={() => onTogglePrivacySetting("muteDailyReminders")}
      />
    </View>
  );
}

function SafetySettings({ reports = [], safetySettings }) {
  const styles = useStyles();

  return (
    <View style={styles.settingGroup}>
      <Text style={styles.profileLabel}>Release safety</Text>
      <View style={styles.historyRow}>
        <Text style={styles.settingTitle}>Terms and privacy</Text>
        <Text style={styles.subtle}>
          Placeholder screens are ready for legal copy, delete account, export data, and support links before public launch.
        </Text>
        <Text style={styles.caption}>Support: {safetySettings.supportEmail}</Text>
      </View>
      <View style={styles.historyRow}>
        <Text style={styles.settingTitle}>Age gate</Text>
        <Text style={styles.subtle}>
          Production should require an age confirmation before account creation.
        </Text>
      </View>
      <Text style={styles.profileLabel}>Local reports</Text>
      {reports.length === 0 ? (
        <Text style={styles.subtle}>Reports you create in this prototype will appear here.</Text>
      ) : (
        reports.slice(0, 5).map((report) => (
          <View key={report.id} style={styles.historyRow}>
            <Text style={styles.settingTitle}>{report.targetName}</Text>
            <Text style={styles.subtle}>{report.targetType} / {report.reason}</Text>
          </View>
        ))
      )}
    </View>
  );
}

function PromptHistory({ promptHistory }) {
  const styles = useStyles();

  return (
    <View style={styles.settingGroup}>
      <Text style={styles.profileLabel}>Prompt history</Text>
      {promptHistory.length === 0 ? (
        <Text style={styles.subtle}>Your posted daily prompts will appear here.</Text>
      ) : (
        promptHistory.map((item) => (
          <View key={item.id} style={styles.historyRow}>
            <Text style={styles.settingTitle}>{formatHistoryDate(item.date)}</Text>
            <Text style={styles.subtle}>{item.prompt}</Text>
            <Text style={styles.caption}>{item.caption}</Text>
          </View>
        ))
      )}
    </View>
  );
}

function DebugSettings({
  activityLog,
  onClearActivityLog,
  onClearLocalPosts,
  onResetOnboarding,
  onRestoreDemoData,
  onRunBugScenario
}) {
  const styles = useStyles();

  return (
    <View style={styles.settingGroup}>
      <Text style={styles.profileLabel}>Bug bash</Text>
      <View style={styles.demoActions}>
        <Pressable style={styles.secondaryActionButton} onPress={() => onRunBugScenario("missingAudio")}>
          <Text style={styles.secondaryActionText}>Missing audio</Text>
        </Pressable>
        <Pressable style={styles.secondaryActionButton} onPress={() => onRunBugScenario("emptyFriends")}>
          <Text style={styles.secondaryActionText}>Empty friends</Text>
        </Pressable>
        <Pressable style={styles.secondaryActionButton} onPress={() => onRunBugScenario("manyPosts")}>
          <Text style={styles.secondaryActionText}>Many posts</Text>
        </Pressable>
        <Pressable style={styles.secondaryActionButton} onPress={() => onRunBugScenario("longCaption")}>
          <Text style={styles.secondaryActionText}>Long caption</Text>
        </Pressable>
      </View>

      <Text style={styles.profileLabel}>Activity log</Text>
      {activityLog.length === 0 ? (
        <Text style={styles.subtle}>Local app actions will appear here.</Text>
      ) : (
        activityLog.map((item) => (
          <View key={item.id} style={styles.historyRow}>
            <Text style={styles.settingTitle}>{item.message}</Text>
            <Text style={styles.subtle}>{item.time}</Text>
          </View>
        ))
      )}

      <Text style={styles.profileLabel}>Demo controls</Text>
      <View style={styles.demoActions}>
        <Pressable style={styles.secondaryActionButton} onPress={onClearActivityLog}>
          <Text style={styles.secondaryActionText}>Clear log</Text>
        </Pressable>
        <Pressable style={styles.secondaryActionButton} onPress={onResetOnboarding}>
          <Text style={styles.secondaryActionText}>Reset onboarding</Text>
        </Pressable>
        <Pressable style={styles.secondaryActionButton} onPress={onClearLocalPosts}>
          <Text style={styles.secondaryActionText}>Clear posts</Text>
        </Pressable>
        <Pressable style={styles.secondaryActionButton} onPress={onRestoreDemoData}>
          <Text style={styles.secondaryActionText}>Restore demo</Text>
        </Pressable>
      </View>
    </View>
  );
}

function PermissionRow({ icon, label, status, onPress }) {
  const styles = useStyles();
  const { isDarkMode } = useTheme();
  const iconColor = isDarkMode ? "#f8f7f2" : "#111";

  return (
    <Pressable style={styles.permissionRow} onPress={onPress}>
      <Ionicons name={icon} size={20} color={iconColor} />
      <View style={styles.settingCopy}>
        <Text style={styles.settingTitle}>{label}</Text>
        <Text style={styles.subtle}>{formatPermissionStatus(status)}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={iconColor} />
    </Pressable>
  );
}

function ToggleRow({ description, enabled, label, onPress }) {
  const styles = useStyles();

  return (
    <Pressable style={styles.settingRow} onPress={onPress}>
      <View style={styles.settingCopy}>
        <Text style={styles.settingTitle}>{label}</Text>
        <Text style={styles.subtle}>{description}</Text>
      </View>
      <View style={[styles.switchTrack, enabled && styles.switchTrackActive]}>
        <View style={[styles.switchThumb, enabled && styles.switchThumbActive]} />
      </View>
    </Pressable>
  );
}

function SecuritySection({ securitySettings, onUpdateSecuritySettings }) {
  const styles = useStyles();
  const [pin, setPin] = useState(securitySettings.pin);
  const canEnable = pin.trim().length >= 4;

  function toggleLock() {
    if (securitySettings.appLockEnabled) {
      onUpdateSecuritySettings({ appLockEnabled: false });
      return;
    }

    if (!canEnable) return;
    onUpdateSecuritySettings({ appLockEnabled: true, pin });
  }

  return (
    <View style={styles.settingGroup}>
      <Text style={styles.profileLabel}>Security</Text>
      <TextInput
        style={styles.profileInput}
        value={pin}
        onChangeText={setPin}
        placeholder="Set a local PIN"
        placeholderTextColor="#8a867d"
        keyboardType="number-pad"
        maxLength={8}
        secureTextEntry
      />
      <Pressable
        style={[styles.settingRow, !securitySettings.appLockEnabled && !canEnable && styles.disabledButton]}
        onPress={toggleLock}
        disabled={!securitySettings.appLockEnabled && !canEnable}
      >
        <View style={styles.settingCopy}>
          <Text style={styles.settingTitle}>App lock</Text>
          <Text style={styles.subtle}>Require this PIN when the app starts.</Text>
        </View>
        <View style={[styles.switchTrack, securitySettings.appLockEnabled && styles.switchTrackActive]}>
          <View style={[styles.switchThumb, securitySettings.appLockEnabled && styles.switchThumbActive]} />
        </View>
      </Pressable>
    </View>
  );
}

function ProfileField({ label, ...props }) {
  const styles = useStyles();
  const { error, ...inputProps } = props;

  return (
    <View style={styles.profileField}>
      <Text style={styles.profileLabel}>{label}</Text>
      <TextInput
        style={[styles.profileInput, inputProps.multiline && styles.profileBioInput]}
        placeholderTextColor="#8a867d"
        textAlignVertical={inputProps.multiline ? "top" : "center"}
        {...inputProps}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

function formatPermissionStatus(status) {
  if (status === "granted") return "Granted";
  if (status === "denied") return "Denied";
  if (status === EXPO_GO_NOTIFICATION_UNSUPPORTED) return "Development build needed";
  return "Not requested";
}

function formatHistoryDate(value) {
  return new Date(value).toLocaleDateString([], {
    month: "short",
    day: "numeric"
  });
}
