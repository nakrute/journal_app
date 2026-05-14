import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";
import { useStyles, useTheme } from "../theme";

export function TabButton({ active, icon, label, onPress }) {
  const styles = useStyles();

  return (
    <Pressable
      style={[styles.tabButton, active && styles.activeTab]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label} tab`}
      accessibilityState={{ selected: active }}
    >
      <Ionicons name={icon} size={22} color={active ? "#111" : "#777"} />
      <Text style={[styles.tabText, active && styles.activeTabText]}>{label}</Text>
    </Pressable>
  );
}

export function IconButton({ active, disabled, icon, label, onPress }) {
  const styles = useStyles();
  const { isDarkMode } = useTheme();

  return (
    <Pressable
      style={[styles.iconButton, active && styles.recordingButton, disabled && styles.disabledButton]}
      disabled={disabled}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled, selected: !!active }}
    >
      <Ionicons name={icon} size={22} color={isDarkMode ? "#f8f7f2" : "#111"} />
      <Text style={styles.iconLabel}>{label}</Text>
    </Pressable>
  );
}
