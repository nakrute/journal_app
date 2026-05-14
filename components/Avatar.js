import { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import { useStyles } from "../theme";

export function Avatar({ name, size = "medium", uri }) {
  const styles = useStyles();
  const [imageFailed, setImageFailed] = useState(false);
  const hasImage = !!uri && !imageFailed;
  const containerStyle = getContainerStyle(styles, size);
  const imageStyle = getImageStyle(styles, size);
  const textStyle = getTextStyle(styles, size);

  useEffect(() => {
    setImageFailed(false);
  }, [uri]);

  return (
    <View style={containerStyle}>
      {hasImage ? (
        <Image source={{ uri }} style={imageStyle} onError={() => setImageFailed(true)} />
      ) : (
        <Text style={textStyle}>{getInitials(name)}</Text>
      )}
    </View>
  );
}

function getContainerStyle(styles, size) {
  if (size === "small") return styles.postAvatar;
  if (size === "friend") return styles.friendAvatar;
  return styles.avatar;
}

function getImageStyle(styles, size) {
  if (size === "small") return styles.postAvatarImage;
  if (size === "friend") return styles.friendAvatarImage;
  return styles.avatarImage;
}

function getTextStyle(styles, size) {
  if (size === "small") return styles.postAvatarText;
  if (size === "friend") return styles.friendAvatarText;
  return styles.avatarText;
}

function getInitials(name = "") {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return initials.toUpperCase() || "VR";
}
