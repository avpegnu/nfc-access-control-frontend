import { AppBar, Toolbar, Typography, IconButton, Box, Avatar, Chip, Tooltip, Menu, MenuItem, ListItemIcon, Divider } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import SecurityIcon from '@mui/icons-material/Security';
import WifiIcon from '@mui/icons-material/Wifi';
import LogoutIcon from '@mui/icons-material/Logout';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useAuth } from '../../contexts/AuthContext';
import { useThemeMode } from '../../contexts/ThemeContext';

export default function Navbar({ onMenuClick }) {
  const { currentUser, logout } = useAuth();
  const { mode, toggleTheme, isDark, colors } = useThemeMode();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Lấy chữ cái đầu của email để hiển thị
  const getInitials = () => {
    if (currentUser?.email) {
      return currentUser.email.charAt(0).toUpperCase();
    }
    return 'U';
  };
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: isDark
          ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: { xs: 56, sm: 64 }, px: { xs: 1, sm: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            edge="start"
            onClick={onMenuClick}
            sx={{
              mr: 2,
              display: { sm: 'none' },
              color: colors.textPrimary,
              '&:hover': {
                background: 'rgba(99, 102, 241, 0.2)',
              }
            }}
          >
            <MenuIcon />
          </IconButton>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1, sm: 1.5 },
            }}
          >
            <Avatar
              sx={{
                background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                width: { xs: 32, sm: 40 },
                height: { xs: 32, sm: 40 },
              }}
            >
              <SecurityIcon sx={{ fontSize: { xs: 18, sm: 24 } }} />
            </Avatar>
            <Box>
              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontWeight: 700,
                  background: isDark
                    ? 'linear-gradient(135deg, #f1f5f9, #cbd5e1)'
                    : 'linear-gradient(135deg, #1e293b, #475569)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.5px',
                  fontSize: { xs: '0.9rem', sm: '1.25rem' },
                }}
              >
                NFC Access Control
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  display: { xs: 'none', md: 'block' }
                }}
              >
                Smart Door Management System
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
          <Chip
            icon={<WifiIcon sx={{ fontSize: 16 }} />}
            label="Connected"
            size="small"
            sx={{
              background: 'rgba(16, 185, 129, 0.2)',
              color: '#34d399',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              fontWeight: 500,
              display: { xs: 'none', sm: 'flex' }
            }}
          />
          <Tooltip title={isDark ? 'Chuyển sang Light Mode' : 'Chuyển sang Dark Mode'}>
            <IconButton
              onClick={toggleTheme}
              sx={{
                color: isDark ? '#fbbf24' : '#6366f1',
                background: isDark ? 'rgba(251, 191, 36, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                border: isDark ? '1px solid rgba(251, 191, 36, 0.3)' : '1px solid rgba(99, 102, 241, 0.3)',
                '&:hover': {
                  background: isDark ? 'rgba(251, 191, 36, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                },
              }}
            >
              {isDark ? <LightModeIcon sx={{ fontSize: 20 }} /> : <DarkModeIcon sx={{ fontSize: 20 }} />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Tài khoản">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: { xs: 0, sm: 1 } }}
            >
              <Avatar
                sx={{
                  width: { xs: 32, sm: 36 },
                  height: { xs: 32, sm: 36 },
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)',
                  }
                }}
              >
                {getInitials()}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 200,
                background: isDark
                  ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.98), rgba(15, 23, 42, 0.98))'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.98))',
                border: `1px solid ${colors.border}`,
                backdropFilter: 'blur(20px)',
                '& .MuiMenuItem-root': {
                  px: 2,
                  py: 1.5,
                  borderRadius: 1,
                  mx: 1,
                  my: 0.5,
                  color: colors.textPrimary,
                  '&:hover': {
                    background: 'rgba(99, 102, 241, 0.2)',
                  },
                },
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" sx={{ color: colors.textPrimary, fontWeight: 600 }}>
                {currentUser?.email || 'Người dùng'}
              </Typography>
              <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                Quản trị viên
              </Typography>
            </Box>
            <Divider sx={{ borderColor: colors.border, my: 1 }} />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" sx={{ color: '#f87171' }} />
              </ListItemIcon>
              <Typography sx={{ color: '#f87171' }}>Đăng xuất</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
