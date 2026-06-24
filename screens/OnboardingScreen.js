import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { Avatar } from "../components/Avatar";
import { BrandMark } from "../components/BrandMark";
import { useStyles, useTheme } from "../theme";
import { validateProfile } from "../utils/validation";
import { formatHandle } from "./profile/profileUtils";

const onboardingItems = [
  ["camera-outline", "Candid daily posts", "Capture the photo, caption, and voice note while the moment is still fresh."],
  ["mic-outline", "Voice-first sharing", "Send a short note with every check-in so friends hear the real context."],
  ["shield-checkmark-outline", "Safety basics", "Private defaults, reporting, blocking, and local account controls are part of the prototype."]
];

export function OnboardingScreen({
  notificationSettings,
  onChangeProfile,
  onComplete,
  onPickProfilePhoto,
  onRequestCameraPermission,
  onRequestMicrophonePermission,
  onToggleDailyReminder,
  profile
}) {
  const styles = useStyles();
  const { isDarkMode } = useTheme();
  const iconColor = isDarkMode ? "#f8f7f2" : "#111";
  const [step, setStep] = useState("intro");
  const profileError = validateProfile(profile);
  const canFinish = !profileError;

  function updateProfile(field, value) {
    onChangeProfile((current) => ({
      ...current,
      [field]: field === "handle" ? formatHandle(value) : value
    }));
  }

  if (step === "intro") {
    return (
      <View style={[styles.screen, styles.onboarding]}>
        <View style={styles.onboardingHero}>
          <BrandMark />
          <Text style={styles.onboardingKicker}>OutLoud</Text>
          <Text style={styles.onboardingTitle}>Real photos. Real voices.</Text>
          <Text style={styles.onboardingBody}>
            Daily check-ins built around what your friends can hear, not just what they can see.
          </Text>
        </View>

        <View style={styles.onboardingList}>
          {onboardingItems.map(([icon, title, body]) => (
            <View key={title} style={styles.onboardingItem}>
              <View style={styles.onboardingIcon}>
                <Ionicons name={icon} size={22} color={iconColor} />
              </View>
              <View style={styles.onboardingCopy}>
                <Text style={styles.settingTitle}>{title}</Text>
                <Text style={styles.subtle}>{body}</Text>
              </View>
            </View>
          ))}
        </View>

        <Pressable style={styles.publishButton} onPress={() => setStep("setup")}>
          <Text style={styles.publishText}>Set Up Profile</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoider}
    >
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.profilePanel}>
          <Text style={styles.profileLabel}>Profile</Text>
          <View style={styles.setupAvatarRow}>
            <Avatar name={profile.name} uri={profile.avatarUri} />
            <View style={styles.settingCopy}>
              <Text style={styles.settingTitle}>Choose how friends see you</Text>
              <Text style={styles.subtle}>You can change all of this later in Settings.</Text>
            </View>
          </View>
          <Pressable style={styles.secondaryActionButton} onPress={onPickProfilePhoto}>
            <Text style={styles.secondaryActionText}>Pick profile photo</Text>
          </Pressable>
          <SetupInput label="Display name" value={profile.name} onChangeText={(value) => updateProfile("name", value)} />
          <SetupInput
            label="Handle"
            value={profile.handle}
            onChangeText={(value) => updateProfile("handle", value)}
            autoCapitalize="none"
          />
          <SetupInput
            label="Bio"
            value={profile.bio}
            onChangeText={(value) => updateProfile("bio", value)}
            multiline
          />
          {profileError ? <Text style={styles.errorText}>{profileError}</Text> : null}
        </View>

        <View style={styles.profilePanel}>
          <Text style={styles.profileLabel}>Permissions</Text>
          <Pressable style={styles.permissionRow} onPress={onRequestCameraPermission}>
            <Ionicons name="camera-outline" size={20} color={iconColor} />
            <View style={styles.settingCopy}>
              <Text style={styles.settingTitle}>Camera</Text>
              <Text style={styles.subtle}>Needed for the daily photo.</Text>
            </View>
          </Pressable>
          <Pressable style={styles.permissionRow} onPress={onRequestMicrophonePermission}>
            <Ionicons name="mic-outline" size={20} color={iconColor} />
            <View style={styles.settingCopy}>
              <Text style={styles.settingTitle}>Microphone</Text>
              <Text style={styles.subtle}>Needed for voice notes.</Text>
            </View>
          </Pressable>
          <Pressable style={styles.permissionRow} onPress={onToggleDailyReminder}>
            <Ionicons name="notifications-outline" size={20} color={iconColor} />
            <View style={styles.settingCopy}>
              <Text style={styles.settingTitle}>Daily reminders</Text>
              <Text style={styles.subtle}>
                {notificationSettings.enabled ? "Reminder is on." : "Turn on local daily reminders."}
              </Text>
            </View>
          </Pressable>
        </View>

        <Pressable
          style={[styles.publishButton, !canFinish && styles.disabledButton]}
          onPress={onComplete}
          disabled={!canFinish}
        >
          <Text style={styles.publishText}>Start Checking In</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function SetupInput({ label, ...props }) {
  const styles = useStyles();

  return (
    <View style={styles.profileField}>
      <Text style={styles.profileLabel}>{label}</Text>
      <TextInput
        style={[styles.profileInput, props.multiline && styles.profileBioInput]}
        placeholderTextColor="#8a867d"
        textAlignVertical={props.multiline ? "top" : "center"}
        {...props}
      />
    </View>
  );
}
