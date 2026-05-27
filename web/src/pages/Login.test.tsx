import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Login from './Login';

const signInCreate = vi.fn();
const signInAuthWithRedirect = vi.fn();
const signUpCreate = vi.fn();
const signUpPrepareEmail = vi.fn();
const setActive = vi.fn();

const useSignInMock = vi.fn();
const useSignUpMock = vi.fn();
const useClerkMock = vi.fn();

vi.mock('@clerk/clerk-react', () => ({
  useSignIn: () => useSignInMock(),
  useSignUp: () => useSignUpMock(),
  useClerk: () => useClerkMock(),
}));

function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();

  useSignInMock.mockReturnValue({
    isLoaded: true,
    setActive,
    signIn: {
      create: signInCreate,
      authenticateWithRedirect: signInAuthWithRedirect,
      attemptFirstFactor: vi.fn(),
    },
  });
  useSignUpMock.mockReturnValue({
    isLoaded: true,
    signUp: {
      create: signUpCreate,
      prepareEmailAddressVerification: signUpPrepareEmail,
      attemptEmailAddressVerification: vi.fn(),
    },
  });
  useClerkMock.mockReturnValue({});
});

describe('Login', () => {
  it('renders the options screen with Continue with Google', () => {
    renderLogin();
    expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument();
  });

  it('shows the email option in dev mode', () => {
    renderLogin();
    // EMAIL_LOGIN_ENABLED reads import.meta.env.DEV which is true under vitest
    expect(screen.getByRole('button', { name: /continue with email/i })).toBeInTheDocument();
  });

  it('clicking Continue with Google triggers the OAuth redirect', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole('button', { name: /continue with google/i }));

    expect(signInAuthWithRedirect).toHaveBeenCalledWith(
      expect.objectContaining({
        strategy: 'oauth_google',
        redirectUrl: expect.stringContaining('/auth/callback'),
        redirectUrlComplete: expect.stringContaining('/auth/callback'),
      })
    );
  });

  it('clicking Continue with email shows the email entry screen', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole('button', { name: /continue with email/i }));

    expect(screen.getByRole('heading', { name: /what's your email address\?/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your email address/i)).toBeInTheDocument();
  });

  it('rejects an invalid email and does not call signIn.create', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole('button', { name: /continue with email/i }));
    await user.type(screen.getByPlaceholderText(/enter your email address/i), 'not-an-email');
    await user.click(screen.getByRole('button', { name: /continue with email/i }));

    expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
    expect(signInCreate).not.toHaveBeenCalled();
  });

  it('submits a valid email and advances to the verification screen', async () => {
    signInCreate.mockResolvedValue({
      supportedFirstFactors: [{ strategy: 'email_code', emailAddressId: 'eid_1' }],
      prepareFirstFactor: vi.fn().mockResolvedValue(undefined),
    });

    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole('button', { name: /continue with email/i }));
    await user.type(screen.getByPlaceholderText(/enter your email address/i), 'ada@example.com');
    await user.click(screen.getByRole('button', { name: /continue with email/i }));

    expect(await screen.findByRole('heading', { name: /check your email/i })).toBeInTheDocument();
    expect(screen.getByText(/ada@example\.com/)).toBeInTheDocument();
  });

  it('routes unknown emails into the sign-up flow', async () => {
    signInCreate.mockRejectedValue({ errors: [{ code: 'form_identifier_not_found', message: 'not found' }] });
    signUpCreate.mockResolvedValue(undefined);
    signUpPrepareEmail.mockResolvedValue(undefined);

    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole('button', { name: /continue with email/i }));
    await user.type(screen.getByPlaceholderText(/enter your email address/i), 'new@example.com');
    await user.click(screen.getByRole('button', { name: /continue with email/i }));

    expect(await screen.findByRole('heading', { name: /check your email/i })).toBeInTheDocument();
    expect(signUpCreate).toHaveBeenCalledWith({ emailAddress: 'new@example.com' });
    expect(signUpPrepareEmail).toHaveBeenCalledWith({ strategy: 'email_code' });
  });
});
