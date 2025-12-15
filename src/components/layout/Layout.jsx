import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import Navbar from './Navbar';
import Sidebar, { drawerWidth } from './Sidebar';
import { useThemeMode } from '../../contexts/ThemeContext';

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isDark, colors } = useThemeMode();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        background: isDark
          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
          : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f8fafc 100%)',
      }}
    >
      <Navbar onMenuClick={handleDrawerToggle} />
      <Sidebar open={mobileOpen} onClose={handleDrawerToggle} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1.5, sm: 2, md: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          height: '100vh',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: isDark
              ? 'radial-gradient(ellipse at top right, rgba(99, 102, 241, 0.1), transparent 50%), radial-gradient(ellipse at bottom left, rgba(236, 72, 153, 0.1), transparent 50%)'
              : 'radial-gradient(ellipse at top right, rgba(99, 102, 241, 0.05), transparent 50%), radial-gradient(ellipse at bottom left, rgba(236, 72, 153, 0.05), transparent 50%)',
            pointerEvents: 'none',
          }
        }}
      >
        <Toolbar />
        <Box sx={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
