import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { useStyles } from "../theme";

export function BrandMark({ compact = false }) {
  const styles = useStyles();

  return (
    <View style={[styles.brandMark, compact && styles.compactBrandMark]}>
      <Ionicons name="mic-outline" size={compact ? 18 : 24} color="#111" />
      <Text style={[styles.brandMarkText, compact && styles.compactBrandMarkText]}>OL</Text>
    </View>
  );
}
