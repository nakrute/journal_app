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
    paddingBottom: 180
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
    paddingBottom: 120
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
  caption: {
    color: "#25231f",
    fontSize: 15,
    marginTop: 12
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
