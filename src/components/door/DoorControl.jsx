import { useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';

export default function DoorControl({ status, onUnlock, onLock }) {
  const [loading, setLoading] = useState(false);
  const [activeButton, setActiveButton] = useState(null);

  const handleUnlock = async () => {
    setLoading(true);
    setActiveButton('unlock');
    try {
      await onUnlock();
    } finally {
      setLoading(false);
      setActiveButton(null);
    }
  };

  const handleLock = async () => {
    setLoading(true);
    setActiveButton('lock');
    try {
      await onLock();
    } finally {
      setLoading(false);
      setActiveButton(null);
    }
  };

  const isOpen = status?.isOpen;

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        minWidth: 0,
      }}
    >
      {/* Title */}
      <Typography
        sx={{
          color: '#94a3b8',
          mb: 1.5,
          textAlign: 'center',
          fontSize: '0.7rem',
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}
      >
        Điều khiển
      </Typography>

      {/* Buttons */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 1 }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={
            loading && activeButton === 'unlock' ? (
              <CircularProgress size={16} sx={{ color: 'inherit' }} />
            ) : (
              <LockOpenIcon sx={{ fontSize: 18 }} />
            )
          }
          onClick={handleUnlock}
          disabled={loading || isOpen}
          sx={{
            py: 1.25,
            borderRadius: 2,
            background: isOpen
              ? 'rgba(100, 116, 139, 0.3)'
              : 'linear-gradient(135deg, #10b981, #059669)',
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.85rem',
            textTransform: 'none',
            boxShadow: isOpen ? 'none' : '0 4px 15px rgba(16, 185, 129, 0.3)',
            '&:hover': {
              background: isOpen
                ? 'rgba(100, 116, 139, 0.3)'
                : 'linear-gradient(135deg, #34d399, #10b981)',
            },
            '&:disabled': {
              background: 'rgba(100, 116, 139, 0.3)',
              color: 'rgba(255, 255, 255, 0.5)',
            },
          }}
        >
          Mở
        </Button>

        <Button
          variant="contained"
          fullWidth
          startIcon={
            loading && activeButton === 'lock' ? (
              <CircularProgress size={16} sx={{ color: 'inherit' }} />
            ) : (
              <LockIcon sx={{ fontSize: 18 }} />
            )
          }
          onClick={handleLock}
          disabled={loading || !isOpen}
          sx={{
            py: 1.25,
            borderRadius: 2,
            background: !isOpen
              ? 'rgba(100, 116, 139, 0.3)'
              : 'linear-gradient(135deg, #ef4444, #dc2626)',
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.85rem',
            textTransform: 'none',
            boxShadow: !isOpen ? 'none' : '0 4px 15px rgba(239, 68, 68, 0.3)',
            '&:hover': {
              background: !isOpen
                ? 'rgba(100, 116, 139, 0.3)'
                : 'linear-gradient(135deg, #f87171, #ef4444)',
            },
            '&:disabled': {
              background: 'rgba(100, 116, 139, 0.3)',
              color: 'rgba(255, 255, 255, 0.5)',
            },
          }}
        >
          Khóa
        </Button>
      </Box>
    </Box>
  );
}
