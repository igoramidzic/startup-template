import { query } from '../_generated/server';

export const getCurrentProfile = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const userProfile = await ctx.db
      .query('userProfile')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .first();

    if (!userProfile) return null;

    return {
      _id: userProfile._id,
      name: userProfile.name,
      email: userProfile.email,
      clerkId: userProfile.clerkId,
      updatedAt: userProfile.updatedAt,
    };
  },
});
