import { incomingFriendRequests as starterFriendRequests, friends as starterFriends } from "../data/friends";
import { formatHandle, getNameFromHandle } from "../utils/formatting";
import { usePersistedState } from "./usePersistedState";

export function useLocalSocial(logEvent) {
  const [friends, setFriends] = usePersistedState("voiceReal.friends", starterFriends);
  const [friendRequests, setFriendRequests] = usePersistedState(
    "voiceReal.friendRequests",
    starterFriendRequests
  );

  function addFriend(handle) {
    const normalizedHandle = formatHandle(handle);
    if (!normalizedHandle) return;

    setFriends((currentFriends) => {
      if (currentFriends.some((friend) => friend.handle === normalizedHandle)) return currentFriends;

      return [
        {
          id: `friend-${Date.now()}`,
          name: getNameFromHandle(normalizedHandle),
          handle: normalizedHandle,
          avatarUri: ""
        },
        ...currentFriends
      ];
    });
    logEvent(`Added friend ${normalizedHandle}`);
  }

  function acceptFriendRequest(request) {
    setFriends((currentFriends) => {
      if (currentFriends.some((friend) => friend.id === request.id)) return currentFriends;
      return [request, ...currentFriends];
    });
    setFriendRequests((requests) => requests.filter((item) => item.id !== request.id));
    logEvent(`Accepted friend request ${request.handle}`);
  }

  function declineFriendRequest(requestId) {
    setFriendRequests((requests) => requests.filter((item) => item.id !== requestId));
    logEvent("Declined friend request");
  }

  function removeFriend(friendId) {
    setFriends((currentFriends) => currentFriends.filter((friend) => friend.id !== friendId));
    logEvent("Removed friend");
  }

  function blockFriend(friendId) {
    removeFriend(friendId);
    setFriendRequests((requests) => requests.filter((item) => item.id !== friendId));
    logEvent("Blocked friend");
  }

  function restoreDemoSocialData() {
    setFriends(starterFriends);
    setFriendRequests(starterFriendRequests);
    logEvent("Restored demo social data");
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
    declineFriendRequest,
    friendRequests,
    friends,
    removeFriend,
    restoreDemoSocialData,
    setFriends,
    simulateNewFriendPost
  };
}
