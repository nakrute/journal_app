export const VOICE_MAX_SECONDS = 60;
export const ADMIN_HANDLES = ["@admin", "@outloud-admin"];
export const BETA_INVITE_CODE = "OUTLOUD-BETA";

export const DEFAULT_PRIVACY_SETTINGS = {
  allowFriendRequests: true,
  allowProfileDiscovery: true,
  allowVoicePlayback: true,
  closeFriendsOnlyVoice: false,
  defaultPostVisibility: "friends",
  privateProfile: false,
  savePostsToArchive: true,
  showActivityStatus: false,
  muteDailyReminders: false
};

export const DEFAULT_SAFETY_SETTINGS = {
  ageConfirmed: false,
  autoHideReportedContent: true,
  contactEmailVisible: true,
  hideBlockedProfiles: true,
  requireReportReason: true,
  supportEmail: "support@outloud.local",
  termsAccepted: false
};

export const DEFAULT_BETA_ACCESS = {
  acceptedAt: null,
  acceptedCode: "",
  requireInvite: false
};
