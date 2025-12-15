import { Box, Typography, Skeleton } from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import { useThemeMode } from '../../contexts/ThemeContext';

export default function DoorStatus({ status, loading }) {
  const { colors, isDark } = useThemeMode();

  if (loading) {
    return (
      <Box
        sx={{
          p: 3,
          borderRadius: 2,
          background: colors.bgCard,
          border: `1px solid ${colors.border}`,
          textAlign: 'center',
          flex: 1,
        }}
      >
        <Skeleton variant="circular" width={64} height={64} sx={{ mx: 'auto', mb: 2, bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
        <Skeleton variant="text" width="60%" sx={{ mx: 'auto', bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
      </Box>
    );
  }

  if (!status) {
    return (
      <Box
        sx={{
          p: 3,
          borderRadius: 2,
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.1))',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          textAlign: 'center',
          flex: 1,
        }}
      >
        <WifiOffIcon sx={{ fontSize: 48, color: '#ef4444', mb: 1 }} />
        <Typography sx={{ color: '#f87171', fontSize: '0.85rem' }}>
          Không thể kết nối
        </Typography>
      </Box>
    );
  }

  const isOpen = status.isOpen;
  const isOnline = status.isOnline;

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        background: isOpen
          ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.1))'
          : 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.1))',
        border: `1px solid ${isOpen ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        flex: 1,
        minWidth: 0,
      }}
    >
      {/* Glow effect */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: isOpen
            ? 'radial-gradient(circle, rgba(16, 185, 129, 0.3), transparent 70%)'
            : 'radial-gradient(circle, rgba(239, 68, 68, 0.3), transparent 70%)',
          filter: 'blur(30px)',
        }}
      />

      {/* Icon */}
      <Box
        sx={{
          position: 'relative',
          mb: 1.5,
          display: 'inline-flex',
          p: 1.5,
          borderRadius: '50%',
          background: isOpen
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(5, 150, 105, 0.2))'
            : 'linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(220, 38, 38, 0.2))',
        }}
      >
        {isOpen ? (
          <LockOpenIcon sx={{ fontSize: 36, color: '#34d399' }} />
        ) : (
          <LockIcon sx={{ fontSize: 36, color: '#f87171' }} />
        )}
      </Box>

      {/* Status text */}
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: '1rem',
          color: isOpen ? '#34d399' : '#f87171',
          mb: 0.5,
        }}
      >
        {isOpen ? 'CỬA ĐANG MỞ' : 'CỬA ĐÃ KHÓA'}
      </Typography>

      {/* Online status */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
        {isOnline ? (
          <WifiIcon sx={{ fontSize: 14, color: '#34d399' }} />
        ) : (
          <WifiOffIcon sx={{ fontSize: 14, color: '#f87171' }} />
        )}
        <Typography sx={{ color: isOnline ? '#34d399' : '#f87171', fontSize: '0.75rem' }}>
          {isOnline ? 'Trực tuyến' : 'Ngoại tuyến'}
        </Typography>
      </Box>
    </Box>
  );
}
