import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Alert,
  Chip,
  Card,
  CardContent,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import RouterIcon from '@mui/icons-material/Router';
import RefreshIcon from '@mui/icons-material/Refresh';
import SettingsIcon from '@mui/icons-material/Settings';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useDevices } from '../hooks/useCards';

// Config Dialog Component
function ConfigDialog({ open, device, onClose, onSave }) {
  const [relayOpenMs, setRelayOpenMs] = useState(device?.config?.relay_open_ms || 3000);
  const [offlineEnabled, setOfflineEnabled] = useState(device?.config?.offline_mode?.enabled || false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(device.device_id, {
        relay_open_ms: relayOpenMs,
        offline_mode: {
          enabled: offlineEnabled,
        },
      });
      onClose();
    } catch (err) {
      console.error('Save config error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ background: '#1e293b', color: '#f1f5f9' }}>
        Cấu hình thiết bị
      </DialogTitle>
      <DialogContent sx={{ background: '#1e293b', pt: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>
            Device ID: <strong style={{ color: '#818cf8' }}>{device?.device_id}</strong>
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            Door ID: <strong style={{ color: '#f1f5f9' }}>{device?.door_id}</strong>
          </Typography>
        </Box>

        <TextField
          fullWidth
          label="Thời gian mở relay (ms)"
          type="number"
          value={relayOpenMs}
          onChange={(e) => setRelayOpenMs(parseInt(e.target.value) || 3000)}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              color: '#f1f5f9',
              '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
            },
            '& .MuiInputLabel-root': { color: '#94a3b8' },
          }}
          inputProps={{ min: 500, max: 10000 }}
          helperText="500 - 10000 ms"
        />

        <FormControlLabel
          control={
            <Switch
              checked={offlineEnabled}
              onChange={(e) => setOfflineEnabled(e.target.checked)}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': { color: '#818cf8' },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#818cf8' },
              }}
            />
          }
          label="Cho phép chế độ offline"
          sx={{ color: '#f1f5f9' }}
        />
        <Typography variant="caption" sx={{ display: 'block', color: '#94a3b8', mt: 0.5 }}>
          Khi bật, thiết bị có thể xác thực thẻ khi mất kết nối với server
        </Typography>
      </DialogContent>
      <DialogActions sx={{ background: '#1e293b', p: 2 }}>
        <Button onClick={onClose} sx={{ color: '#94a3b8' }}>
          Hủy
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loading}
          sx={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            '&:hover': { background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' },
          }}
        >
          {loading ? <CircularProgress size={20} /> : 'Lưu cấu hình'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Device Row Component
function DeviceRow({ device, onConfig }) {
  const isOnline = device.online;
  const lastHeartbeat = device.last_heartbeat_at
    ? new Date(device.last_heartbeat_at).toLocaleString('vi-VN')
    : 'Chưa có';

  return (
    <TableRow sx={{ '&:hover': { background: 'rgba(255,255,255,0.02)' } }}>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isOnline ? (
            <WifiIcon sx={{ color: '#34d399', fontSize: 20 }} />
          ) : (
            <WifiOffIcon sx={{ color: '#f87171', fontSize: 20 }} />
          )}
          <Typography sx={{ color: '#818cf8', fontFamily: 'monospace' }}>
            {device.device_id}
          </Typography>
        </Box>
      </TableCell>
      <TableCell sx={{ color: '#f1f5f9' }}>{device.door_id || '-'}</TableCell>
      <TableCell sx={{ color: '#94a3b8' }}>{device.hardware_type || '-'}</TableCell>
      <TableCell sx={{ color: '#94a3b8' }}>{device.firmware_version || '-'}</TableCell>
      <TableCell>
        <Chip
          label={isOnline ? 'Online' : 'Offline'}
          size="small"
          sx={{
            background: isOnline ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            color: isOnline ? '#34d399' : '#f87171',
            border: `1px solid ${isOnline ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
          }}
        />
      </TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#94a3b8' }}>
          <AccessTimeIcon sx={{ fontSize: 14 }} />
          <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
            {lastHeartbeat}
          </Typography>
        </Box>
      </TableCell>
      <TableCell>
        <Tooltip title="Cấu hình">
          <IconButton
            size="small"
            onClick={() => onConfig(device)}
            sx={{ color: '#818cf8', '&:hover': { background: 'rgba(99, 102, 241, 0.1)' } }}
          >
            <SettingsIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}

export default function Devices() {
  const { devices, onlineDevices, offlineDevices, loading, error, fetchDevices, updateConfig } = useDevices();
  const [configDialog, setConfigDialog] = useState({ open: false, device: null });

  const handleConfig = (device) => {
    setConfigDialog({ open: true, device });
  };

  const handleSaveConfig = async (deviceId, config) => {
    await updateConfig(deviceId, config);
  };

  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Header */}
      <Box sx={{ mb: { xs: 2, sm: 4 } }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#f1f5f9',
            mb: 0.5,
            fontSize: { xs: '1.5rem', sm: '2rem' },
          }}
        >
          Quản lý thiết bị
        </Typography>
        <Typography variant="body1" sx={{ color: '#94a3b8', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
          Giám sát và cấu hình các đầu đọc NFC (ESP32)
        </Typography>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
          }}
        >
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={4}>
          <Card sx={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(99, 102, 241, 0.05))', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" sx={{ color: '#818cf8', fontWeight: 700 }}>{devices.length}</Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>Tổng thiết bị</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card sx={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.05))', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" sx={{ color: '#34d399', fontWeight: 700 }}>{onlineDevices.length}</Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>Online</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card sx={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.05))', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" sx={{ color: '#f87171', fontWeight: 700 }}>{offlineDevices.length}</Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>Offline</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: { xs: 3, sm: 4 },
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Header with refresh */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                p: 1,
                borderRadius: 2,
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(99, 102, 241, 0.1))',
              }}
            >
              <RouterIcon sx={{ color: '#818cf8' }} />
            </Box>
            <Typography variant="h6" sx={{ color: '#f1f5f9', fontWeight: 600 }}>
              Danh sách thiết bị
            </Typography>
          </Box>
          <IconButton onClick={() => fetchDevices()} sx={{ color: '#818cf8' }}>
            <RefreshIcon />
          </IconButton>
        </Box>

        {/* Table */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: '#818cf8' }} />
          </Box>
        ) : devices.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4, color: '#94a3b8' }}>
            <RouterIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
            <Typography>Chưa có thiết bị nào được đăng ký</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Thiết bị ESP32 sẽ tự động xuất hiện sau khi gọi API /device/register
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Device ID</TableCell>
                  <TableCell sx={{ color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Door ID</TableCell>
                  <TableCell sx={{ color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Hardware</TableCell>
                  <TableCell sx={{ color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Firmware</TableCell>
                  <TableCell sx={{ color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Trạng thái</TableCell>
                  <TableCell sx={{ color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Heartbeat</TableCell>
                  <TableCell sx={{ color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {devices.map((device) => (
                  <DeviceRow
                    key={device.device_id}
                    device={device}
                    onConfig={handleConfig}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Config Dialog */}
      {configDialog.device && (
        <ConfigDialog
          open={configDialog.open}
          device={configDialog.device}
          onClose={() => setConfigDialog({ open: false, device: null })}
          onSave={handleSaveConfig}
        />
      )}
    </Box>
  );
}
