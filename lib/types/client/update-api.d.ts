/**
 * Browser-side wire helpers for the /api/update surface. Plain fetch over
 * same-origin /api like the pairing client; the host half enforces the
 * loopback-only fence and owns the pnpm run.
 */
import type { UpdateRunResult, UpdateStatus } from '../update.ts';
/**
 * Probe the update status: install mode, owning profile, and the
 * current-vs-latest comparison for every family package.
 * @returns the status snapshot.
 */
export declare function fetchUpdateStatus(): Promise<UpdateStatus>;
/**
 * Run the update (pnpm update in the owning profile). Blocks until pnpm
 * exits — the panel shows an in-flight state meanwhile.
 * @returns the run outcome.
 */
export declare function runUpdate(): Promise<UpdateRunResult>;
//# sourceMappingURL=update-api.d.ts.map