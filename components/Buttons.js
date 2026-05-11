import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";
import { styles } from "../styles";

export function TabButton({ active, icon, label, onPress }) {
  return (
    <Pressable style={[styles.tabButton, active && styles.activeTab]} onPress={onPress}>
      <Ionicons name={icon} size={22} color={active ? "#111" : "#777"} />
      <Text style={[styles.tabText, active && styles.activeTabText]}>{label}</Text>
    </Pressable>
  );
}

export function IconButton({ active, disabled, icon, label, onPress }) {
  return (
    <Pressable
      style={[styles.iconButton, active && styles.recordingButton, disabled && styles.disabledButton]}
      disabled={disabled}
      onPress={onPress}
    >
      <Ionicons name={icon} size={22} color="#111" />
      <Text style={styles.iconLabel}>{label}</Text>
    </Pressable>
  );
}
