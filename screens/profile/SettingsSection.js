import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { BETA_INVITE_CODE } from "../../constants/app";
import { useStyles, useTheme } from "../../theme";
import { isAdminProfile } from "../../utils/admin";
import {
  EXPO_GO_NOTIFICATION_UNSUPPORTED,
  formatReminderTime,
  reminderTimeOptions
} from "../../utils/notifications";
import { validateHandle, validateTimeValue } from "../../utils/validation";

export function SettingsSection({
  activityLog,
  betaAccess,
  isDarkMode,
  notificationSettings,
  onClearActivityLog,
  onClearLocalPosts,
  onChangeReminderTime,
  onContactSupport,
  onDeleteLocalAccount,
  onExportLocalData,
  onOpenLegal,
  onRequestCameraPermission,
  onRequestMicrophonePermission,
  onPickProfilePhoto,
  onResetOnboarding,
  onRestoreDemoData,
  onRunBugScenario,
  onSendTestNotification,
  onSignOut,
  onSimulateFriendPost,
  onTogglePrivacySetting,
  onToggleSafetySetting,
  onToggleDailyReminder,
  onToggleDarkMode,
  onToggleNotificationPreference,
  onUpdateBetaAccess,
  onUpdateQuietHours,
  onUpdatePrivacySetting,
  onUpdateProfile,
  permissionStatuses,
  profile,
  privacySettings,
  promptHistory,
  reports,
  safetySettings
}) {
  const styles = useStyles();
  const [settingsSection, setSettingsSection] = useState("account");
  const isAdmin = isAdminProfile(profile);
  const notificationsUnsupported =
    notificationSettings.permissionStatus === EXPO_GO_NOTIFICATION_UNSUPPORTED;

  useEffect(() => {
    if (!isAdmin && settingsSection === "debug") {
      setSettingsSection("account");
    }
  }, [isAdmin, settingsSection]);

  return (
    <View style={styles.profilePanel}>
      <SettingsMenu active={settingsSection} isAdmin={isAdmin} onChange={setSettingsSection} />

      {settingsSection === "account" ? (
        <AccountSettings
          isDarkMode={isDarkMode}
          onToggleDarkMode={onToggleDarkMode}
          onDeleteLocalAccount={onDeleteLocalAccount}
          onExportLocalData={onExportLocalData}
          onOpenLegal={onOpenLegal}
          onPickProfilePhoto={onPickProfilePhoto}
          onSignOut={onSignOut}
          onUpdateProfile={onUpdateProfile}
          profile={profile}
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
            description="Used only when you take or retake a post photo."
            status={permissionStatuses.camera}
            onPress={onRequestCameraPermission}
          />
          <PermissionRow
            icon="mic-outline"
            label="Microphone"
            description="Used only while recording a voice note."
            status={permissionStatuses.microphone}
            onPress={onRequestMicrophonePermission}
          />
          <PermissionRow
            icon="notifications-outline"
            label="Notifications"
            description="Used for reminders and social alerts when enabled."
            status={permissionStatuses.notifications}
            onPress={onSendTestNotification}
          />
        </View>
      ) : null}

      {settingsSection === "privacy" ? (
        <PrivacySettings
          privacySettings={privacySettings}
          onTogglePrivacySetting={onTogglePrivacySetting}
          onUpdatePrivacySetting={onUpdatePrivacySetting}
        />
      ) : null}

      {settingsSection === "safety" ? (
        <SafetySettings
          onContactSupport={onContactSupport}
          onOpenLegal={onOpenLegal}
          onToggleSafetySetting={onToggleSafetySetting}
          reports={reports}
          safetySettings={safetySettings}
        />
      ) : null}

      {settingsSection === "beta" ? (
        <BetaAccessSettings betaAccess={betaAccess} onUpdateBetaAccess={onUpdateBetaAccess} />
      ) : null}

      {settingsSection === "history" ? (
        <PromptHistory promptHistory={promptHistory} />
      ) : null}

      {isAdmin && settingsSection === "debug" ? (
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

function SettingsMenu({ active, isAdmin, onChange }) {
  const styles = useStyles();
  const menuItems = [
    ["account", "Account"],
    ["permissions", "Permissions"],
    ["privacy", "Privacy"],
    ["notifications", "Alerts"],
    ["safety", "Safety"],
    ["beta", "Beta"],
    ["history", "History"]
  ];

  if (isAdmin) {
    menuItems.push(["debug", "Debug"]);
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.settingsMenuScroller}
      contentContainerStyle={styles.settingsMenu}
    >
      {menuItems.map(([key, label]) => (
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
    </ScrollView>
  );
}

function AccountSettings({
  isDarkMode,
  onDeleteLocalAccount,
  onExportLocalData,
  onOpenLegal,
  onToggleDarkMode,
  onPickProfilePhoto,
  onSignOut,
  onUpdateProfile,
  profile
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

      <Text style={styles.profileLabel}>Account readiness</Text>
      <ActionRow
        icon="download-outline"
        title="Export local data"
        description="Share a local JSON summary of this dummy profile, posts, friends, reports, and settings."
        onPress={onExportLocalData}
      />
      <ActionRow
        icon="document-text-outline"
        title="Privacy policy"
        description="Placeholder for production data collection, retention, deletion, and voice/photo storage copy."
        onPress={() => onOpenLegal("privacy")}
      />
      <ActionRow
        icon="reader-outline"
        title="Terms and rules"
        description="Placeholder for production posting rules, user conduct, reports, and account use."
        onPress={() => onOpenLegal("terms")}
      />
      <ActionRow
        icon="log-out-outline"
        title="Sign out"
        description="No real session exists yet; this shows where Google/Supabase sign-out will live."
        onPress={onSignOut}
      />
      <Pressable style={styles.destructiveButton} onPress={onDeleteLocalAccount}>
        <Ionicons name="trash-outline" size={18} color="#111" />
        <Text style={styles.destructiveButtonText}>Delete local account data</Text>
      </Pressable>

      <View style={styles.historyRow}>
        <Text style={styles.settingTitle}>Session security groundwork</Text>
        <Text style={styles.subtle}>
          When auth is added, OAuth sessions should move to encrypted device storage and backend roles should replace local admin handles.
        </Text>
      </View>
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

function PrivacySettings({ privacySettings, onTogglePrivacySetting, onUpdatePrivacySetting }) {
  const styles = useStyles();

  return (
    <View style={styles.settingGroup}>
      <Text style={styles.profileLabel}>Privacy</Text>
      <View style={styles.historyRow}>
        <Text style={styles.settingTitle}>Default post visibility</Text>
        <Text style={styles.subtle}>Choose the starting audience for new posts before you publish.</Text>
        <View style={styles.visibilityOptions}>
          {[
            ["friends", "Friends"],
            ["close", "Close"],
            ["private", "Only me"],
            ["public", "Public"]
          ].map(([value, label]) => (
            <Pressable
              key={value}
              style={[
                styles.reminderTimeButton,
                privacySettings.defaultPostVisibility === value && styles.activeReminderTimeButton
              ]}
              onPress={() => onUpdatePrivacySetting("defaultPostVisibility", value)}
            >
              <Text
                style={[
                  styles.reminderTimeText,
                  privacySettings.defaultPostVisibility === value && styles.activeReminderTimeText
                ]}
              >
                {label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
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
        enabled={privacySettings.allowVoicePlayback}
        label="Voice playback"
        description="Allow friends to play voice notes attached to your posts."
        onPress={() => onTogglePrivacySetting("allowVoicePlayback")}
      />
      <ToggleRow
        enabled={privacySettings.closeFriendsOnlyVoice}
        label="Close friends hear voice"
        description="Default voice-note access to close friends when backend audiences arrive."
        onPress={() => onTogglePrivacySetting("closeFriendsOnlyVoice")}
      />
      <ToggleRow
        enabled={privacySettings.showActivityStatus}
        label="Show activity status"
        description="Let friends see recent activity once real accounts are connected."
        onPress={() => onTogglePrivacySetting("showActivityStatus")}
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

function SafetySettings({
  onContactSupport,
  onOpenLegal,
  onToggleSafetySetting,
  reports = [],
  safetySettings
}) {
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
      <ActionRow
        icon="mail-outline"
        title="Contact support"
        description="Keep support reachable from inside the app before public launch."
        onPress={onContactSupport}
      />
      <ActionRow
        icon="reader-outline"
        title="Community rules"
        description="Review the placeholder rules that reports and moderation will enforce."
        onPress={() => onOpenLegal("terms")}
      />
      <View style={styles.historyRow}>
        <Text style={styles.settingTitle}>Age gate</Text>
        <Text style={styles.subtle}>
          Production should require an age confirmation before account creation.
        </Text>
      </View>
      <ToggleRow
        enabled={safetySettings.autoHideReportedContent}
        label="Hide reported content"
        description="Locally hide reported items once backend moderation is connected."
        onPress={() => onToggleSafetySetting("autoHideReportedContent")}
      />
      <ToggleRow
        enabled={safetySettings.hideBlockedProfiles}
        label="Hide blocked profiles"
        description="Blocked users should disappear from feeds, search, and requests."
        onPress={() => onToggleSafetySetting("hideBlockedProfiles")}
      />
      <ToggleRow
        enabled={safetySettings.requireReportReason}
        label="Require report reason"
        description="Reports should include a category before they enter review."
        onPress={() => onToggleSafetySetting("requireReportReason")}
      />
      <ToggleRow
        enabled={safetySettings.contactEmailVisible}
        label="Show support contact"
        description="Keep contact information visible for review and safety issues."
        onPress={() => onToggleSafetySetting("contactEmailVisible")}
      />
      <View style={styles.historyRow}>
        <Text style={styles.settingTitle}>Crash reporting</Text>
        <Text style={styles.subtle}>
          The app has a local error boundary now. A remote crash service should be connected before a public beta.
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

function BetaAccessSettings({ betaAccess, onUpdateBetaAccess }) {
  const styles = useStyles();
  const [code, setCode] = useState(betaAccess.acceptedCode || "");
  const codeMatches = code.trim().toUpperCase() === BETA_INVITE_CODE;

  function saveCode() {
    if (!codeMatches) return;

    onUpdateBetaAccess({
      acceptedAt: new Date().toISOString(),
      acceptedCode: code.trim()
    });
  }

  return (
    <View style={styles.settingGroup}>
      <Text style={styles.profileLabel}>Beta access</Text>
      <ToggleRow
        enabled={betaAccess.requireInvite}
        label="Require invite code"
        description="When enabled, this device must unlock the prototype before entering the app."
        onPress={() =>
          onUpdateBetaAccess({
            requireInvite: !betaAccess.requireInvite
          })
        }
      />
      <View style={styles.historyRow}>
        <Text style={styles.settingTitle}>Invite code</Text>
        <Text style={styles.subtle}>Local prototype code: {BETA_INVITE_CODE}</Text>
        <TextInput
          autoCapitalize="characters"
          autoCorrect={false}
          onChangeText={setCode}
          placeholder={BETA_INVITE_CODE}
          placeholderTextColor="#8a867d"
          style={styles.profileInput}
          value={code}
        />
        <Pressable
          style={[styles.smallActionButton, !codeMatches && styles.disabledButton]}
          disabled={!codeMatches}
          onPress={saveCode}
        >
          <Text style={styles.smallActionText}>Save beta access</Text>
        </Pressable>
        <Text style={styles.subtle}>
          {betaAccess.acceptedAt
            ? `Unlocked on ${formatHistoryDate(betaAccess.acceptedAt)}.`
            : "Not unlocked yet."}
        </Text>
      </View>
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
        <Pressable style={styles.secondaryActionButton} onPress={() => onRunBugScenario("uploadFailure")}>
          <Text style={styles.secondaryActionText}>Upload failed</Text>
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

function PermissionRow({ description, icon, label, status, onPress }) {
  const styles = useStyles();
  const { isDarkMode } = useTheme();
  const iconColor = isDarkMode ? "#f8f7f2" : "#111";

  return (
    <Pressable style={styles.permissionRow} onPress={onPress}>
      <Ionicons name={icon} size={20} color={iconColor} />
      <View style={styles.settingCopy}>
        <Text style={styles.settingTitle}>{label}</Text>
        <Text style={styles.subtle}>{description}</Text>
        <Text style={styles.visibilityText}>{formatPermissionStatus(status)}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={iconColor} />
    </Pressable>
  );
}

function ActionRow({ description, icon, onPress, title }) {
  const styles = useStyles();
  const { isDarkMode } = useTheme();
  const iconColor = isDarkMode ? "#f8f7f2" : "#111";

  return (
    <Pressable style={styles.permissionRow} onPress={onPress}>
      <Ionicons name={icon} size={20} color={iconColor} />
      <View style={styles.settingCopy}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.subtle}>{description}</Text>
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
