import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Pressable, Text, View } from "react-native";
import { FeedScreen } from "../screens/FeedScreen";
import { FriendProfileScreen } from "../screens/FriendProfileScreen";
import { PostDetailScreen } from "../screens/PostDetailScreen";
import { PostsScreen } from "../screens/PostsScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { TodayScreen } from "../screens/TodayScreen";
import { useStyles, useTheme } from "../theme";
import { formatSeconds } from "../utils/time";
import { VOICE_MAX_SECONDS } from "../constants/app";

const RootStack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

export function AppNavigator({ context }) {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="MainTabs">
          {() => <MainTabsNavigator context={context} />}
        </RootStack.Screen>
        <RootStack.Screen name="PostDetail">
          {(props) => <PostDetailRoute {...props} context={context} />}
        </RootStack.Screen>
        <RootStack.Screen name="FriendProfile">
          {(props) => <FriendProfileRoute {...props} context={context} />}
        </RootStack.Screen>
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

function MainTabsNavigator({ context }) {
  const styles = useStyles();

  return (
    <Tabs.Navigator
      screenOptions={({ route, navigation }) => ({
        header: () => (
          <AppHeader
            isProfile={route.name === "ProfileTab"}
            isLate={context.isLate}
            onMenuPress={() =>
              route.name === "ProfileTab"
                ? navigation.navigate("TodayTab")
                : navigation.navigate("ProfileTab")
            }
            secondsRemaining={context.secondsRemaining}
          />
        ),
        tabBarActiveTintColor: "#111",
        tabBarIcon: ({ focused, color }) => <TabIcon color={color} focused={focused} routeName={route.name} />,
        tabBarInactiveTintColor: "#777",
        tabBarItemStyle: styles.navTabItem,
        tabBarLabelStyle: styles.navTabLabel,
        tabBarStyle: styles.navTabs
      })}
    >
      <Tabs.Screen name="TodayTab" options={{ title: "Today" }}>
        {({ navigation }) => <TodayRoute context={context} navigation={navigation} />}
      </Tabs.Screen>
      <Tabs.Screen name="FeedTab" options={{ title: "Friends" }}>
        {({ navigation }) => <FeedRoute context={context} navigation={navigation} />}
      </Tabs.Screen>
      <Tabs.Screen name="PostsTab" options={{ title: "Posts" }}>
        {({ navigation }) => <PostsRoute context={context} navigation={navigation} />}
      </Tabs.Screen>
      <Tabs.Screen name="ProfileTab" options={{ title: "Profile" }}>
        {({ navigation }) => <ProfileRoute context={context} navigation={navigation} />}
      </Tabs.Screen>
    </Tabs.Navigator>
  );
}

function TodayRoute({ context, navigation }) {
  return (
    <TodayScreen
      addToPosts={context.addToPosts}
      cameraFacing={context.cameraFacing}
      cameraPermission={context.cameraPermission}
      cameraRef={context.cameraRef}
      capturedPhoto={context.capturedPhoto}
      onFlip={() => context.setCameraFacing((value) => (value === "back" ? "front" : "back"))}
      onPlayVoice={() => context.toggleVoicePlayback(context.voiceUri)}
      onPublish={async () => {
        const didPublish = await context.publishMoment();
        if (didPublish) navigation.navigate("FeedTab");
      }}
      onRecord={context.recording ? context.stopRecording : context.startRecording}
      onDiscardDraft={context.discardDraft}
      onRemovePhoto={context.removeDraftPhoto}
      onRemoveVoice={context.removeDraftVoice}
      onRetake={context.removeDraftPhoto}
      onTakePhoto={context.takePhoto}
      onToggleAddToPosts={() => context.setAddToPosts((value) => !value)}
      caption={context.caption}
      isLate={context.isLate}
      onChangeCaption={context.setCaption}
      onChangeVisibility={context.setVisibility}
      posted={!!context.publishedPost}
      playbackStatus={context.playbackStatus}
      playbackUri={context.playbackUri}
      prompt={context.prompt}
      recording={context.recording}
      recordingSeconds={context.recordingSeconds}
      recordingStatus={context.recordingStatus}
      requestCameraPermission={context.requestCameraPermission}
      visibility={context.visibility}
      voiceMaxSeconds={VOICE_MAX_SECONDS}
      voiceUri={context.voiceUri}
    />
  );
}

function FeedRoute({ context, navigation }) {
  return (
    <FeedScreen
      friends={context.friends}
      publishedPost={context.publishedPost}
      profile={context.profile}
      playbackStatus={context.playbackStatus}
      onPlayVoice={context.toggleVoicePlayback}
      playbackUri={context.playbackUri}
      onEditPostCaption={context.updatePostCaption}
      onDeletePost={context.deletePost}
      onOpenPost={(item) => navigation.getParent()?.navigate("PostDetail", { item })}
      onReportPost={context.reportItem}
    />
  );
}

function PostsRoute({ context, navigation }) {
  return (
    <PostsScreen
      posts={context.generalPosts}
      profile={context.profile}
      playbackStatus={context.playbackStatus}
      onPlayVoice={context.toggleVoicePlayback}
      playbackUri={context.playbackUri}
      onEditPostCaption={context.updatePostCaption}
      onDeletePost={context.deletePost}
      onOpenPost={(item) => navigation.getParent()?.navigate("PostDetail", { item })}
      onReportPost={context.reportItem}
    />
  );
}

function ProfileRoute({ context, navigation }) {
  return (
    <ProfileScreen
      friendRequests={context.friendRequests}
      friends={context.friends}
      isDarkMode={context.isDarkMode}
      notificationSettings={context.notificationSettings}
      onAcceptFriendRequest={context.acceptFriendRequest}
      onAddFriend={context.addFriend}
      onBlockFriend={context.blockFriend}
      onClearLocalPosts={context.clearLocalPosts}
      onClearActivityLog={context.clearActivityLog}
      onChangeReminderTime={context.changeReminderTime}
      onChangeProfile={context.setProfile}
      onClose={() => navigation.navigate("TodayTab")}
      onDeclineFriendRequest={context.declineFriendRequest}
      onOpenFriend={(friend) => navigation.getParent()?.navigate("FriendProfile", { friend })}
      onPickProfilePhoto={context.pickProfilePhoto}
      onRequestCameraPermission={context.requestCameraPermission}
      onRequestMicrophonePermission={context.requestMicrophonePermission}
      onRemoveFriend={context.removeFriend}
      onResetOnboarding={context.resetOnboarding}
      onRestoreDemoData={context.restoreDemoData}
      onRunBugScenario={context.runBugScenario}
      onSendTestNotification={context.handleSendTestNotification}
      onSimulateFriendPost={context.handleSimulateNewFriendPost}
      onToggleNotificationPreference={context.toggleNotificationPreference}
      onTogglePrivacySetting={context.togglePrivacySetting}
      onToggleDarkMode={() => context.setIsDarkMode((value) => !value)}
      onToggleCloseFriend={context.toggleFriendCloseStatus}
      onToggleDailyReminder={context.toggleDailyReminder}
      onUpdateSecuritySettings={context.updateSecuritySettingsAndUnlock}
      onUpdateQuietHours={context.updateQuietHours}
      permissionStatuses={context.permissionStatuses}
      activityLog={context.activityLog}
      profile={context.profile}
      privacySettings={context.privacySettings}
      promptHistory={context.promptHistory}
      reports={context.reports}
      safetySettings={context.safetySettings}
      securitySettings={context.securitySettings}
    />
  );
}

function PostDetailRoute({ context, navigation, route }) {
  const item = route.params.item;

  return (
    <PostDetailScreen
      item={item}
      onBack={navigation.goBack}
      onDelete={async (postId) => {
        await context.deletePost(postId);
        navigation.goBack();
      }}
      onEditCaption={(postId, nextCaption) =>
        context.updatePostCaption(postId, nextCaption, (updater) => {
          navigation.setParams({ item: updater(item) });
        })
      }
      onPlayVoice={context.toggleVoicePlayback}
      onReport={context.reportItem}
      onShare={context.sharePost}
      playbackStatus={context.playbackStatus}
      playbackUri={context.playbackUri}
    />
  );
}

function FriendProfileRoute({ context, navigation, route }) {
  const friend = route.params.friend;

  return (
    <FriendProfileScreen
      friend={friend}
      onBack={navigation.goBack}
      onBlock={(friendId) => {
        context.blockFriend(friendId);
        navigation.goBack();
      }}
      onRemove={(friendId) => {
        context.removeFriend(friendId);
        navigation.goBack();
      }}
      onReport={context.reportItem}
    />
  );
}

function AppHeader({ isLate, isProfile, onMenuPress, secondsRemaining }) {
  const styles = useStyles();
  const { isDarkMode } = useTheme();

  return (
    <View style={styles.header}>
      <View style={styles.headerIdentity}>
        <Pressable style={styles.menuButton} onPress={onMenuPress}>
          <Ionicons
            name={isProfile ? "close-outline" : "menu-outline"}
            size={25}
            color={isDarkMode ? "#f8f7f2" : "#111"}
          />
        </Pressable>
        <View>
          <Text style={styles.logo}>OutLoud</Text>
          <Text style={styles.subtle}>Daily candid photo + voice notes</Text>
        </View>
      </View>
      <View style={[styles.timerPill, isLate && styles.lateTimerPill]}>
        <Ionicons name={isLate ? "alert-circle-outline" : "timer-outline"} size={16} color="#111" />
        <Text style={styles.timerText}>{isLate ? "Late" : formatSeconds(secondsRemaining)}</Text>
      </View>
    </View>
  );
}

function TabIcon({ color, focused, routeName }) {
  const icons = {
    TodayTab: focused ? "radio" : "radio-outline",
    FeedTab: focused ? "people" : "people-outline",
    PostsTab: focused ? "albums" : "albums-outline",
    ProfileTab: focused ? "person" : "person-outline"
  };

  return <Ionicons name={icons[routeName]} size={22} color={color} />;
}
