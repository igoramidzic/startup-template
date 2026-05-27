import { v } from 'convex/values';

import { internalQuery } from '../_generated/server';

export const getUserByClerkId = internalQuery({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, { clerkId }) => {
    return await ctx.db
      .query('userProfile')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', clerkId))
      .first();
  },
});
