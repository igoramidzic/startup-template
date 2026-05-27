import { v } from 'convex/values';

import { internalMutation } from '../_generated/server';

export const createUserFromClerk = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
  },
  handler: async (ctx, { clerkId, email, firstName }) => {
    const existingProfile = await ctx.db
      .query('userProfile')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', clerkId))
      .first();

    if (existingProfile) {
      await ctx.db.patch(existingProfile._id, {
        email,
        name: firstName ?? existingProfile.name,
        updatedAt: new Date().toISOString(),
      });
      return existingProfile._id;
    }

    return await ctx.db.insert('userProfile', {
      clerkId,
      email,
      name: firstName,
      updatedAt: new Date().toISOString(),
    });
  },
});
