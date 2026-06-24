import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Avatar } from "../components/Avatar";
import { useStyles, useTheme } from "../theme";
import { FriendsSection } from "./profile/FriendsSection";
import { SettingsSection } from "./profile/SettingsSection";
import { formatHandle } from "./profile/profileUtils";

export function ProfileScreen({
  activityLog,
  betaAccess,
  blockedProfiles,
  friendRequests,
  friends,
  isDarkMode,
  notificationSettings,
  onAcceptFriendRequest,
  onAddFriend,
  onBlockFriend,
  onClearActivityLog,
  onClearLocalPosts,
  onChangeProfile,
  onChangeReminderTime,
  onCancelFriendRequest,
  onClose,
  onContactSupport,
  onDeclineFriendRequest,
  onDeleteLocalAccount,
  onExportLocalData,
  onOpenFriend,
  onOpenLegal,
  onPickProfilePhoto,
  onRequestCameraPermission,
  onRequestMicrophonePermission,
  onRemoveFriend,
  onResetOnboarding,
  onRestoreDemoData,
  onRunBugScenario,
  onSendTestNotification,
  onSignOut,
  onSimulateFriendPost,
  onToggleNotificationPreference,
  onTogglePrivacySetting,
  onToggleSafetySetting,
  onToggleDailyReminder,
  onToggleDarkMode,
  onToggleCloseFriend,
  onUnblockProfile,
  onUpdateBetaAccess,
  onUpdateQuietHours,
  onUpdatePrivacySetting,
  permissionStatuses,
  outgoingFriendRequests,
  profile,
  privacySettings,
  promptHistory,
  reports,
  safetySettings
}) {
  const styles = useStyles();
  const [activeSection, setActiveSection] = useState("friends");
  const [friendHandle, setFriendHandle] = useState("");

  function updateProfile(field, value) {
    onChangeProfile((current) => ({
      ...current,
      [field]: field === "handle" ? formatHandle(value) : value
    }));
  }

  function submitFriendHandle() {
    onAddFriend(friendHandle);
    setFriendHandle("");
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.profileHeader}>
        <Avatar name={profile.name} uri={profile.avatarUri} />
        <View style={styles.profileHeaderCopy}>
          <Text style={styles.profileName}>{profile.name || "Your profile"}</Text>
          <Text style={styles.profileHandle}>{profile.handle || "@handle"}</Text>
        </View>
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={22} color="#111" />
        </Pressable>
      </View>

      <View style={styles.profileSections}>
        <SectionButton
          active={activeSection === "friends"}
          icon="people-outline"
          label="Friends"
          onPress={() => setActiveSection("friends")}
        />
        <SectionButton
          active={activeSection === "settings"}
          icon="settings-outline"
          label="Settings"
          onPress={() => setActiveSection("settings")}
        />
      </View>

      {activeSection === "friends" ? (
        <FriendsSection
          friendRequests={friendRequests}
          friendHandle={friendHandle}
          friends={friends}
          onAcceptFriendRequest={onAcceptFriendRequest}
          onAddFriend={submitFriendHandle}
          onBlockFriend={onBlockFriend}
          onChangeFriendHandle={setFriendHandle}
          onCancelFriendRequest={onCancelFriendRequest}
          onDeclineFriendRequest={onDeclineFriendRequest}
          onOpenFriend={onOpenFriend}
          onRemoveFriend={onRemoveFriend}
          onToggleCloseFriend={onToggleCloseFriend}
          onUnblockProfile={onUnblockProfile}
          outgoingFriendRequests={outgoingFriendRequests}
          blockedProfiles={blockedProfiles}
          privacySettings={privacySettings}
        />
      ) : (
        <SettingsSection
          activityLog={activityLog}
          betaAccess={betaAccess}
          isDarkMode={isDarkMode}
          notificationSettings={notificationSettings}
          onClearActivityLog={onClearActivityLog}
          onClearLocalPosts={onClearLocalPosts}
          onChangeReminderTime={onChangeReminderTime}
          onContactSupport={onContactSupport}
          onDeleteLocalAccount={onDeleteLocalAccount}
          onExportLocalData={onExportLocalData}
          onRequestCameraPermission={onRequestCameraPermission}
          onRequestMicrophonePermission={onRequestMicrophonePermission}
          onPickProfilePhoto={onPickProfilePhoto}
          onResetOnboarding={onResetOnboarding}
          onRestoreDemoData={onRestoreDemoData}
          onRunBugScenario={onRunBugScenario}
          onSendTestNotification={onSendTestNotification}
          onSignOut={onSignOut}
          onSimulateFriendPost={onSimulateFriendPost}
          onTogglePrivacySetting={onTogglePrivacySetting}
          onToggleSafetySetting={onToggleSafetySetting}
          onToggleDailyReminder={onToggleDailyReminder}
          onToggleDarkMode={onToggleDarkMode}
          onToggleNotificationPreference={onToggleNotificationPreference}
          onOpenLegal={onOpenLegal}
          onUpdateBetaAccess={onUpdateBetaAccess}
          onUpdateQuietHours={onUpdateQuietHours}
          onUpdatePrivacySetting={onUpdatePrivacySetting}
          permissionStatuses={permissionStatuses}
          profile={profile}
          privacySettings={privacySettings}
          promptHistory={promptHistory}
          reports={reports}
          safetySettings={safetySettings}
          onUpdateProfile={updateProfile}
        />
      )}
    </ScrollView>
  );
}

function SectionButton({ active, icon, label, onPress }) {
  const styles = useStyles();
  const { isDarkMode } = useTheme();

  return (
    <Pressable style={[styles.sectionButton, active && styles.activeSectionButton]} onPress={onPress}>
      <Ionicons name={icon} size={19} color={active ? "#111" : isDarkMode ? "#aaa59a" : "#67645e"} />
      <Text style={[styles.sectionButtonText, active && styles.activeSectionButtonText]}>{label}</Text>
    </Pressable>
  );
}
