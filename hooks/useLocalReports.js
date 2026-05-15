import { usePersistedState } from "./usePersistedState";
import { createReport } from "../services/reportsService";

export function useLocalReports(logEvent) {
  const [reports, setReports] = usePersistedState("voiceReal.reports", []);

  function reportContent(target, reason) {
    const report = createReport(target, reason);

    setReports((current) => [report, ...current]);
    logEvent(`Reported ${report.targetType}: ${reason}`);
    return report;
  }

  function clearReports() {
    setReports([]);
    logEvent("Cleared local reports");
  }

  return {
    clearReports,
    reportContent,
    reports
  };
}
