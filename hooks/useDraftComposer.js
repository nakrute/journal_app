import { usePersistedState } from "./usePersistedState";

export function useDraftComposer() {
  const [capturedPhoto, setCapturedPhoto] = usePersistedState("voiceReal.draft.photo", null);
  const [voiceUri, setVoiceUri] = usePersistedState("voiceReal.draft.voiceUri", null);
  const [caption, setCaption] = usePersistedState("voiceReal.draft.caption", "My real moment.");
  const [addToPosts, setAddToPosts] = usePersistedState("voiceReal.draft.addToPosts", false);

  function resetDraft() {
    setCapturedPhoto(null);
    setVoiceUri(null);
    setCaption("My real moment.");
    setAddToPosts(false);
  }

  return {
    addToPosts,
    caption,
    capturedPhoto,
    resetDraft,
    setAddToPosts,
    setCaption,
    setCapturedPhoto,
    setVoiceUri,
    voiceUri
  };
}
