import { Ionicons } from "@expo/vector-icons";
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
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
import { VOICE_MAX_SECONDS } from "../constants/app";

const RootStack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

export function AppNavigator({ context }) {
  const styles = useStyles();
  const { isDarkMode } = useTheme();
  const navigationTheme = {
    ...(isDarkMode ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDarkMode ? DarkTheme.colors : DefaultTheme.colors),
      background: isDarkMode ? "#10110f" : "#f8f7f2",
      card: isDarkMode ? "#10110f" : "#f8f7f2",
      border: isDarkMode ? "#30322d" : "#dfdcd2",
      text: isDarkMode ? "#f8f7f2" : "#111"
    }
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <RootStack.Navigator screenOptions={{ headerShown: false, contentStyle: styles.screen }}>
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
  const { isDarkMode } = useTheme();

  return (
    <Tabs.Navigator
      screenOptions={({ route, navigation }) => ({
        header: () => (
          <AppHeader
            isProfile={route.name === "ProfileTab"}
            onMenuPress={() =>
              route.name === "ProfileTab"
                ? navigation.navigate("TodayTab")
                : navigation.navigate("ProfileTab")
            }
          />
        ),
        sceneContainerStyle: styles.screen,
        sceneStyle: styles.screen,
        tabBarActiveBackgroundColor: isDarkMode ? "#2a2c27" : "#e8ff66",
        tabBarActiveTintColor: isDarkMode ? "#e8ff66" : "#111",
        tabBarIcon: ({ focused, color }) => <TabIcon color={color} focused={focused} routeName={route.name} />,
        tabBarInactiveTintColor: isDarkMode ? "#aaa59a" : "#777",
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
      onRetryPostUpload={context.retryPostUpload}
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
      onRetryPostUpload={context.retryPostUpload}
    />
  );
}

function ProfileRoute({ context, navigation }) {
  return (
    <ProfileScreen
      betaAccess={context.betaAccess}
      blockedProfiles={context.blockedProfiles}
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
      onCancelFriendRequest={context.cancelFriendRequest}
      onClose={() => navigation.navigate("TodayTab")}
      onDeclineFriendRequest={context.declineFriendRequest}
      onDeleteLocalAccount={context.deleteLocalAccount}
      onExportLocalData={context.exportLocalData}
      onOpenFriend={(friend) => navigation.getParent()?.navigate("FriendProfile", { friend })}
      onOpenLegal={context.openLegalPlaceholder}
      onPickProfilePhoto={context.pickProfilePhoto}
      onRequestCameraPermission={context.requestCameraPermission}
      onRequestMicrophonePermission={context.requestMicrophonePermission}
      onRemoveFriend={context.removeFriend}
      onResetOnboarding={context.resetOnboarding}
      onRestoreDemoData={context.restoreDemoData}
      onRunBugScenario={context.runBugScenario}
      onSendTestNotification={context.handleSendTestNotification}
      onSignOut={context.signOutDummyProfile}
      onSimulateFriendPost={context.handleSimulateNewFriendPost}
      onContactSupport={context.contactSupportPlaceholder}
      onToggleNotificationPreference={context.toggleNotificationPreference}
      onTogglePrivacySetting={context.togglePrivacySetting}
      onToggleSafetySetting={context.toggleSafetySetting}
      onToggleDarkMode={() => context.setIsDarkMode((value) => !value)}
      onToggleCloseFriend={context.toggleFriendCloseStatus}
      onToggleDailyReminder={context.toggleDailyReminder}
      onUpdateQuietHours={context.updateQuietHours}
      onUpdateBetaAccess={context.updateBetaAccess}
      onUpdatePrivacySetting={context.updatePrivacySetting}
      onUnblockProfile={context.unblockProfile}
      permissionStatuses={context.permissionStatuses}
      activityLog={context.activityLog}
      outgoingFriendRequests={context.outgoingFriendRequests}
      profile={context.profile}
      privacySettings={context.privacySettings}
      promptHistory={context.promptHistory}
      reports={context.reports}
      safetySettings={context.safetySettings}
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

function AppHeader({ isProfile, onMenuPress }) {
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
