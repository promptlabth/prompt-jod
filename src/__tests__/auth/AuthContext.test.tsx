import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithOAuth: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
      onAuthStateChange: vi.fn()
    }
  }
}));

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(supabase.auth.getSession).mockResolvedValue({ data: { session: null }, error: null });
    vi.mocked(supabase.auth.onAuthStateChange).mockImplementation((callback) => {
      return { data: { subscription: { unsubscribe: vi.fn() } }, error: null };
    });
  });

  it('should initialize with loading state', () => {
    render(<AuthProvider>Test</AuthProvider>);
    expect(supabase.auth.getSession).toHaveBeenCalled();
  });

  it('should handle successful sign in', async () => {
    const mockUser = { id: '123', email: 'test@example.com' };
    vi.mocked(supabase.auth.signInWithOAuth).mockResolvedValueOnce({
      data: { user: mockUser },
      error: null
    });

    render(<AuthProvider>Test</AuthProvider>);
    // Add your sign-in test logic here
  });

  it('should handle sign in error', async () => {
    const mockError = new Error('Sign in failed');
    vi.mocked(supabase.auth.signInWithOAuth).mockRejectedValueOnce(mockError);
    const consoleSpy = vi.spyOn(console, 'error');

    render(<AuthProvider>Test</AuthProvider>);
    // Add your error handling test logic here
  });

  it('should handle sign out', async () => {
    vi.mocked(supabase.auth.signOut).mockResolvedValueOnce({ error: null });

    render(<AuthProvider>Test</AuthProvider>);
    // Add your sign-out test logic here
  });

  it('should handle sign out error', async () => {
    const mockError = new Error('Sign out failed');
    vi.mocked(supabase.auth.signOut).mockRejectedValueOnce(mockError);
    const consoleSpy = vi.spyOn(console, 'error');

    render(<AuthProvider>Test</AuthProvider>);
    // Add your error handling test logic here
  });
}); 