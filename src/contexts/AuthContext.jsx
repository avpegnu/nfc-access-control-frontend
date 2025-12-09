import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    const token = api.getToken();

    if (token) {
      // Verify token and get user info
      api.getCurrentUser()
        .then((response) => {
          if (response.success) {
            setCurrentUser(response.data);
          } else {
            api.clearToken();
          }
        })
        .catch(() => {
          api.clearToken();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // Đăng ký tài khoản mới
  async function signup(email, password, displayName) {
    setError(null);
    try {
      const response = await api.register(email, password, displayName || email.split('@')[0]);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  // Đăng nhập
  async function login(email, password) {
    setError(null);
    try {
      const response = await api.login(email, password);

      if (response.success) {
        setCurrentUser(response.data.user);
      }

      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  // Đăng xuất
  async function logout() {
    try {
      await api.logout();
    } finally {
      setCurrentUser(null);
    }
  }

  const value = {
    currentUser,
    login,
    logout,
    signup,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
