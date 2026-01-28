import { prisma } from "@/db/client";
import { logger } from "@/shared/lib/logger";

export type AuditAction = "USER_CREATED" | "USER_UPDATED" | "USER_DELETED";

type AuditLogInput = {
  actorId: string;
  targetId: string;
  action: AuditAction;
  metadata?: Record<string, unknown>;
};

function serializeMetadata(metadata?: Record<string, unknown>) {
  if (!metadata) return null;
  try {
    return JSON.stringify(metadata);
  } catch {
    return null;
  }
}

export async function recordAuditLog(input: AuditLogInput) {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: input.actorId,
        action: input.action,
        targetId: input.targetId,
        metadata: serializeMetadata(input.metadata),
      },
    });
  } catch (error) {
    logger.error("audit-log-failed", {
      actorId: input.actorId,
      targetId: input.targetId,
      action: input.action,
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
