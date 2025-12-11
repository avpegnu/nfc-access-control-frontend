import { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';

export default function AddUserForm({ onAdd }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('Vui lòng nhập họ tên');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onAdd({
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
      });

      setSuccess('Thêm người dùng thành công!');
      setFormData({
        name: '',
        email: '',
        role: 'user',
      });
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
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
    '& .MuiInputAdornment-root': {
      color: '#64748b',
    },
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, mb: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            p: { xs: 0.75, sm: 1 },
            borderRadius: { xs: 1.5, sm: 2 },
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(99, 102, 241, 0.1))',
          }}
        >
          <PersonAddIcon sx={{ color: '#818cf8', fontSize: { xs: 20, sm: 24 } }} />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ color: '#f1f5f9', fontWeight: 600, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            Thêm người dùng mới
          </Typography>
          <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
            Tạo người dùng để gán vào thẻ NFC
          </Typography>
        </Box>
      </Box>

      {/* Info Box */}
      <Alert
        severity="info"
        icon={<InfoIcon />}
        sx={{
          mb: 2,
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          color: '#818cf8',
          '& .MuiAlert-icon': {
            color: '#818cf8',
          },
        }}
      >
        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
          Sau khi tạo user, vào <strong>Quản lý thẻ</strong> để gán thẻ NFC cho người này
        </Typography>
      </Alert>

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            '& .MuiAlert-icon': {
              color: '#f87171',
            },
          }}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          icon={<CheckCircleIcon />}
          sx={{
            mb: 2,
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

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Họ tên"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          sx={{ ...inputSx, mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          label="Email (không bắt buộc)"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          sx={{ ...inputSx, mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon />
              </InputAdornment>
            ),
          }}
        />

        <FormControl fullWidth sx={{ ...inputSx, mb: 3 }}>
          <InputLabel>Vai trò</InputLabel>
          <Select
            name="role"
            value={formData.role}
            onChange={handleChange}
            label="Vai trò"
            startAdornment={
              <InputAdornment position="start">
                <BadgeIcon />
              </InputAdornment>
            }
          >
            <MenuItem value="user">User - Người dùng thường</MenuItem>
            <MenuItem value="admin">Admin - Quản trị viên</MenuItem>
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          size="large"
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <PersonAddIcon />}
          disabled={loading}
          fullWidth
          sx={{
            py: { xs: 1.25, sm: 1.5 },
            borderRadius: 2,
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            fontWeight: 600,
            fontSize: { xs: '0.875rem', sm: '1rem' },
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
          {loading ? 'Đang thêm...' : 'Thêm người dùng'}
        </Button>
      </Box>
    </Box>
  );
}
