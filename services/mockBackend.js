import { createLocalId, createTimestamp } from "./ids";

export const UPLOAD_STATUS = {
  queued: "queued",
  uploading: "uploading",
  uploaded: "uploaded",
  failed: "failed",
  deleted: "deleted"
};

export function createBackendMeta(entityType, status = UPLOAD_STATUS.queued) {
  return {
    backendId: null,
    entityType,
    lastSyncedAt: null,
    syncError: null,
    uploadStatus: status
  };
}

export function markUploadStatus(item, status, syncError = null) {
  if (!item) return item;

  return {
    ...item,
    backendId: status === UPLOAD_STATUS.uploaded ? item.backendId || createLocalId("remote") : item.backendId || null,
    lastSyncedAt: status === UPLOAD_STATUS.uploaded ? createTimestamp() : item.lastSyncedAt || null,
    syncError,
    uploadStatus: status
  };
}

export function createOutgoingFriendRequest(handle) {
  return {
    id: createLocalId("request"),
    handle,
    name: handle.replace("@", "") || "Pending friend",
    status: "pending",
    createdAt: createTimestamp(),
    ...createBackendMeta("friend_request")
  };
}

export function createBlockedProfile(profile) {
  return {
    id: profile.id,
    name: profile.name,
    handle: profile.handle,
    avatarUri: profile.avatarUri || "",
    blockedAt: createTimestamp()
  };
}
