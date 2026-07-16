import { incomingFriendRequests as starterFriendRequests, friends as starterFriends } from "../data/friends";
import { createBlockedProfile, createOutgoingFriendRequest } from "../services/mockBackend";
import { toggleCloseFriend } from "../services/friendsService";
import { localSocialRepository } from "../services/localSocialRepository";
import { formatHandle } from "../utils/formatting";
import { usePersistedState } from "./usePersistedState";
import { STORAGE_KEYS } from "../constants/storageKeys";

export function useLocalSocial(logEvent) {
  const [friends, setFriends] = usePersistedState(STORAGE_KEYS.friends, starterFriends);
  const [friendRequests, setFriendRequests] = usePersistedState(
    STORAGE_KEYS.friendRequests,
    starterFriendRequests
  );
  const [outgoingFriendRequests, setOutgoingFriendRequests] = usePersistedState(
    STORAGE_KEYS.outgoingFriendRequests,
    []
  );
  const [blockedProfiles, setBlockedProfiles] = usePersistedState(STORAGE_KEYS.blockedProfiles, []);

  function addFriend(handle) {
    const normalizedHandle = formatHandle(handle);
    if (!normalizedHandle) return;

    setOutgoingFriendRequests((requests) => {
      if (requests.some((request) => request.handle === normalizedHandle)) return requests;
      return [createOutgoingFriendRequest(normalizedHandle), ...requests];
    });
    logEvent(`Sent friend request ${normalizedHandle}`);
  }

  function acceptFriendRequest(request) {
    setFriends((currentFriends) => {
      return localSocialRepository.addFriend(currentFriends, request);
    });
    setFriendRequests((requests) => requests.filter((item) => item.id !== request.id));
    logEvent(`Accepted friend request ${request.handle}`);
  }

  function declineFriendRequest(requestId) {
    setFriendRequests((requests) => requests.filter((item) => item.id !== requestId));
    logEvent("Declined friend request");
  }

  function cancelFriendRequest(requestId) {
    setOutgoingFriendRequests((requests) => requests.filter((item) => item.id !== requestId));
    logEvent("Cancelled friend request");
  }

  function removeFriend(friendId) {
    setFriends((currentFriends) => localSocialRepository.removeFriend(currentFriends, friendId));
    logEvent("Removed friend");
  }

  function blockFriend(target) {
    const friendId = typeof target === "object" ? target.id : target;
    const directProfile = typeof target === "object" ? target : null;

    if (directProfile) {
      setBlockedProfiles((blockedProfiles) => addBlockedProfile(blockedProfiles, directProfile));
    }

    setFriends((currentFriends) => {
      const blockedProfile = currentFriends.find((friend) => friend.id === friendId);
      if (blockedProfile) {
        setBlockedProfiles((profiles) => addBlockedProfile(profiles, blockedProfile));
      }
      return currentFriends.filter((friend) => friend.id !== friendId);
    });
    setFriendRequests((requests) => requests.filter((item) => item.id !== friendId));
    setOutgoingFriendRequests((requests) => requests.filter((item) => item.id !== friendId));
    logEvent("Blocked friend");
  }

  function unblockProfile(profileId) {
    setBlockedProfiles((profiles) => profiles.filter((profile) => profile.id !== profileId));
    logEvent("Unblocked profile");
  }

  function toggleFriendCloseStatus(friendId) {
    setFriends((currentFriends) => toggleCloseFriend(currentFriends, friendId));
    logEvent("Updated close friends");
  }

  function restoreDemoSocialData() {
    setFriends(starterFriends);
    setFriendRequests(starterFriendRequests);
    setOutgoingFriendRequests([]);
    setBlockedProfiles([]);
    logEvent("Restored demo social data");
  }

  function clearLocalSocialData() {
    setFriends([]);
    setFriendRequests([]);
    setOutgoingFriendRequests([]);
    setBlockedProfiles([]);
    logEvent("Cleared local social data");
  }

  function simulateNewFriendPost() {
    const newPost = {
      id: `sim-${Date.now()}`,
      name: "Ari",
      handle: "@arireal",
      avatarUri:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
      time: "now",
      photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80",
      caption: "Mock post just dropped.",
      isCloseFriend: false,
      voice: "0:15",
      playable: false
    };
    setFriends((currentFriends) => [newPost, ...currentFriends]);
    logEvent("Simulated new friend post");
    return newPost;
  }

  return {
    acceptFriendRequest,
    addFriend,
    blockFriend,
    blockedProfiles,
    cancelFriendRequest,
    clearLocalSocialData,
    declineFriendRequest,
    friendRequests,
    friends: localSocialRepository.normalizeFriends(friends),
    outgoingFriendRequests,
    removeFriend,
    restoreDemoSocialData,
    setFriends,
    simulateNewFriendPost,
    toggleFriendCloseStatus,
    unblockProfile
  };
}

function addBlockedProfile(blockedProfiles, profile) {
  if (!profile || blockedProfiles.some((blockedProfile) => blockedProfile.id === profile.id)) {
    return blockedProfiles;
  }

  return [createBlockedProfile(profile), ...blockedProfiles];
}
