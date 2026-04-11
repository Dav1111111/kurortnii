import { promises as fs } from 'fs';
import path from 'path';

const LOG_PATH = path.join(process.cwd(), 'data', 'audit.log');

export type AuditAction = 'create' | 'update' | 'delete' | 'approve';
export type AuditResource = 'tour' | 'news' | 'review' | 'site-content';

export interface AuditEntry {
  ts: string;
  action: AuditAction;
  resource: AuditResource;
  id: string;
  ip?: string;
}

export async function logAudit(
  action: AuditAction,
  resource: AuditResource,
  id: string,
  ip?: string
): Promise<void> {
  try {
    const entry: AuditEntry = { ts: new Date().toISOString(), action, resource, id, ip };
    await fs.appendFile(LOG_PATH, JSON.stringify(entry) + '\n', 'utf-8');
  } catch (err) {
    // Audit log failure must never crash the main operation
    console.error('Audit log write failed:', err);
  }
}
