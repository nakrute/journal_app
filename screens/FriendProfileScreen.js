import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { Avatar } from "../components/Avatar";
import { useStyles, useTheme } from "../theme";

export function FriendProfileScreen({
  friend,
  onBack,
  onBlock,
  onRemove,
  onReport
}) {
  const styles = useStyles();
  const { isDarkMode } = useTheme();
  const iconColor = isDarkMode ? "#f8f7f2" : "#111";

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.detailHeader}>
        <Pressable style={styles.postIconButton} onPress={onBack}>
          <Ionicons name="chevron-back" size={20} color={iconColor} />
        </Pressable>
        <Text style={styles.friendName}>Profile</Text>
      </View>

      <View style={styles.profileHeader}>
        <Avatar name={friend.name} uri={friend.avatarUri} />
        <View style={styles.profileHeaderCopy}>
          <Text style={styles.profileName}>{friend.name}</Text>
          <Text style={styles.profileHandle}>{friend.handle}</Text>
        </View>
      </View>

      <View style={styles.profilePanel}>
        <Text style={styles.profileLabel}>About</Text>
        <Text style={styles.visibilityText}>{friend.isCloseFriend ? "Close friend" : "Friend"}</Text>
        <Text style={styles.caption}>{friend.bio || "OutLoud friend. Recent check-ins and voice notes will live here."}</Text>
        {friend.photo ? <Image source={{ uri: friend.photo }} style={styles.detailImage} /> : null}
        {friend.caption ? <Text style={styles.caption}>{friend.caption}</Text> : null}
      </View>

      <View style={styles.profilePanel}>
        <Text style={styles.profileLabel}>Friend controls</Text>
        <Pressable style={styles.secondaryActionButton} onPress={() => onReport(friend)}>
          <Text style={styles.secondaryActionText}>Report profile</Text>
        </Pressable>
        <Pressable style={styles.secondaryActionButton} onPress={() => onRemove(friend.id)}>
          <Text style={styles.secondaryActionText}>Remove friend</Text>
        </Pressable>
        <Pressable style={styles.destructiveButton} onPress={() => onBlock(friend.id)}>
          <Ionicons name="ban-outline" size={18} color="#111" />
          <Text style={styles.destructiveButtonText}>Block profile</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
