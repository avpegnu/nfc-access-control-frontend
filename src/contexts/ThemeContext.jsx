import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { createTheme } from '@mui/material/styles';

const ThemeContext = createContext();

// Light theme colors
const lightPalette = {
  mode: 'light',
  primary: {
    main: '#6366f1',
    light: '#818cf8',
    dark: '#4f46e5',
  },
  secondary: {
    main: '#ec4899',
    light: '#f472b6',
    dark: '#db2777',
  },
  success: {
    main: '#10b981',
    light: '#34d399',
    dark: '#059669',
  },
  error: {
    main: '#ef4444',
    light: '#f87171',
    dark: '#dc2626',
  },
  warning: {
    main: '#f59e0b',
    light: '#fbbf24',
    dark: '#d97706',
  },
  background: {
    default: '#f8fafc',
    paper: '#ffffff',
  },
  text: {
    primary: '#1e293b',
    secondary: '#64748b',
  },
};

// Dark theme colors
const darkPalette = {
  mode: 'dark',
  primary: {
    main: '#6366f1',
    light: '#818cf8',
    dark: '#4f46e5',
  },
  secondary: {
    main: '#ec4899',
    light: '#f472b6',
    dark: '#db2777',
  },
  success: {
    main: '#10b981',
    light: '#34d399',
    dark: '#059669',
  },
  error: {
    main: '#ef4444',
    light: '#f87171',
    dark: '#dc2626',
  },
  warning: {
    main: '#f59e0b',
    light: '#fbbf24',
    dark: '#d97706',
  },
  background: {
    default: '#0f172a',
    paper: '#1e293b',
  },
  text: {
    primary: '#f1f5f9',
    secondary: '#94a3b8',
  },
};

// Theme-specific style tokens
export const getThemeColors = (mode) => ({
  // Background colors
  bgPrimary: mode === 'dark' ? '#0f172a' : '#f8fafc',
  bgSecondary: mode === 'dark' ? '#1e293b' : '#ffffff',
  bgCard: mode === 'dark'
    ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.95))',
  bgCardSolid: mode === 'dark' ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.95)',
  bgHover: mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
  bgInput: mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',

  // Border colors
  border: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
  borderLight: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',

  // Text colors
  textPrimary: mode === 'dark' ? '#f1f5f9' : '#1e293b',
  textSecondary: mode === 'dark' ? '#94a3b8' : '#64748b',
  textMuted: mode === 'dark' ? '#64748b' : '#94a3b8',

  // Sidebar
  sidebarBg: mode === 'dark'
    ? 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)'
    : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
  sidebarBorder: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',

  // Status colors (same for both themes)
  statusActive: '#34d399',
  statusActiveBg: 'rgba(16, 185, 129, 0.15)',
  statusActiveBorder: 'rgba(16, 185, 129, 0.3)',
  statusPending: '#fbbf24',
  statusPendingBg: 'rgba(251, 191, 36, 0.15)',
  statusPendingBorder: 'rgba(251, 191, 36, 0.3)',
  statusError: '#f87171',
  statusErrorBg: 'rgba(239, 68, 68, 0.15)',
  statusErrorBorder: 'rgba(239, 68, 68, 0.3)',

  // Primary accent
  accent: '#818cf8',
  accentBg: 'rgba(99, 102, 241, 0.15)',
  accentBorder: 'rgba(99, 102, 241, 0.3)',
  accentGradient: 'linear-gradient(135deg, #6366f1, #4f46e5)',
  accentGradientHover: 'linear-gradient(135deg, #818cf8, #6366f1)',

  // Shadow
  shadow: mode === 'dark'
    ? '0 10px 40px rgba(0, 0, 0, 0.3)'
    : '0 10px 40px rgba(0, 0, 0, 0.1)',
  shadowSm: mode === 'dark'
    ? '0 4px 20px rgba(0, 0, 0, 0.2)'
    : '0 4px 20px rgba(0, 0, 0, 0.05)',
});

const createAppTheme = (mode) => createTheme({
  palette: mode === 'dark' ? darkPalette : lightPalette,
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 10,
          padding: '10px 24px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 16,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundImage: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
  },
});

export function ThemeContextProvider({ children }) {
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem('theme-mode');
    return saved || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme-mode', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const theme = useMemo(() => createAppTheme(mode), [mode]);
  const colors = useMemo(() => getThemeColors(mode), [mode]);

  const value = {
    mode,
    toggleTheme,
    colors,
    isDark: mode === 'dark',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeMode() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within ThemeContextProvider');
  }
  return context;
}

export { ThemeContext };
