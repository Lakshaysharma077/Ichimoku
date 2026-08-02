import { prisma } from "@/lib/db";

export interface AuditLogOptions {
  action: string;
  entity: string;
  entityId?: string | null;
  details: Record<string, any> | string;
  userId?: string | null;
  ipAddress?: string | null;
}

/**
 * Creates an immutable AuditLog entry in the database.
 */
export async function logAuditEvent(options: AuditLogOptions): Promise<void> {
  try {
    const detailsString =
      typeof options.details === "string"
        ? options.details
        : JSON.stringify(options.details);

    await prisma.auditLog.create({
      data: {
        action: options.action,
        entity: options.entity,
        entityId: options.entityId || null,
        details: detailsString,
        userId: options.userId || null,
        ipAddress: options.ipAddress || null,
      },
    });
  } catch (error) {
    console.error("AUDIT_LOG_ERROR:", error);
  }
}
