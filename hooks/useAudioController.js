import { Audio } from "expo-av";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { VOICE_MAX_SECONDS } from "../constants/app";
import { deleteMedia, preserveMedia } from "../utils/media";

const EMPTY_PLAYBACK = { durationMillis: 0, isPlaying: false, positionMillis: 0 };

export function useAudioController({ logEvent, setVoiceUri, voiceUri }) {
  const [microphonePermissionStatus, setMicrophonePermissionStatus] = useState("unknown");
  const [playbackStatus, setPlaybackStatus] = useState(EMPTY_PLAYBACK);
  const [playbackUri, setPlaybackUri] = useState(null);
  const [recording, setRecording] = useState(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordingStatus, setRecordingStatus] = useState("idle");
  const [sound, setSound] = useState(null);

  useEffect(() => {
    Audio.getPermissionsAsync()
      .then((permission) => setMicrophonePermissionStatus(permission.status))
      .catch(() => setMicrophonePermissionStatus("unknown"));
  }, []);

  useEffect(() => {
    if (!recording) {
      setRecordingSeconds(0);
      return undefined;
    }
    const timer = setInterval(() => setRecordingSeconds((seconds) => seconds + 1), 1000);
    return () => clearInterval(timer);
  }, [recording]);

  useEffect(() => {
    if (recording && recordingSeconds >= VOICE_MAX_SECONDS) stopRecording();
  }, [recording, recordingSeconds]);

  useEffect(() => () => {
    sound?.unloadAsync().catch(() => {});
    recording?.stopAndUnloadAsync().catch(() => {});
  }, [sound, recording]);

  function resetPlaybackStatus() {
    setPlaybackStatus(EMPTY_PLAYBACK);
  }

  function syncPlaybackStatus(status) {
    if (!status.isLoaded) return;
    setPlaybackStatus({
      durationMillis: status.durationMillis || 0,
      isPlaying: status.isPlaying,
      positionMillis: status.positionMillis || 0
    });
  }

  async function unloadCurrentSound() {
    if (!sound) return;
    await sound.unloadAsync();
    setSound(null);
    setPlaybackUri(null);
    resetPlaybackStatus();
  }

  async function startRecording() {
    if (voiceUri) {
      Alert.alert("Replace voice note?", "Recording again will remove the current draft voice note.", [
        { text: "Cancel", style: "cancel" },
        { text: "Replace", style: "destructive", onPress: beginRecording }
      ]);
      return;
    }
    await beginRecording();
  }

  async function beginRecording() {
    const permission = await Audio.requestPermissionsAsync();
    setMicrophonePermissionStatus(permission.status);
    if (!permission.granted) {
      Alert.alert("Microphone needed", "Enable microphone access to send voice messages.");
      return;
    }
    await unloadCurrentSound();
    await deleteMedia(voiceUri);
    setVoiceUri(null);
    setRecordingStatus("recording");
    logEvent("Started voice recording");
    await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true, playThroughEarpieceAndroid: false });
    try {
      const result = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(result.recording);
    } catch {
      setRecordingStatus("failed");
      Alert.alert("Recording issue", "OutLoud could not start recording. Check microphone access and try again.");
      logEvent("Voice recording failed to start");
    }
  }

  async function stopRecording() {
    if (!recording) return;
    setRecordingStatus("saving");
    let nextVoiceUri;
    try {
      await recording.stopAndUnloadAsync();
      nextVoiceUri = await preserveMedia(recording.getURI(), "voice");
      setRecording(null);
      setVoiceUri(nextVoiceUri);
      setRecordingStatus("ready");
      resetPlaybackStatus();
      logEvent("Saved voice recording");
    } catch {
      setRecording(null);
      setRecordingStatus("failed");
      Alert.alert("Recording issue", "OutLoud could not save that voice note. Try recording again.");
      logEvent("Voice recording failed to save");
      return;
    }
    await Audio.setAudioModeAsync({ allowsRecordingIOS: false, playsInSilentModeIOS: true, playThroughEarpieceAndroid: false });
    const result = await Audio.Sound.createAsync({ uri: nextVoiceUri }, { shouldPlay: false }, syncPlaybackStatus);
    setSound(result.sound);
    setPlaybackUri(nextVoiceUri);
    syncPlaybackStatus(result.status);
  }

  async function toggleVoicePlayback(uri = voiceUri) {
    if (!uri) return;
    try {
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false, playsInSilentModeIOS: true, playThroughEarpieceAndroid: false });
      if (sound && playbackUri === uri) {
        const status = await sound.getStatusAsync();
        if (status.isLoaded && status.isPlaying) await sound.pauseAsync();
        else {
          if (status.isLoaded && status.durationMillis && status.positionMillis >= status.durationMillis - 250) {
            await sound.setPositionAsync(0);
          }
          await sound.playAsync();
        }
        return;
      }
      await unloadCurrentSound();
      const result = await Audio.Sound.createAsync({ uri }, { shouldPlay: true }, syncPlaybackStatus);
      setSound(result.sound);
      setPlaybackUri(uri);
      syncPlaybackStatus(result.status);
    } catch {
      Alert.alert("Voice note unavailable", "This local audio file may no longer exist. Record a new voice note to replace it.");
      if (uri === voiceUri) setVoiceUri(null);
      resetPlaybackStatus();
      logEvent("Voice playback failed");
    }
  }

  async function requestMicrophonePermission() {
    const permission = await Audio.requestPermissionsAsync();
    setMicrophonePermissionStatus(permission.status);
    logEvent(`Microphone permission ${permission.status}`);
  }

  async function resetAudioDraft() {
    await unloadCurrentSound();
    setRecordingStatus("idle");
  }

  return {
    microphonePermissionStatus, playbackStatus, playbackUri, recording,
    recordingSeconds, recordingStatus, requestMicrophonePermission,
    resetAudioDraft, resetPlaybackStatus, setPlaybackUri, sound,
    startRecording, stopRecording, syncPlaybackStatus, toggleVoicePlayback
  };
}
