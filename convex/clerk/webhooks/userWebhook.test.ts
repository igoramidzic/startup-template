import { describe, expect, it, vi } from 'vitest';
import { internal } from '../../_generated/api';
import type { ActionCtx } from '../../_generated/server';
import { handleUserWebhook } from './userWebhook';

function makeCtx() {
  const runMutation = vi.fn().mockResolvedValue('user_id_123');
  const ctx = { runMutation } as unknown as ActionCtx;
  return { ctx, runMutation };
}

describe('handleUserWebhook', () => {
  it('extracts clerkId, primary email, and firstName from the payload', async () => {
    const { ctx, runMutation } = makeCtx();

    const payload = {
      type: 'user.created',
      data: {
        id: 'user_abc',
        first_name: 'Ada',
        email_addresses: [{ email_address: 'ada@example.com' }, { email_address: 'second@example.com' }],
      },
    };

    const response = await handleUserWebhook(ctx, payload);

    expect(response.status).toBe(200);
    expect(runMutation).toHaveBeenCalledTimes(1);
    expect(runMutation).toHaveBeenCalledWith(internal.clerk.createUserFromClerk, {
      clerkId: 'user_abc',
      email: 'ada@example.com',
      firstName: 'Ada',
    });
  });

  it('treats a null first_name as undefined', async () => {
    const { ctx, runMutation } = makeCtx();

    await handleUserWebhook(ctx, {
      data: {
        id: 'user_abc',
        first_name: null,
        email_addresses: [{ email_address: 'a@b.com' }],
      },
    });

    expect(runMutation.mock.calls[0][1]).toMatchObject({ firstName: undefined });
  });

  it('falls back to an empty email when none are present', async () => {
    const { ctx, runMutation } = makeCtx();

    await handleUserWebhook(ctx, {
      data: { id: 'user_abc', first_name: 'Ada', email_addresses: [] },
    });

    expect(runMutation.mock.calls[0][1]).toMatchObject({ email: '' });
  });

  it('falls back to an empty email when email_addresses is missing', async () => {
    const { ctx, runMutation } = makeCtx();

    await handleUserWebhook(ctx, { data: { id: 'user_abc' } });

    expect(runMutation.mock.calls[0][1]).toMatchObject({
      clerkId: 'user_abc',
      email: '',
      firstName: undefined,
    });
  });
});
