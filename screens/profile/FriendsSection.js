import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { Avatar } from "../../components/Avatar";
import { useStyles, useTheme } from "../../theme";

export function FriendsSection({
  blockedProfiles,
  friendRequests,
  friendHandle,
  friends,
  onAcceptFriendRequest,
  onAddFriend,
  onBlockFriend,
  onCancelFriendRequest,
  onChangeFriendHandle,
  onDeclineFriendRequest,
  onOpenFriend,
  onRemoveFriend,
  onToggleCloseFriend,
  onUnblockProfile,
  outgoingFriendRequests,
  privacySettings
}) {
  const styles = useStyles();
  const { isDarkMode } = useTheme();
  const iconColor = isDarkMode ? "#f8f7f2" : "#111";
  const starColor = isDarkMode ? "#e8ff66" : "#111";
  const canAddFriend = privacySettings.allowFriendRequests && friendHandle.trim().length > 0;
  const [activeFriendActions, setActiveFriendActions] = useState(null);

  function toggleFriendActions(friendId) {
    setActiveFriendActions((activeId) => (activeId === friendId ? null : friendId));
  }

  function runFriendAction(action) {
    action();
    setActiveFriendActions(null);
  }

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

      <View style={styles.friendList}>
        <Text style={styles.profileLabel}>Request center</Text>
        {friendRequests.length === 0 && outgoingFriendRequests.length === 0 ? (
          <Text style={styles.subtle}>Incoming and sent friend requests will appear here.</Text>
        ) : null}
        {friendRequests.length > 0 ? (
          <>
            <Text style={styles.settingTitle}>Incoming</Text>
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
          </>
        ) : null}
        {outgoingFriendRequests.length > 0 ? (
          <>
            <Text style={styles.settingTitle}>Sent</Text>
            {outgoingFriendRequests.map((request) => (
              <View key={request.id} style={styles.friendRow}>
                <View style={styles.friendAvatar}>
                  <Text style={styles.friendAvatarText}>{request.handle.slice(1, 3).toUpperCase()}</Text>
                </View>
                <View style={styles.friendCopy}>
                  <Text style={styles.friendNameText}>{request.name}</Text>
                  <Text style={styles.subtle}>{request.handle} / {request.status}</Text>
                </View>
                <Pressable style={styles.friendActionButton} onPress={() => onCancelFriendRequest(request.id)}>
                  <Ionicons name="close" size={18} color={iconColor} />
                </Pressable>
              </View>
            ))}
          </>
        ) : null}
      </View>

      <View style={styles.friendList}>
        <Text style={styles.profileLabel}>Friends</Text>
        {friends.length === 0 ? <Text style={styles.subtle}>No friends yet.</Text> : null}
        {friends.map((friend) => (
          <View key={friend.id} style={styles.friendActionGroup}>
            <View style={styles.friendRow}>
              <Avatar name={friend.name} uri={friend.avatarUri} size="friend" />
              <View style={styles.friendCopy}>
                <Pressable onPress={() => onOpenFriend(friend)}>
                  <Text style={styles.friendNameText}>{friend.name}</Text>
                  <Text style={styles.subtle}>{friend.handle}</Text>
                </Pressable>
              </View>
              <View style={styles.friendRequestActions}>
                {friend.isCloseFriend ? <Ionicons name="star" size={17} color={starColor} /> : null}
                <Pressable
                  style={styles.friendActionButton}
                  onPress={() => toggleFriendActions(friend.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Manage ${friend.name}`}
                >
                  <Ionicons
                    name={activeFriendActions === friend.id ? "close" : "ellipsis-horizontal"}
                    size={18}
                    color={iconColor}
                  />
                </Pressable>
              </View>
            </View>

            {activeFriendActions === friend.id ? (
              <View style={styles.friendInlineActions}>
                <Pressable
                  style={styles.secondaryActionButton}
                  onPress={() => runFriendAction(() => onToggleCloseFriend(friend.id))}
                >
                  <Text style={styles.secondaryActionText}>
                    {friend.isCloseFriend ? "Remove star" : "Close friend"}
                  </Text>
                </Pressable>
                <Pressable
                  style={styles.secondaryActionButton}
                  onPress={() => runFriendAction(() => onRemoveFriend(friend.id))}
                >
                  <Text style={styles.secondaryActionText}>Remove</Text>
                </Pressable>
                <Pressable
                  style={styles.secondaryActionButton}
                  onPress={() => runFriendAction(() => onBlockFriend(friend))}
                >
                  <Text style={styles.secondaryActionText}>Block</Text>
                </Pressable>
              </View>
            ) : null}
          </View>
        ))}
      </View>

      <View style={styles.friendList}>
        <Text style={styles.profileLabel}>Blocked profiles</Text>
        {blockedProfiles.length === 0 ? (
          <Text style={styles.subtle}>Blocked profiles will be hidden from future requests and feeds.</Text>
        ) : (
          blockedProfiles.map((profile) => (
            <View key={profile.id} style={styles.friendRow}>
              <Avatar name={profile.name} uri={profile.avatarUri} size="friend" />
              <View style={styles.friendCopy}>
                <Text style={styles.friendNameText}>{profile.name}</Text>
                <Text style={styles.subtle}>{profile.handle}</Text>
              </View>
              <Pressable style={styles.friendActionButton} onPress={() => onUnblockProfile(profile.id)}>
                <Ionicons name="return-up-back-outline" size={18} color={iconColor} />
              </Pressable>
            </View>
          ))
        )}
      </View>
    </View>
  );
}
