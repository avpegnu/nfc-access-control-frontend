import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import RestoreIcon from '@mui/icons-material/Restore';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const iconMap = {
  warning: { icon: WarningAmberIcon, color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.15)' },
  danger: { icon: DeleteIcon, color: '#f87171', bg: 'rgba(239, 68, 68, 0.15)' },
  block: { icon: BlockIcon, color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.15)' },
  restore: { icon: RestoreIcon, color: '#34d399', bg: 'rgba(16, 185, 129, 0.15)' },
  info: { icon: HelpOutlineIcon, color: '#818cf8', bg: 'rgba(99, 102, 241, 0.15)' },
};

export default function ConfirmDialog({
  open,
  title = 'Xác nhận',
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  type = 'warning', // warning, danger, block, restore, info
  onConfirm,
  onCancel,
  loading = false,
}) {
  const iconConfig = iconMap[type] || iconMap.warning;
  const IconComponent = iconConfig.icon;

  const getConfirmButtonStyle = () => {
    switch (type) {
      case 'danger':
        return {
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          '&:hover': { background: 'linear-gradient(135deg, #dc2626, #b91c1c)' },
        };
      case 'restore':
        return {
          background: 'linear-gradient(135deg, #10b981, #059669)',
          '&:hover': { background: 'linear-gradient(135deg, #059669, #047857)' },
        };
      case 'block':
        return {
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          '&:hover': { background: 'linear-gradient(135deg, #d97706, #b45309)' },
        };
      default:
        return {
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          '&:hover': { background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' },
        };
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#f1f5f9',
          pb: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              background: iconConfig.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconComponent sx={{ color: iconConfig.color, fontSize: 24 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
        <IconButton onClick={onCancel} size="small" sx={{ color: '#94a3b8' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Typography
          sx={{
            color: '#94a3b8',
            lineHeight: 1.6,
            mt: 1,
          }}
        >
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1, gap: 1 }}>
        <Button
          onClick={onCancel}
          disabled={loading}
          sx={{
            color: '#94a3b8',
            px: 3,
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.05)',
            },
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          disabled={loading}
          sx={{
            px: 3,
            ...getConfirmButtonStyle(),
          }}
        >
          {loading ? 'Đang xử lý...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
