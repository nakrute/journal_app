import { usePersistedState } from "./usePersistedState";
import { STORAGE_KEYS } from "../constants/storageKeys";

export function useDraftComposer() {
  const [capturedPhoto, setCapturedPhoto] = usePersistedState(STORAGE_KEYS.draftPhoto, null);
  const [voiceUri, setVoiceUri] = usePersistedState(STORAGE_KEYS.draftVoiceUri, null);
  const [caption, setCaption] = usePersistedState(STORAGE_KEYS.draftCaption, "My real moment.");
  const [addToPosts, setAddToPosts] = usePersistedState(STORAGE_KEYS.draftAddToPosts, false);
  const [visibility, setVisibility] = usePersistedState(STORAGE_KEYS.draftVisibility, "friends");

  function resetDraft() {
    setCapturedPhoto(null);
    setVoiceUri(null);
    setCaption("My real moment.");
    setAddToPosts(false);
    setVisibility("friends");
  }

  return {
    addToPosts,
    caption,
    capturedPhoto,
    resetDraft,
    setAddToPosts,
    setCaption,
    setCapturedPhoto,
    setVisibility,
    setVoiceUri,
    visibility,
    voiceUri
  };
}
