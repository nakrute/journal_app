import { useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { Alert } from "react-native";
import { deleteMedia, preserveMedia } from "../utils/media";

export function useCameraController({ capturedPhoto, logEvent, recording, setCapturedPhoto }) {
  const cameraRef = useRef(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [cameraFacing, setCameraFacing] = useState("back");

  async function takePhoto() {
    if (recording) {
      Alert.alert("Recording in progress", "Stop the voice note before taking or retaking a photo.");
      return;
    }
    if (!cameraPermission?.granted) {
      const result = await requestCameraPermission();
      if (!result.granted) return;
    }
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.75, shutterSound: false });
      const savedPhotoUri = await preserveMedia(photo.uri, "photo");
      await deleteMedia(capturedPhoto);
      setCapturedPhoto(savedPhotoUri);
      logEvent("Captured photo");
    } catch {
      Alert.alert("Camera issue", "OutLoud could not capture a photo. Try retaking or restarting the camera.");
      logEvent("Camera capture failed");
    }
  }

  return {
    cameraFacing,
    cameraPermission,
    cameraRef,
    requestCameraPermission,
    setCameraFacing,
    takePhoto
  };
}
