import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Module mocks
const pushMock = jest.fn();
const refreshMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, refresh: refreshMock }),
}));

const signInMock = jest.fn();
jest.mock('next-auth/react', () => ({
  // Keep other exports untouched if needed in future
  __esModule: true,
  signIn: (...args: unknown[]) => signInMock(...args),
}));

import LoginPage from './page';

describe('LoginPage', () => {
  beforeEach(() => {
    pushMock.mockReset();
    refreshMock.mockReset();
    signInMock.mockReset();
  });

  it('renders email and password fields and submit button', () => {
    render(<LoginPage />);

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it('shows error when credentials are invalid', async () => {
    signInMock.mockResolvedValueOnce({
      ok: false,
      error: 'Invalid credentials',
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrong' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await screen.findByText(/invalid email or password/i);

    expect(pushMock).not.toHaveBeenCalled();
    expect(refreshMock).not.toHaveBeenCalled();
  });

  it('navigates to dashboard on successful login', async () => {
    signInMock.mockResolvedValueOnce({ ok: true, error: null });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'demo@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/dashboard'));
    expect(refreshMock).toHaveBeenCalled();
  });

  it('disables button and shows loading text while submitting', async () => {
    // Keep the promise pending for a bit to assert loading state
    let resolveFn!: (v: unknown) => void;
    const pending = new Promise((resolve) => {
      resolveFn = resolve as (v: unknown) => void;
    });
    signInMock.mockReturnValueOnce(pending);

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'demo@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password' },
    });

    const button = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(button);

    expect(button).toBeDisabled();
    expect(button).toHaveTextContent(/signing in/i);

    // resolve the pending signIn
    resolveFn({ ok: true, error: null });

    await waitFor(() => expect(button).not.toBeDisabled());
  });
});
