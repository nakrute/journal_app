import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: "#f8f7f2"
  },
  keyboardAvoider: {
    flex: 1
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 10
  },
  headerIdentity: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 12,
    paddingRight: 12
  },
  menuButton: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#dfdcd2",
    borderRadius: 8,
    borderWidth: 1,
    height: 42,
    justifyContent: "center",
    width: 42
  },
  logo: {
    color: "#111",
    fontSize: 26,
    fontWeight: "800"
  },
  subtle: {
    color: "#67645e",
    fontSize: 13
  },
  timerPill: {
    alignItems: "center",
    backgroundColor: "#e8ff66",
    borderRadius: 999,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  lateTimerPill: {
    backgroundColor: "#ffb8a5"
  },
  timerText: {
    color: "#111",
    fontSize: 13,
    fontWeight: "800"
  },
  content: {
    padding: 20,
    paddingBottom: 40
  },
  onboarding: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
    paddingBottom: 34
  },
  onboardingHero: {
    backgroundColor: "#111",
    borderRadius: 8,
    gap: 12,
    marginTop: 18,
    padding: 22
  },
  onboardingKicker: {
    color: "#e8ff66",
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  onboardingTitle: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 40
  },
  onboardingBody: {
    color: "#e8e3d7",
    fontSize: 15,
    lineHeight: 22
  },
  brandMark: {
    alignItems: "center",
    backgroundColor: "#e8ff66",
    borderRadius: 999,
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: 14,
    alignSelf: "flex-start"
  },
  compactBrandMark: {
    minHeight: 36,
    paddingHorizontal: 10
  },
  brandMarkText: {
    color: "#111",
    fontSize: 18,
    fontWeight: "900"
  },
  compactBrandMarkText: {
    fontSize: 13
  },
  onboardingList: {
    gap: 12
  },
  onboardingItem: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#dfdcd2",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    padding: 14
  },
  onboardingIcon: {
    alignItems: "center",
    backgroundColor: "#f0eee7",
    borderRadius: 999,
    height: 42,
    justifyContent: "center",
    width: 42
  },
  onboardingCopy: {
    flex: 1
  },
  lockScreen: {
    flex: 1,
    justifyContent: "center",
    padding: 20
  },
  lockPanel: {
    backgroundColor: "#111",
    borderRadius: 8,
    gap: 14,
    padding: 22
  },
  lockIcon: {
    alignItems: "center",
    backgroundColor: "#e8ff66",
    borderRadius: 999,
    height: 54,
    justifyContent: "center",
    width: 54
  },
  errorText: {
    color: "#ff6d4d",
    fontSize: 13,
    fontWeight: "800"
  },
  promptBand: {
    backgroundColor: "#111",
    borderRadius: 8,
    padding: 18
  },
  promptLabel: {
    color: "#e8ff66",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 8,
    textTransform: "uppercase"
  },
  prompt: {
    color: "#fff",
    fontSize: 23,
    fontWeight: "800",
    lineHeight: 29
  },
  cameraFrame: {
    aspectRatio: 3 / 4,
    backgroundColor: "#dedbd0",
    borderRadius: 8,
    marginTop: 18,
    overflow: "hidden"
  },
  cameraPreview: {
    height: "100%",
    width: "100%"
  },
  permissionPanel: {
    alignItems: "center",
    flex: 1,
    gap: 12,
    justifyContent: "center",
    padding: 24
  },
  permissionTitle: {
    color: "#111",
    fontSize: 18,
    fontWeight: "800"
  },
  darkButton: {
    backgroundColor: "#111",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 11
  },
  darkButtonText: {
    color: "#fff",
    fontWeight: "800"
  },
  actionRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18
  },
  composerTools: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 14
  },
  iconButton: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#dfdcd2",
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
    height: 68,
    justifyContent: "center",
    width: 86
  },
  recordingButton: {
    backgroundColor: "#ffb8a5",
    borderColor: "#111"
  },
  iconLabel: {
    color: "#111",
    fontSize: 12,
    fontWeight: "700"
  },
  captureButton: {
    alignItems: "center",
    backgroundColor: "#111",
    borderRadius: 999,
    height: 74,
    justifyContent: "center",
    width: 74
  },
  voicePanel: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#dfdcd2",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
    padding: 16
  },
  voiceInfo: {
    flex: 1,
    paddingRight: 14
  },
  panelTitle: {
    color: "#111",
    fontSize: 17,
    fontWeight: "800"
  },
  captionPanel: {
    backgroundColor: "#fff",
    borderColor: "#dfdcd2",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 18,
    padding: 16
  },
  captionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10
  },
  captionCount: {
    color: "#67645e",
    fontSize: 12,
    fontWeight: "800"
  },
  captionInput: {
    color: "#111",
    fontSize: 16,
    lineHeight: 22,
    minHeight: 72,
    padding: 0
  },
  optionPanel: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#dfdcd2",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
    padding: 16
  },
  optionCopy: {
    flex: 1
  },
  optionTitle: {
    color: "#111",
    fontSize: 16,
    fontWeight: "800"
  },
  playButton: {
    alignItems: "center",
    backgroundColor: "#e8ff66",
    borderRadius: 999,
    height: 44,
    justifyContent: "center",
    width: 44
  },
  disabledButton: {
    opacity: 0.35
  },
  publishButton: {
    alignItems: "center",
    backgroundColor: "#111",
    borderRadius: 8,
    marginTop: 18,
    paddingVertical: 16
  },
  postedButton: {
    backgroundColor: "#2f6f56"
  },
  publishText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900"
  },
  feed: {
    gap: 16,
    padding: 20,
    paddingBottom: 32
  },
  emptyPanel: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#dfdcd2",
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
    padding: 24
  },
  emptyTitle: {
    color: "#111",
    fontSize: 18,
    fontWeight: "900"
  },
  profileHeader: {
    alignItems: "center",
    backgroundColor: "#111",
    borderRadius: 8,
    flexDirection: "row",
    gap: 14,
    padding: 16
  },
  avatar: {
    alignItems: "center",
    backgroundColor: "#e8ff66",
    borderRadius: 999,
    height: 56,
    justifyContent: "center",
    overflow: "hidden",
    width: 56
  },
  avatarImage: {
    height: "100%",
    width: "100%"
  },
  avatarText: {
    color: "#111",
    fontSize: 18,
    fontWeight: "900"
  },
  profileHeaderCopy: {
    flex: 1
  },
  profileName: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900"
  },
  profileHandle: {
    color: "#e8e3d7",
    fontSize: 13,
    fontWeight: "700"
  },
  closeButton: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 999,
    height: 40,
    justifyContent: "center",
    width: 40
  },
  profilePanel: {
    backgroundColor: "#fff",
    borderColor: "#dfdcd2",
    borderRadius: 8,
    borderWidth: 1,
    gap: 16,
    marginTop: 18,
    padding: 16
  },
  settingsMenu: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  profileSections: {
    backgroundColor: "#fff",
    borderColor: "#dfdcd2",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 6,
    marginTop: 18,
    padding: 6
  },
  sectionButton: {
    alignItems: "center",
    borderRadius: 8,
    flex: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    paddingVertical: 11
  },
  activeSectionButton: {
    backgroundColor: "#e8ff66"
  },
  sectionButtonText: {
    color: "#67645e",
    fontSize: 13,
    fontWeight: "900"
  },
  activeSectionButtonText: {
    color: "#111"
  },
  profileField: {
    gap: 8
  },
  setupAvatarRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14
  },
  profileLabel: {
    color: "#67645e",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  profileInput: {
    backgroundColor: "#f8f7f2",
    borderColor: "#dfdcd2",
    borderRadius: 8,
    borderWidth: 1,
    color: "#111",
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  profileBioInput: {
    lineHeight: 22,
    minHeight: 96
  },
  settingRow: {
    alignItems: "center",
    borderColor: "#eeebe2",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 14,
    justifyContent: "space-between",
    padding: 14
  },
  permissionRow: {
    alignItems: "center",
    borderColor: "#eeebe2",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    padding: 14
  },
  settingCopy: {
    flex: 1,
    paddingRight: 12
  },
  settingGroup: {
    gap: 10
  },
  settingTitle: {
    color: "#111",
    fontSize: 16,
    fontWeight: "900"
  },
  switchTrack: {
    backgroundColor: "#d9d5ca",
    borderRadius: 999,
    height: 30,
    justifyContent: "center",
    padding: 3,
    width: 54
  },
  switchTrackActive: {
    backgroundColor: "#e8ff66"
  },
  switchThumb: {
    backgroundColor: "#fff",
    borderRadius: 999,
    height: 24,
    width: 24
  },
  switchThumbActive: {
    transform: [{ translateX: 24 }]
  },
  reminderTimes: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  visibilityOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  reminderTimeButton: {
    alignItems: "center",
    backgroundColor: "#f8f7f2",
    borderColor: "#dfdcd2",
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 82,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  activeReminderTimeButton: {
    backgroundColor: "#e8ff66",
    borderColor: "#111"
  },
  reminderTimeText: {
    color: "#67645e",
    fontSize: 12,
    fontWeight: "900"
  },
  activeReminderTimeText: {
    color: "#111"
  },
  testNotificationButton: {
    alignItems: "center",
    backgroundColor: "#e8ff66",
    borderRadius: 8,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    paddingVertical: 12
  },
  testNotificationText: {
    color: "#111",
    fontSize: 13,
    fontWeight: "900"
  },
  friendAddRow: {
    flexDirection: "row",
    gap: 10
  },
  friendAddInput: {
    backgroundColor: "#f8f7f2",
    borderColor: "#dfdcd2",
    borderRadius: 8,
    borderWidth: 1,
    color: "#111",
    flex: 1,
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: 12
  },
  friendAddButton: {
    alignItems: "center",
    backgroundColor: "#e8ff66",
    borderRadius: 8,
    height: 48,
    justifyContent: "center",
    width: 52
  },
  friendList: {
    gap: 12,
    marginTop: 16
  },
  friendRow: {
    alignItems: "center",
    borderColor: "#eeebe2",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    padding: 12
  },
  friendAvatar: {
    alignItems: "center",
    backgroundColor: "#111",
    borderRadius: 999,
    height: 42,
    justifyContent: "center",
    overflow: "hidden",
    width: 42
  },
  friendAvatarImage: {
    height: "100%",
    width: "100%"
  },
  friendAvatarText: {
    color: "#e8ff66",
    fontSize: 13,
    fontWeight: "900"
  },
  friendCopy: {
    flex: 1
  },
  friendNameText: {
    color: "#111",
    fontSize: 16,
    fontWeight: "900"
  },
  friendActionButton: {
    alignItems: "center",
    backgroundColor: "#f0eee7",
    borderRadius: 999,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  friendRequestActions: {
    flexDirection: "row",
    gap: 8
  },
  historyRow: {
    borderColor: "#eeebe2",
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
    padding: 12
  },
  demoActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  post: {
    backgroundColor: "#fff",
    borderColor: "#dfdcd2",
    borderRadius: 8,
    borderWidth: 1,
    overflow: "hidden"
  },
  postImage: {
    aspectRatio: 1,
    width: "100%"
  },
  postBody: {
    padding: 16
  },
  postHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  postAuthor: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 10,
    paddingRight: 12
  },
  postAuthorCopy: {
    flex: 1
  },
  postAvatar: {
    alignItems: "center",
    backgroundColor: "#111",
    borderRadius: 999,
    height: 38,
    justifyContent: "center",
    overflow: "hidden",
    width: 38
  },
  postAvatarImage: {
    height: "100%",
    width: "100%"
  },
  postAvatarText: {
    color: "#e8ff66",
    fontSize: 12,
    fontWeight: "900"
  },
  postActions: {
    alignItems: "flex-end",
    gap: 8
  },
  postActionButtons: {
    flexDirection: "row",
    gap: 8
  },
  postIconButton: {
    alignItems: "center",
    backgroundColor: "#f0eee7",
    borderRadius: 999,
    height: 34,
    justifyContent: "center",
    width: 34
  },
  friendName: {
    color: "#111",
    fontSize: 18,
    fontWeight: "900"
  },
  time: {
    color: "#67645e",
    fontSize: 12,
    fontWeight: "700"
  },
  visibilityText: {
    color: "#2f6f56",
    fontSize: 12,
    fontWeight: "900",
    marginTop: 8,
    textTransform: "uppercase"
  },
  caption: {
    color: "#25231f",
    fontSize: 15,
    marginTop: 12
  },
  editCaptionPanel: {
    gap: 10,
    marginTop: 12
  },
  editCaptionInput: {
    backgroundColor: "#f8f7f2",
    borderColor: "#dfdcd2",
    borderRadius: 8,
    borderWidth: 1,
    color: "#111",
    fontSize: 15,
    minHeight: 72,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  editCaptionActions: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-end"
  },
  secondaryActionButton: {
    alignItems: "center",
    borderColor: "#dfdcd2",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  secondaryActionText: {
    color: "#67645e",
    fontSize: 13,
    fontWeight: "900"
  },
  smallActionButton: {
    alignItems: "center",
    backgroundColor: "#e8ff66",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  smallActionText: {
    color: "#111",
    fontSize: 13,
    fontWeight: "900"
  },
  destructiveButton: {
    alignItems: "center",
    backgroundColor: "#ffb8a5",
    borderRadius: 8,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    paddingVertical: 12
  },
  destructiveButtonText: {
    color: "#111",
    fontSize: 13,
    fontWeight: "900"
  },
  detailOverlay: {
    backgroundColor: "#f8f7f2",
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 10
  },
  detailHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    marginBottom: 14
  },
  detailTitleCopy: {
    flex: 1
  },
  detailImage: {
    aspectRatio: 1,
    borderRadius: 8,
    width: "100%"
  },
  voiceBubble: {
    alignItems: "center",
    backgroundColor: "#f0eee7",
    borderRadius: 8,
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
    padding: 12
  },
  disabledVoiceBubble: {
    opacity: 0.65
  },
  voiceBubbleMain: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    width: "100%"
  },
  progressTrack: {
    backgroundColor: "#d9d5ca",
    borderRadius: 999,
    height: 5,
    marginTop: 10,
    overflow: "hidden",
    width: "100%"
  },
  progressFill: {
    backgroundColor: "#2f6f56",
    borderRadius: 999,
    height: "100%"
  },
  waveform: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 5,
    height: 40
  },
  waveBar: {
    backgroundColor: "#111",
    borderRadius: 999,
    width: 5
  },
  activeWaveBar: {
    backgroundColor: "#2f6f56"
  },
  voiceLength: {
    color: "#111",
    fontSize: 12,
    fontWeight: "800"
  },
  tabs: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#dfdcd2",
    borderRadius: 8,
    borderWidth: 1,
    bottom: 18,
    flexDirection: "row",
    gap: 4,
    left: 20,
    padding: 6,
    position: "absolute",
    right: 20
  },
  navTabs: {
    backgroundColor: "#fff",
    borderColor: "#dfdcd2",
    borderTopWidth: 1,
    elevation: 0,
    height: 66,
    paddingBottom: 8,
    paddingTop: 6,
    shadowOpacity: 0
  },
  navTabItem: {
    borderRadius: 8,
    marginHorizontal: 4,
    minHeight: 52
  },
  navTabLabel: {
    fontSize: 12,
    fontWeight: "800",
    marginTop: 2
  },
  tabButton: {
    alignItems: "center",
    borderRadius: 8,
    flex: 1,
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    paddingVertical: 12
  },
  activeTab: {
    backgroundColor: "#e8ff66"
  },
  tabText: {
    color: "#777",
    fontSize: 12,
    fontWeight: "800"
  },
  activeTabText: {
    color: "#111"
  }
});

