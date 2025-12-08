import { Navigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import DoorSlidingIcon from '@mui/icons-material/DoorSliding';

export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          gap: 3,
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 40px rgba(99, 102, 241, 0.4)',
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%, 100%': {
                transform: 'scale(1)',
                boxShadow: '0 10px 40px rgba(99, 102, 241, 0.4)',
              },
              '50%': {
                transform: 'scale(1.05)',
                boxShadow: '0 15px 50px rgba(99, 102, 241, 0.6)',
              },
            },
          }}
        >
          <DoorSlidingIcon sx={{ fontSize: 40, color: '#fff' }} />
        </Box>
        <CircularProgress
          size={32}
          sx={{
            color: '#6366f1',
          }}
        />
        <Typography
          variant="body2"
          sx={{
            color: '#64748b',
          }}
        >
          Đang tải...
        </Typography>
      </Box>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
