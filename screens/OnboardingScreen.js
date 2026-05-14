import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { useStyles, useTheme } from "../theme";

const onboardingItems = [
  {
    icon: "camera-outline",
    title: "Candid daily posts",
    body: "Capture the photo, caption, and voice note while the moment is still fresh."
  },
  {
    icon: "mic-outline",
    title: "Voice-first sharing",
    body: "Send a short note with every check-in so friends hear the real context."
  },
  {
    icon: "notifications-outline",
    title: "Daily reminders",
    body: "Local reminders are ready now, with production push waiting for a dev build."
  }
];

export function OnboardingScreen({ onComplete }) {
  const styles = useStyles();
  const { isDarkMode } = useTheme();
  const iconColor = isDarkMode ? "#f8f7f2" : "#111";

  return (
    <View style={styles.onboarding}>
      <View style={styles.onboardingHero}>
        <Text style={styles.onboardingKicker}>OutLoud</Text>
        <Text style={styles.onboardingTitle}>Real photos. Real voices.</Text>
        <Text style={styles.onboardingBody}>
          A local prototype for daily check-ins, friend posts, voice notes, and profile settings.
        </Text>
      </View>

      <View style={styles.onboardingList}>
        {onboardingItems.map((item) => (
          <View key={item.title} style={styles.onboardingItem}>
            <View style={styles.onboardingIcon}>
              <Ionicons name={item.icon} size={22} color={iconColor} />
            </View>
            <View style={styles.onboardingCopy}>
              <Text style={styles.settingTitle}>{item.title}</Text>
              <Text style={styles.subtle}>{item.body}</Text>
            </View>
          </View>
        ))}
      </View>

      <Pressable style={styles.publishButton} onPress={onComplete}>
        <Text style={styles.publishText}>Start Checking In</Text>
      </Pressable>
    </View>
  );
}