const darkStyles = StyleSheet.create({
  shell: {
    backgroundColor: "#10110f"
  },
  menuButton: {
    backgroundColor: "#1c1d1a",
    borderColor: "#30322d"
  },
  logo: {
    color: "#f8f7f2"
  },
  subtle: {
    color: "#aaa59a"
  },
  onboardingHero: {
    backgroundColor: "#1c1d1a",
    borderColor: "#30322d",
    borderWidth: 1
  },
  onboardingItem: {
    backgroundColor: "#1c1d1a",
    borderColor: "#30322d"
  },
  onboardingIcon: {
    backgroundColor: "#2a2c27"
  },
  lockPanel: {
    backgroundColor: "#1c1d1a",
    borderColor: "#30322d",
    borderWidth: 1
  },
  promptBand: {
    backgroundColor: "#1c1d1a",
    borderColor: "#30322d",
    borderWidth: 1
  },
  cameraFrame: {
    backgroundColor: "#252720"
  },
  permissionTitle: {
    color: "#f8f7f2"
  },
  iconButton: {
    backgroundColor: "#1c1d1a",
    borderColor: "#30322d"
  },
  iconLabel: {
    color: "#f8f7f2"
  },
  voicePanel: {
    backgroundColor: "#1c1d1a",
    borderColor: "#30322d"
  },
  panelTitle: {
    color: "#f8f7f2"
  },
  captionPanel: {
    backgroundColor: "#1c1d1a",
    borderColor: "#30322d"
  },
  captionCount: {
    color: "#aaa59a"
  },
  captionInput: {
    color: "#f8f7f2"
  },
  optionPanel: {
    backgroundColor: "#1c1d1a",
    borderColor: "#30322d"
  },
  optionTitle: {
    color: "#f8f7f2"
  },
  publishButton: {
    backgroundColor: "#f8f7f2"
  },
  publishText: {
    color: "#111"
  },
  emptyPanel: {
    backgroundColor: "#1c1d1a",
    borderColor: "#30322d"
  },
  emptyTitle: {
    color: "#f8f7f2"
  },
  profilePanel: {
    backgroundColor: "#1c1d1a",
    borderColor: "#30322d"
  },
  profileSections: {
    backgroundColor: "#1c1d1a",
    borderColor: "#30322d"
  },
  profileInput: {
    backgroundColor: "#10110f",
    borderColor: "#30322d",
    color: "#f8f7f2"
  },
  profileLabel: {
    color: "#aaa59a"
  },
  settingRow: {
    borderColor: "#30322d"
  },
  permissionRow: {
    borderColor: "#30322d"
  },
  settingTitle: {
    color: "#f8f7f2"
  },
  reminderTimeButton: {
    backgroundColor: "#10110f",
    borderColor: "#30322d"
  },
  reminderTimeText: {
    color: "#aaa59a"
  },
  friendAddInput: {
    backgroundColor: "#10110f",
    borderColor: "#30322d",
    color: "#f8f7f2"
  },
  friendRow: {
    borderColor: "#30322d"
  },
  friendNameText: {
    color: "#f8f7f2"
  },
  friendActionButton: {
    backgroundColor: "#2a2c27"
  },
  historyRow: {
    borderColor: "#30322d"
  },
  postIconButton: {
    backgroundColor: "#2a2c27"
  },
  editCaptionInput: {
    backgroundColor: "#10110f",
    borderColor: "#30322d",
    color: "#f8f7f2"
  },
  secondaryActionButton: {
    borderColor: "#30322d"
  },
  secondaryActionText: {
    color: "#aaa59a"
  },
  detailOverlay: {
    backgroundColor: "#10110f"
  },
  post: {
    backgroundColor: "#1c1d1a",
    borderColor: "#30322d"
  },
  friendName: {
    color: "#f8f7f2"
  },
  time: {
    color: "#aaa59a"
  },
  visibilityText: {
    color: "#8fc7a8"
  },
  caption: {
    color: "#e8e3d7"
  },
  voiceBubble: {
    backgroundColor: "#2a2c27"
  },
  waveBar: {
    backgroundColor: "#f8f7f2"
  },
  voiceLength: {
    color: "#f8f7f2"
  },
  tabs: {
    backgroundColor: "#1c1d1a",
    borderColor: "#30322d"
  },
  navTabs: {
    backgroundColor: "#1c1d1a",
    borderColor: "#30322d"
  },
  tabText: {
    color: "#aaa59a"
  }
});

export function createThemedStyles(isDarkMode) {
  if (!isDarkMode) return styles;

  return Object.keys(styles).reduce((themedStyles, key) => {
    themedStyles[key] = darkStyles[key] ? [styles[key], darkStyles[key]] : styles[key];
    return themedStyles;
  }, {});
}
