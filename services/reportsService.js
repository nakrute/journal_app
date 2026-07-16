import { createLocalId, createTimestamp } from "./ids";
import { isPostEntity } from "./entities";

export function createReport(target, reason) {
  return {
    id: createLocalId("report"),
    targetId: target.id,
    targetName: target.name,
    targetType: isPostEntity(target) ? "post" : "user",
    reason,
    status: "open",
    createdAt: createTimestamp()
  };
}
