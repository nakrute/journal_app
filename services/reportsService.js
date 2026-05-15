import { createLocalId, createTimestamp } from "./ids";

export function createReport(target, reason) {
  return {
    id: createLocalId("report"),
    targetId: target.id,
    targetName: target.name,
    targetType: target.photo ? "post" : "user",
    reason,
    status: "open",
    createdAt: createTimestamp()
  };
}
