import { useEffect } from "react";
import { getCurrentDailyDrop } from "../utils/dailyDrop";
import { usePersistedState } from "./usePersistedState";

export function useDailyDrop() {
  const [dailyDrop, setDailyDrop] = usePersistedState("voiceReal.dailyDrop", null);

  useEffect(() => {
    setDailyDrop((currentDrop) => getCurrentDailyDrop(currentDrop));
  }, [setDailyDrop]);

  return {
    prompt: dailyDrop?.prompt || getCurrentDailyDrop(null).prompt
  };
}
