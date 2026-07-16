import { normalizeFriend, normalizeFriendList } from "./entities";
import { toggleCloseFriend } from "./friendsService";

export const localSocialRepository = {
  normalizeFriend,
  normalizeFriends: normalizeFriendList,
  addFriend(friends, friend) {
    const normalized = normalizeFriend(friend);
    if (!normalized || friends.some((item) => item.id === normalized.id)) return friends;
    return [normalized, ...friends];
  },
  removeFriend(friends, friendId) {
    return friends.filter((friend) => friend.id !== friendId);
  },
  toggleCloseFriend
};
