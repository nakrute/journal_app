import { usePersistedState } from "./usePersistedState";

export function useActivityLog() {
  const [activityLog, setActivityLog] = usePersistedState("voiceReal.activityLog", []);

  function logEvent(message) {
    setActivityLog((items) => [
      {
        id: `event-${Date.now()}`,
        message,
        time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      },
      ...items.slice(0, 29)
    ]);
  }

  function clearActivityLog() {
    setActivityLog([]);
  }

  return {
    activityLog,
    clearActivityLog,
    logEvent
  };
}
