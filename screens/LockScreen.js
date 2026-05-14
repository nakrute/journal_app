import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useStyles, useTheme } from "../theme";

export function LockScreen({ onUnlock, pin }) {
  const styles = useStyles();
  const { isDarkMode } = useTheme();
  const [attempt, setAttempt] = useState("");
  const [error, setError] = useState("");
  const iconColor = isDarkMode ? "#f8f7f2" : "#111";

  function submitPin() {
    if (attempt === pin) {
      setError("");
      setAttempt("");
      onUnlock();
      return;
    }

    setError("PIN did not match.");
  }

  return (
    <View style={styles.lockScreen}>
      <View style={styles.lockPanel}>
        <View style={styles.lockIcon}>
          <Ionicons name="lock-closed-outline" size={28} color={iconColor} />
        </View>
        <Text style={styles.onboardingTitle}>OutLoud locked</Text>
        <Text style={styles.onboardingBody}>Enter your local app PIN to continue.</Text>
        <TextInput
          style={styles.profileInput}
          value={attempt}
          onChangeText={setAttempt}
          placeholder="PIN"
          placeholderTextColor="#8a867d"
          keyboardType="number-pad"
          maxLength={8}
          secureTextEntry
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Pressable style={styles.publishButton} onPress={submitPin}>
          <Text style={styles.publishText}>Unlock</Text>
        </Pressable>
      </View>
    </View>
  );
}
