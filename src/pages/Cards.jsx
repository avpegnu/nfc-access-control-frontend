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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Tooltip,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonIcon from '@mui/icons-material/Person';
import BlockIcon from '@mui/icons-material/Block';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CancelIcon from '@mui/icons-material/Cancel';
import RestoreIcon from '@mui/icons-material/Restore';
import { useCards } from '../hooks/useCards';
import { useUsers } from '../hooks/useUsers';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useThemeMode } from '../contexts/ThemeContext';

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

// Mobile Card Component
function MobileCardItem({ card, user, onAssign, onRevoke, onReactivate, onDelete, colors }) {
  const getStatusConfig = () => {
    if (card.status === 'revoked') {
      return { icon: <CancelIcon sx={{ fontSize: 14 }} />, label: 'Đã thu hồi', color: '#f87171', bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.3)' };
    }
    if (card.enroll_mode) {
      return { icon: <HourglassEmptyIcon sx={{ fontSize: 14 }} />, label: 'Chờ gán', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.15)', border: 'rgba(251, 191, 36, 0.3)' };
    }
    return { icon: <CheckCircleIcon sx={{ fontSize: 14 }} />, label: 'Hoạt động', color: '#34d399', bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.3)' };
  };

  const statusConfig = getStatusConfig();

  return (
    <Box
      sx={{
        p: 2,
        mb: 1.5,
        borderRadius: 2,
        background: colors.bgHover,
        border: `1px solid ${colors.borderLight}`,
        transition: 'all 0.2s ease',
      }}
    >
      {/* Header: Card UID */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
        <Box>
          <Typography
            variant="body2"
            sx={{
              color: colors.textPrimary,
              fontFamily: 'monospace',
              fontWeight: 600,
              fontSize: '0.85rem',
            }}
          >
            {card.card_uid}
          </Typography>
          <Typography variant="caption" sx={{ color: colors.textSecondary, fontSize: '0.65rem' }}>
            {card.card_id}
          </Typography>
        </Box>
      </Box>

      {/* Info Row: User + Access Level */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, flexWrap: 'wrap' }}>
        <Typography variant="caption" sx={{ color: user ? colors.textPrimary : colors.textSecondary, fontStyle: user ? 'normal' : 'italic', fontSize: '0.75rem' }}>
          {user ? user.name : 'Chưa gán'}
        </Typography>
        {card.policy?.access_level && (
          <Chip
            label={card.policy.access_level}
            size="small"
            sx={{
              height: 20,
              background: 'rgba(99, 102, 241, 0.15)',
              color: '#818cf8',
              textTransform: 'capitalize',
              fontSize: '0.65rem',
            }}
          />
        )}
      </Box>

      {/* Bottom Row: Status + Actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Status Chip */}
        <Chip
          icon={statusConfig.icon}
          label={statusConfig.label}
          size="small"
          sx={{
            height: 24,
            background: statusConfig.bg,
            color: statusConfig.color,
            border: `1px solid ${statusConfig.border}`,
            fontSize: '0.7rem',
            '& .MuiChip-icon': { color: 'inherit' },
          }}
        />

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {card.enroll_mode && card.status === 'active' && (
            <IconButton
              size="small"
              onClick={() => onAssign(card)}
              sx={{ color: '#818cf8', p: 0.5, '&:hover': { background: 'rgba(99, 102, 241, 0.1)' } }}
            >
              <PersonAddIcon sx={{ fontSize: 18 }} />
            </IconButton>
          )}
          {card.status === 'active' && !card.enroll_mode && (
            <IconButton
              size="small"
              onClick={() => onRevoke(card.card_id)}
              sx={{ color: '#fbbf24', p: 0.5, '&:hover': { background: 'rgba(251, 191, 36, 0.1)' } }}
            >
              <BlockIcon sx={{ fontSize: 18 }} />
            </IconButton>
          )}
          {card.status === 'revoked' && (
            <IconButton
              size="small"
              onClick={() => onReactivate(card.card_id)}
              sx={{ color: '#34d399', p: 0.5, '&:hover': { background: 'rgba(16, 185, 129, 0.1)' } }}
            >
              <RestoreIcon sx={{ fontSize: 18 }} />
            </IconButton>
          )}
          <IconButton
            size="small"
            onClick={() => onDelete(card.card_id)}
            sx={{ color: '#f87171', p: 0.5, '&:hover': { background: 'rgba(239, 68, 68, 0.1)' } }}
          >
            <DeleteIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

// Assign User Dialog
function AssignUserDialog({ open, card, users, onClose, onAssign, colors }) {
  const [selectedUser, setSelectedUser] = useState('');
  const [accessLevel, setAccessLevel] = useState('staff');
  const [loading, setLoading] = useState(false);

  const handleAssign = async () => {
    if (!selectedUser) return;
    setLoading(true);
    try {
      await onAssign(card.card_id, selectedUser, { access_level: accessLevel });
      onClose();
    } catch (err) {
      console.error('Assign error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ background: colors.bgSecondary, color: colors.textPrimary }}>
        Gán người dùng cho thẻ
      </DialogTitle>
      <DialogContent sx={{ background: colors.bgSecondary, pt: 2 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 1 }}>
            Card ID: <strong style={{ color: '#818cf8' }}>{card?.card_id}</strong>
          </Typography>
          <Typography variant="body2" sx={{ color: colors.textSecondary }}>
            Card UID: <strong style={{ color: colors.textPrimary }}>{card?.card_uid}</strong>
          </Typography>
        </Box>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel sx={{ color: colors.textSecondary }}>Chọn người dùng</InputLabel>
          <Select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            label="Chọn người dùng"
            sx={{
              color: colors.textPrimary,
              '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.border },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: colors.borderLight },
            }}
          >
            {users.filter(u => u.isActive).map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name} ({user.email || 'No email'})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel sx={{ color: colors.textSecondary }}>Quyền truy cập</InputLabel>
          <Select
            value={accessLevel}
            onChange={(e) => setAccessLevel(e.target.value)}
            label="Quyền truy cập"
            sx={{
              color: colors.textPrimary,
              '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.border },
            }}
          >
            <MenuItem value="guest">Khách (Guest)</MenuItem>
            <MenuItem value="staff">Nhân viên (Staff)</MenuItem>
            <MenuItem value="manager">Quản lý (Manager)</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ background: colors.bgSecondary, p: 2 }}>
        <Button onClick={onClose} sx={{ color: colors.textSecondary }}>
          Hủy
        </Button>
        <Button
          onClick={handleAssign}
          variant="contained"
          disabled={!selectedUser || loading}
          sx={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            '&:hover': { background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' },
          }}
        >
          {loading ? <CircularProgress size={20} /> : 'Gán người dùng'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Card Row Component
function CardRow({ card, users, onAssign, onRevoke, onReactivate, onDelete, colors }) {
  const user = users.find(u => u.id === card.user_id);

  const getStatusChip = () => {
    if (card.status === 'revoked') {
      return (
        <Chip
          icon={<CancelIcon sx={{ fontSize: 14 }} />}
          label="Đã thu hồi"
          size="small"
          sx={{
            background: 'rgba(239, 68, 68, 0.15)',
            color: '#f87171',
            border: '1px solid rgba(239, 68, 68, 0.3)',
          }}
        />
      );
    }
    if (card.enroll_mode) {
      return (
        <Chip
          icon={<HourglassEmptyIcon sx={{ fontSize: 14 }} />}
          label="Chờ gán"
          size="small"
          sx={{
            background: 'rgba(251, 191, 36, 0.15)',
            color: '#fbbf24',
            border: '1px solid rgba(251, 191, 36, 0.3)',
          }}
        />
      );
    }
    return (
      <Chip
        icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
        label="Hoạt động"
        size="small"
        sx={{
          background: 'rgba(16, 185, 129, 0.15)',
          color: '#34d399',
          border: '1px solid rgba(16, 185, 129, 0.3)',
        }}
      />
    );
  };

  return (
    <TableRow sx={{ '&:hover': { background: colors.bgHover } }}>
      <TableCell sx={{ color: '#818cf8', fontFamily: 'monospace', fontSize: '0.8rem', borderBottom: `1px solid ${colors.borderLight}` }}>
        {card.card_id}
      </TableCell>
      <TableCell sx={{ color: colors.textPrimary, fontFamily: 'monospace', fontSize: '0.8rem', borderBottom: `1px solid ${colors.borderLight}` }}>
        {card.card_uid}
      </TableCell>
      <TableCell sx={{ color: colors.textPrimary, borderBottom: `1px solid ${colors.borderLight}` }}>
        {user ? user.name : <span style={{ color: colors.textSecondary, fontStyle: 'italic' }}>Chưa gán</span>}
      </TableCell>
      <TableCell sx={{ borderBottom: `1px solid ${colors.borderLight}` }}>
        {card.policy?.access_level && (
          <Chip
            label={card.policy.access_level}
            size="small"
            sx={{
              background: 'rgba(99, 102, 241, 0.15)',
              color: '#818cf8',
              textTransform: 'capitalize',
            }}
          />
        )}
      </TableCell>
      <TableCell sx={{ borderBottom: `1px solid ${colors.borderLight}` }}>{getStatusChip()}</TableCell>
      <TableCell sx={{ borderBottom: `1px solid ${colors.borderLight}` }}>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {card.enroll_mode && card.status === 'active' && (
            <Tooltip title="Gán người dùng">
              <IconButton
                size="small"
                onClick={() => onAssign(card)}
                sx={{ color: '#818cf8', '&:hover': { background: 'rgba(99, 102, 241, 0.1)' } }}
              >
                <PersonAddIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {card.status === 'active' && !card.enroll_mode && (
            <Tooltip title="Thu hồi thẻ">
              <IconButton
                size="small"
                onClick={() => onRevoke(card.card_id)}
                sx={{ color: '#fbbf24', '&:hover': { background: 'rgba(251, 191, 36, 0.1)' } }}
              >
                <BlockIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {card.status === 'revoked' && (
            <Tooltip title="Kích hoạt lại thẻ">
              <IconButton
                size="small"
                onClick={() => onReactivate(card.card_id)}
                sx={{ color: '#34d399', '&:hover': { background: 'rgba(16, 185, 129, 0.1)' } }}
              >
                <RestoreIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Xóa thẻ">
            <IconButton
              size="small"
              onClick={() => onDelete(card.card_id)}
              sx={{ color: '#f87171', '&:hover': { background: 'rgba(239, 68, 68, 0.1)' } }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </TableCell>
    </TableRow>
  );
}

export default function Cards() {
  const { cards, pendingCards, activeCards, revokedCards, loading, error, fetchCards, assignUser, revokeCard, reactivateCard, deleteCard } = useCards();
  const { users } = useUsers();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { colors } = useThemeMode();
  const [tabValue, setTabValue] = useState(0);
  const [assignDialog, setAssignDialog] = useState({ open: false, card: null });
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: 'warning',
    title: '',
    message: '',
    onConfirm: null,
  });
  const [actionLoading, setActionLoading] = useState(false);

  const handleAssign = (card) => {
    setAssignDialog({ open: true, card });
  };

  const handleAssignSubmit = async (cardId, userId, policy) => {
    await assignUser(cardId, userId, policy);
  };

  const handleRevoke = (cardId) => {
    setConfirmDialog({
      open: true,
      type: 'block',
      title: 'Thu hồi thẻ',
      message: 'Bạn có chắc muốn thu hồi thẻ này? Người dùng sẽ không thể sử dụng thẻ để vào cửa sau khi thu hồi.',
      onConfirm: async () => {
        setActionLoading(true);
        try {
          await revokeCard(cardId, 'Admin revoked');
        } finally {
          setActionLoading(false);
          setConfirmDialog(prev => ({ ...prev, open: false }));
        }
      },
    });
  };

  const handleReactivate = (cardId) => {
    setConfirmDialog({
      open: true,
      type: 'restore',
      title: 'Kích hoạt lại thẻ',
      message: 'Bạn có chắc muốn kích hoạt lại thẻ này? Thẻ sẽ hoạt động trở lại và người dùng có thể sử dụng để vào cửa.',
      onConfirm: async () => {
        setActionLoading(true);
        try {
          await reactivateCard(cardId);
        } finally {
          setActionLoading(false);
          setConfirmDialog(prev => ({ ...prev, open: false }));
        }
      },
    });
  };

  const handleDelete = (cardId) => {
    setConfirmDialog({
      open: true,
      type: 'danger',
      title: 'Xóa thẻ',
      message: 'Bạn có chắc muốn xóa thẻ này? Hành động này không thể hoàn tác và tất cả dữ liệu liên quan sẽ bị mất.',
      onConfirm: async () => {
        setActionLoading(true);
        try {
          await deleteCard(cardId);
        } finally {
          setActionLoading(false);
          setConfirmDialog(prev => ({ ...prev, open: false }));
        }
      },
    });
  };

  const getDisplayCards = () => {
    switch (tabValue) {
      case 0:
        return cards;
      case 1:
        return pendingCards;
      case 2:
        return activeCards;
      case 3:
        return revokedCards;
      default:
        return cards;
    }
  };

  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Header */}
      <Box sx={{ mb: { xs: 2, sm: 4 } }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: colors.textPrimary,
            mb: 0.5,
            fontSize: { xs: '1.5rem', sm: '2rem' },
          }}
        >
          Quản lý thẻ NFC
        </Typography>
        <Typography variant="body1" sx={{ color: colors.textSecondary, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
          Quản lý và gán người dùng cho các thẻ NFC trong hệ thống
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
        <Grid item xs={6} sm={3}>
          <Card sx={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(99, 102, 241, 0.05))', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" sx={{ color: '#818cf8', fontWeight: 700 }}>{cards.length}</Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>Tổng thẻ</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(251, 191, 36, 0.05))', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" sx={{ color: '#fbbf24', fontWeight: 700 }}>{pendingCards.length}</Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>Chờ gán</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.05))', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" sx={{ color: '#34d399', fontWeight: 700 }}>{activeCards.length}</Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>Hoạt động</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.05))', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" sx={{ color: '#f87171', fontWeight: 700 }}>{revokedCards.length}</Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>Thu hồi</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: { xs: 3, sm: 4 },
          background: colors.bgCard,
          border: `1px solid ${colors.border}`,
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
              <CreditCardIcon sx={{ color: '#818cf8' }} />
            </Box>
            <Typography variant="h6" sx={{ color: colors.textPrimary, fontWeight: 600 }}>
              Danh sách thẻ
            </Typography>
          </Box>
          <IconButton onClick={() => fetchCards()} sx={{ color: '#818cf8' }}>
            <RefreshIcon />
          </IconButton>
        </Box>

        {/* Tabs */}
        <Tabs
          value={tabValue}
          onChange={(_, v) => setTabValue(v)}
          sx={{
            mb: 2,
            '& .MuiTab-root': { color: '#94a3b8', minWidth: 'auto', px: 2 },
            '& .Mui-selected': { color: '#818cf8' },
            '& .MuiTabs-indicator': { backgroundColor: '#818cf8' },
          }}
        >
          <Tab label={`Tất cả (${cards.length})`} />
          <Tab label={`Chờ gán (${pendingCards.length})`} />
          <Tab label={`Hoạt động (${activeCards.length})`} />
          <Tab label={`Thu hồi (${revokedCards.length})`} />
        </Tabs>

        {/* Content */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: '#818cf8' }} />
          </Box>
        ) : getDisplayCards().length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4, color: colors.textSecondary }}>
            <CreditCardIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
            <Typography>Không có thẻ nào</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Quẹt thẻ NFC trắng vào đầu đọc để thêm thẻ mới
            </Typography>
          </Box>
        ) : isMobile ? (
          /* Mobile Card View */
          <Box>
            {getDisplayCards().map((card) => (
              <MobileCardItem
                key={card.card_id}
                card={card}
                user={users.find(u => u.id === card.user_id)}
                onAssign={handleAssign}
                onRevoke={handleRevoke}
                onReactivate={handleReactivate}
                onDelete={handleDelete}
                colors={colors}
              />
            ))}
          </Box>
        ) : (
          /* Desktop Table View */
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: colors.textSecondary, borderBottom: `1px solid ${colors.border}` }}>Card ID</TableCell>
                  <TableCell sx={{ color: colors.textSecondary, borderBottom: `1px solid ${colors.border}` }}>Card UID</TableCell>
                  <TableCell sx={{ color: colors.textSecondary, borderBottom: `1px solid ${colors.border}` }}>Người dùng</TableCell>
                  <TableCell sx={{ color: colors.textSecondary, borderBottom: `1px solid ${colors.border}` }}>Quyền</TableCell>
                  <TableCell sx={{ color: colors.textSecondary, borderBottom: `1px solid ${colors.border}` }}>Trạng thái</TableCell>
                  <TableCell sx={{ color: colors.textSecondary, borderBottom: `1px solid ${colors.border}` }}>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getDisplayCards().map((card) => (
                  <CardRow
                    key={card.card_id}
                    card={card}
                    users={users}
                    onAssign={handleAssign}
                    onRevoke={handleRevoke}
                    onReactivate={handleReactivate}
                    onDelete={handleDelete}
                    colors={colors}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Assign Dialog */}
      <AssignUserDialog
        open={assignDialog.open}
        card={assignDialog.card}
        users={users}
        onClose={() => setAssignDialog({ open: false, card: null })}
        onAssign={handleAssignSubmit}
        colors={colors}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        type={confirmDialog.type}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.type === 'danger' ? 'Xóa' : confirmDialog.type === 'restore' ? 'Kích hoạt' : 'Thu hồi'}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
        loading={actionLoading}
      />
    </Box>
  );
}
