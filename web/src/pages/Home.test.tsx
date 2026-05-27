import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Home from './Home';

vi.mock('@clerk/clerk-react', () => ({
  UserButton: () => <div data-testid="user-button" />,
  useUser: () => ({
    user: {
      fullName: 'Ada Lovelace',
      primaryEmailAddress: { emailAddress: 'ada@example.com' },
    },
  }),
  useClerk: () => ({ signOut: vi.fn() }),
}));

describe('Home', () => {
  it('greets the signed-in user by full name', () => {
    render(<Home />);
    expect(screen.getByText(/Welcome, Ada Lovelace/i)).toBeInTheDocument();
  });

  it('renders the user button and sign-out button', () => {
    render(<Home />);
    expect(screen.getByTestId('user-button')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument();
  });
});
