import { query } from './_generated/server';

// Simple helper to get the current authenticated user with Clerk
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    // With Clerk, the user identity is automatically available through ctx.auth
    const identity = await ctx.auth.getUserIdentity();
    return identity;
  },
});
