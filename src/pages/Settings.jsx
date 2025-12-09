import { Box, Typography, TextField, Button, Grid, Alert, Skeleton } from '@mui/material';
import { useState, useEffect } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import TimerIcon from '@mui/icons-material/Timer';
import InfoIcon from '@mui/icons-material/Info';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function Settings() {
  const [config, setConfig] = useState({
    autoLockDelay: 5000,
    defaultDoorId: 'door_main',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Load config from localStorage (temporary solution)
    const savedConfig = localStorage.getItem('systemConfig');
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig));
      } catch (e) {
        console.error('Failed to parse config:', e);
      }
    }
    setLoading(false);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]: name === 'autoLockDelay' ? parseInt(value) || 0 : value,
    }));
    setSuccess('');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save to localStorage (temporary solution)
      localStorage.setItem('systemConfig', JSON.stringify(config));
      setSuccess('Lưu cấu hình thành công!');
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      background: 'rgba(255, 255, 255, 0.03)',
      borderRadius: 2,
      '& fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(99, 102, 241, 0.5)',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#6366f1',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#64748b',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#818cf8',
    },
    '& .MuiOutlinedInput-input': {
      color: '#f1f5f9',
    },
    '& .MuiFormHelperText-root': {
      color: '#64748b',
    },
  };

  if (loading) {
    return (
      <Box sx={{ animation: 'fadeIn 0.5s ease-out' }}>
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="text" width="200px" height={40} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
          <Skeleton variant="text" width="300px" height={24} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rounded" height={300} sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 4 }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rounded" height={300} sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 4 }} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#f1f5f9',
            mb: 1,
          }}
        >
          Cài đặt hệ thống
        </Typography>
        <Typography variant="body1" sx={{ color: '#94a3b8' }}>
          Cấu hình các thông số hoạt động của hệ thống
        </Typography>
      </Box>

      {success && (
        <Alert
          severity="success"
          icon={<CheckCircleIcon />}
          sx={{
            mb: 3,
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#34d399',
            '& .MuiAlert-icon': {
              color: '#34d399',
            },
          }}
        >
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Config Form */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              p: 3,
              borderRadius: 4,
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Section Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Box
                sx={{
                  p: 1,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(99, 102, 241, 0.1))',
                }}
              >
                <SettingsIcon sx={{ color: '#818cf8' }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ color: '#f1f5f9', fontWeight: 600 }}>
                  Cấu hình chung
                </Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                  Điều chỉnh các thông số hệ thống
                </Typography>
              </Box>
            </Box>

            <TextField
              fullWidth
              label="Thời gian tự động khóa (ms)"
              name="autoLockDelay"
              type="number"
              value={config.autoLockDelay}
              onChange={handleChange}
              helperText="Thời gian cửa tự động đóng lại sau khi mở (milliseconds)"
              sx={{ ...inputSx, mb: 3 }}
              InputProps={{
                startAdornment: (
                  <Box sx={{ mr: 1, color: '#64748b' }}>
                    <TimerIcon fontSize="small" />
                  </Box>
                ),
              }}
            />

            <TextField
              fullWidth
              label="ID cửa mặc định"
              name="defaultDoorId"
              value={config.defaultDoorId}
              onChange={handleChange}
              helperText="ID của cửa mặc định trong hệ thống"
              sx={{ ...inputSx, mb: 3 }}
            />

            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving}
              fullWidth
              startIcon={<SaveIcon />}
              sx={{
                py: 1.5,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #818cf8, #6366f1)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 15px 40px rgba(99, 102, 241, 0.4)',
                },
                '&:disabled': {
                  background: 'rgba(100, 116, 139, 0.3)',
                  color: 'rgba(255, 255, 255, 0.5)',
                },
              }}
            >
              {saving ? 'Đang lưu...' : 'Lưu cấu hình'}
            </Button>
          </Box>
        </Grid>

        {/* System Info */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              p: 3,
              borderRadius: 4,
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Section Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Box
                sx={{
                  p: 1,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(99, 102, 241, 0.1))',
                }}
              >
                <InfoIcon sx={{ color: '#818cf8' }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ color: '#f1f5f9', fontWeight: 600 }}>
                  Thông tin hệ thống
                </Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                  Kiến trúc và kết nối
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                { label: 'Kiến trúc', value: 'Frontend → Backend API → Firebase' },
                { label: 'Backend API', value: import.meta.env.VITE_API_URL || 'http://localhost:3001/api' },
                { label: 'Realtime', value: 'Server-Sent Events (SSE)' },
                { label: 'Authentication', value: 'JWT Token' },
              ].map((item) => (
                <Box
                  key={item.label}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 2,
                    borderRadius: 2,
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                    {item.label}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#818cf8',
                      fontWeight: 500,
                      fontFamily: 'monospace',
                      fontSize: '0.8rem',
                    }}
                  >
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Alert
              severity="info"
              sx={{
                mt: 3,
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                color: '#818cf8',
                '& .MuiAlert-icon': {
                  color: '#818cf8',
                },
              }}
            >
              Cấu hình được lưu tạm vào localStorage. Trong môi trường production, sẽ lưu vào database.
            </Alert>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
