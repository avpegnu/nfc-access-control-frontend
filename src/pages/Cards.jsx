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
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BlockIcon from '@mui/icons-material/Block';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CancelIcon from '@mui/icons-material/Cancel';
import { useCards } from '../hooks/useCards';
import { useUsers } from '../hooks/useUsers';

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

// Assign User Dialog
function AssignUserDialog({ open, card, users, onClose, onAssign }) {
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
      <DialogTitle sx={{ background: '#1e293b', color: '#f1f5f9' }}>
        Gán người dùng cho thẻ
      </DialogTitle>
      <DialogContent sx={{ background: '#1e293b', pt: 2 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>
            Card ID: <strong style={{ color: '#818cf8' }}>{card?.card_id}</strong>
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            Card UID: <strong style={{ color: '#f1f5f9' }}>{card?.card_uid}</strong>
          </Typography>
        </Box>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel sx={{ color: '#94a3b8' }}>Chọn người dùng</InputLabel>
          <Select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            label="Chọn người dùng"
            sx={{
              color: '#f1f5f9',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
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
          <InputLabel sx={{ color: '#94a3b8' }}>Quyền truy cập</InputLabel>
          <Select
            value={accessLevel}
            onChange={(e) => setAccessLevel(e.target.value)}
            label="Quyền truy cập"
            sx={{
              color: '#f1f5f9',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
            }}
          >
            <MenuItem value="guest">Khách (Guest)</MenuItem>
            <MenuItem value="staff">Nhân viên (Staff)</MenuItem>
            <MenuItem value="manager">Quản lý (Manager)</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ background: '#1e293b', p: 2 }}>
        <Button onClick={onClose} sx={{ color: '#94a3b8' }}>
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
function CardRow({ card, users, onAssign, onRevoke, onDelete }) {
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
    <TableRow sx={{ '&:hover': { background: 'rgba(255,255,255,0.02)' } }}>
      <TableCell sx={{ color: '#818cf8', fontFamily: 'monospace', fontSize: '0.8rem' }}>
        {card.card_id}
      </TableCell>
      <TableCell sx={{ color: '#f1f5f9', fontFamily: 'monospace', fontSize: '0.8rem' }}>
        {card.card_uid}
      </TableCell>
      <TableCell sx={{ color: '#f1f5f9' }}>
        {user ? user.name : <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Chưa gán</span>}
      </TableCell>
      <TableCell>
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
      <TableCell>{getStatusChip()}</TableCell>
      <TableCell>
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
  const { cards, pendingCards, activeCards, revokedCards, loading, error, fetchCards, assignUser, revokeCard, deleteCard } = useCards();
  const { users } = useUsers();
  const [tabValue, setTabValue] = useState(0);
  const [assignDialog, setAssignDialog] = useState({ open: false, card: null });

  const handleAssign = (card) => {
    setAssignDialog({ open: true, card });
  };

  const handleAssignSubmit = async (cardId, userId, policy) => {
    await assignUser(cardId, userId, policy);
  };

  const handleRevoke = async (cardId) => {
    if (window.confirm('Bạn có chắc muốn thu hồi thẻ này?')) {
      await revokeCard(cardId, 'Admin revoked');
    }
  };

  const handleDelete = async (cardId) => {
    if (window.confirm('Bạn có chắc muốn xóa thẻ này? Hành động này không thể hoàn tác.')) {
      await deleteCard(cardId);
    }
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
            color: '#f1f5f9',
            mb: 0.5,
            fontSize: { xs: '1.5rem', sm: '2rem' },
          }}
        >
          Quản lý thẻ NFC
        </Typography>
        <Typography variant="body1" sx={{ color: '#94a3b8', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
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
              <CreditCardIcon sx={{ color: '#818cf8' }} />
            </Box>
            <Typography variant="h6" sx={{ color: '#f1f5f9', fontWeight: 600 }}>
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

        {/* Table */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: '#818cf8' }} />
          </Box>
        ) : getDisplayCards().length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4, color: '#94a3b8' }}>
            <CreditCardIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
            <Typography>Không có thẻ nào</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Quẹt thẻ NFC trắng vào đầu đọc để thêm thẻ mới
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Card ID</TableCell>
                  <TableCell sx={{ color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Card UID</TableCell>
                  <TableCell sx={{ color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Người dùng</TableCell>
                  <TableCell sx={{ color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Quyền</TableCell>
                  <TableCell sx={{ color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Trạng thái</TableCell>
                  <TableCell sx={{ color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Thao tác</TableCell>
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
                    onDelete={handleDelete}
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
      />
    </Box>
  );
}
