import { formatHandle, getNameFromHandle } from "../utils/formatting";
import { createLocalId } from "./ids";

export function createFriendFromHandle(handle) {
  const normalizedHandle = formatHandle(handle);
  if (!normalizedHandle) return null;

  return {
    id: createLocalId("friend"),
    name: getNameFromHandle(normalizedHandle),
    handle: normalizedHandle,
    avatarUri: "",
    isCloseFriend: false
  };
}

export function friendExists(friends, handle) {
  const normalizedHandle = formatHandle(handle);
  return friends.some((friend) => friend.handle === normalizedHandle);
}

export function toggleCloseFriend(friends, friendId) {
  return friends.map((friend) =>
    friend.id === friendId ? { ...friend, isCloseFriend: !friend.isCloseFriend } : friend
  );
}
