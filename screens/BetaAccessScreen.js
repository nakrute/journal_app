import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { BETA_INVITE_CODE } from "../constants/app";
import { useStyles, useTheme } from "../theme";

export function BetaAccessScreen({ onSubmitCode }) {
  const styles = useStyles();
  const { isDarkMode } = useTheme();
  const [code, setCode] = useState("");
  const iconColor = isDarkMode ? "#f8f7f2" : "#111";

  return (
    <View style={styles.lockScreen}>
      <View style={styles.lockPanel}>
        <View style={styles.lockIcon}>
          <Ionicons name="key-outline" size={28} color={iconColor} />
        </View>
        <Text style={styles.onboardingTitle}>Beta access</Text>
        <Text style={styles.onboardingBody}>
          OutLoud is in private beta mode. Enter your invite code to continue.
        </Text>
        <TextInput
          autoCapitalize="characters"
          autoCorrect={false}
          onChangeText={setCode}
          placeholder={BETA_INVITE_CODE}
          placeholderTextColor="#8a867d"
          style={styles.profileInput}
          value={code}
        />
        <Pressable style={styles.publishButton} onPress={() => onSubmitCode(code)}>
          <Text style={styles.publishText}>Unlock Beta</Text>
        </Pressable>
      </View>
    </View>
  );
}
