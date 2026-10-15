import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ab_token');
    if (!token) {
      setLoading(false);
      return;
    }
    authService
      .getMe()
      .then((res) => setUser(res.user))
      .catch(() => {
        localStorage.removeItem('ab_token');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (credentials) => {
    const res = await authService.login(credentials);
    // Admin logins come back with mfaRequired instead of a token — no session yet, so the
    // caller (AdminLogin) needs to prompt for the emailed code before anything is set here.
    if (res.mfaRequired) return res;
    if (res.token) localStorage.setItem('ab_token', res.token);
    setUser(res.user);
    return res.user;
  }, []);

  const verifyTwoFactor = useCallback(async (userId, code) => {
    const res = await authService.verifyTwoFactor({ userId, code });
    if (res.token) localStorage.setItem('ab_token', res.token);
    setUser(res.user);
    return res.user;
  }, []);

  const register = useCallback(async (data) => {
    const res = await authService.register(data);
    if (res.token) localStorage.setItem('ab_token', res.token);
    setUser(res.user);
    return res.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      /* ignore */
    }
    localStorage.removeItem('ab_token');
    setUser(null);
  }, []);

  const updateUser = useCallback((u) => setUser(u), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        verifyTwoFactor,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
