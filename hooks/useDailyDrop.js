import { useEffect, useState } from "react";
import { getCurrentDailyDrop, getDropSecondsRemaining } from "../utils/dailyDrop";
import { usePersistedState } from "./usePersistedState";

export function useDailyDrop() {
  const [dailyDrop, setDailyDrop] = usePersistedState("voiceReal.dailyDrop", null);
  const [secondsRemaining, setSecondsRemaining] = useState(120);

  useEffect(() => {
    setDailyDrop((currentDrop) => getCurrentDailyDrop(currentDrop));
  }, [setDailyDrop]);

  useEffect(() => {
    const timer = setInterval(() => {
      setDailyDrop((currentDrop) => getCurrentDailyDrop(currentDrop));
      setSecondsRemaining(getDropSecondsRemaining(dailyDrop));
    }, 1000);

    return () => clearInterval(timer);
  }, [dailyDrop, setDailyDrop]);

  return {
    isLate: secondsRemaining === 0,
    prompt: dailyDrop?.prompt || getCurrentDailyDrop(null).prompt,
    secondsRemaining
  };
}
