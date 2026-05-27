// Stub for convex/_generated/server used in tests (generated dir is gitignored)
export type ActionCtx = {
  runMutation: (...args: unknown[]) => Promise<unknown>;
  runQuery: (...args: unknown[]) => Promise<unknown>;
  runAction: (...args: unknown[]) => Promise<unknown>;
};

export type MutationCtx = {
  db: Record<string, unknown>;
  auth: Record<string, unknown>;
};

export type QueryCtx = {
  db: Record<string, unknown>;
  auth: Record<string, unknown>;
};
