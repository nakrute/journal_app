import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, TextInput, View } from "react-native";
import { Avatar } from "../../components/Avatar";
import { useStyles, useTheme } from "../../theme";

export function FriendsSection({
  friendRequests,
  friendHandle,
  friends,
  onAcceptFriendRequest,
  onAddFriend,
  onBlockFriend,
  onChangeFriendHandle,
  onDeclineFriendRequest,
  onRemoveFriend,
  privacySettings
}) {
  const styles = useStyles();
  const { isDarkMode } = useTheme();
  const iconColor = isDarkMode ? "#f8f7f2" : "#111";
  const canAddFriend = privacySettings.allowFriendRequests && friendHandle.trim().length > 0;

  return (
    <View style={styles.profilePanel}>
      <View style={styles.friendAddRow}>
        <TextInput
          style={styles.friendAddInput}
          value={friendHandle}
          onChangeText={onChangeFriendHandle}
          placeholder="@friendhandle"
          placeholderTextColor="#8a867d"
          autoCapitalize="none"
        />
        <Pressable
          style={[styles.friendAddButton, !canAddFriend && styles.disabledButton]}
          onPress={onAddFriend}
          disabled={!canAddFriend}
        >
          <Ionicons name="person-add-outline" size={20} color="#111" />
        </Pressable>
      </View>
      {!privacySettings.allowFriendRequests ? (
        <Text style={styles.subtle}>Friend requests are disabled in Privacy settings.</Text>
      ) : null}

      {friendRequests.length > 0 ? (
        <View style={styles.friendList}>
          <Text style={styles.profileLabel}>Requests</Text>
          {friendRequests.map((request) => (
            <View key={request.id} style={styles.friendRow}>
              <Avatar name={request.name} uri={request.avatarUri} size="friend" />
              <View style={styles.friendCopy}>
                <Text style={styles.friendNameText}>{request.name}</Text>
                <Text style={styles.subtle}>{request.handle}</Text>
              </View>
              <View style={styles.friendRequestActions}>
                <Pressable style={styles.friendActionButton} onPress={() => onAcceptFriendRequest(request)}>
                  <Ionicons name="checkmark" size={18} color={iconColor} />
                </Pressable>
                <Pressable style={styles.friendActionButton} onPress={() => onDeclineFriendRequest(request.id)}>
                  <Ionicons name="close" size={18} color={iconColor} />
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      ) : null}

      <View style={styles.friendList}>
        <Text style={styles.profileLabel}>Friends</Text>
        {friends.map((friend) => (
          <View key={friend.id} style={styles.friendRow}>
            <Avatar name={friend.name} uri={friend.avatarUri} size="friend" />
            <View style={styles.friendCopy}>
              <Text style={styles.friendNameText}>{friend.name}</Text>
              <Text style={styles.subtle}>{friend.handle}</Text>
            </View>
            <View style={styles.friendRequestActions}>
              <Pressable style={styles.friendActionButton} onPress={() => onRemoveFriend(friend.id)}>
                <Ionicons name="person-remove-outline" size={18} color={iconColor} />
              </Pressable>
              <Pressable style={styles.friendActionButton} onPress={() => onBlockFriend(friend.id)}>
                <Ionicons name="ban-outline" size={18} color={iconColor} />
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
