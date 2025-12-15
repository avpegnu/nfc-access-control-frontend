import { useState } from 'react';
import { Box, Typography, Grid, Alert, Chip } from '@mui/material';
import UserList from '../components/users/UserList';
import AddUserForm from '../components/users/AddUserForm';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useUsers } from '../hooks/useUsers';
import PeopleIcon from '@mui/icons-material/People';
import GroupIcon from '@mui/icons-material/Group';

export default function Users() {
  const { users, loading, error, addUser, deleteUser, toggleUserActive } = useUsers();
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: 'warning',
    title: '',
    message: '',
    onConfirm: null,
  });
  const [actionLoading, setActionLoading] = useState(false);

  const activeUsers = users.filter(u => u.isActive).length;

  const handleDeleteUser = (userId, userName) => {
    setConfirmDialog({
      open: true,
      type: 'danger',
      title: 'Xóa người dùng',
      message: `Bạn có chắc muốn xóa "${userName}"? Hành động này không thể hoàn tác.`,
      onConfirm: async () => {
        setActionLoading(true);
        try {
          await deleteUser(userId);
        } finally {
          setActionLoading(false);
          setConfirmDialog(prev => ({ ...prev, open: false }));
        }
      },
    });
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
          Quản lý người dùng
        </Typography>
        <Typography variant="body1" sx={{ color: '#94a3b8', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
          Đăng ký và quản lý thẻ NFC cho người dùng trong hệ thống
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
            '& .MuiAlert-icon': {
              color: '#f87171',
            },
          }}
        >
          Lỗi: {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        {/* Add User Form - Left Side */}
        <Grid item xs={12} md={3} sx={{maxWidth: "600px"}}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <AddUserForm onAdd={addUser} />
          </Box>
        </Grid>

        {/* User List - Right Side */}
        <Grid item xs={12} md={9}>
          <Box
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: { xs: 2, sm: 4 },
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              height: '100%',
            }}
          >
            {/* Section Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: { xs: 2, sm: 3 }, flexWrap: 'wrap', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
                <Box
                  sx={{
                    p: { xs: 0.75, sm: 1 },
                    borderRadius: { xs: 1.5, sm: 2 },
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(99, 102, 241, 0.1))',
                    display: 'flex',
                  }}
                >
                  <PeopleIcon sx={{ color: '#818cf8', fontSize: { xs: 20, sm: 24 } }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ color: '#f1f5f9', fontWeight: 600, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                    Danh sách người dùng
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                    Tất cả thẻ NFC đã đăng ký
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip
                  icon={<GroupIcon sx={{ fontSize: 16 }} />}
                  label={`${users.length}`}
                  size="small"
                  sx={{
                    background: 'rgba(99, 102, 241, 0.15)',
                    color: '#818cf8',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    fontWeight: 500,
                    '& .MuiChip-icon': {
                      color: 'inherit',
                    },
                  }}
                />
                <Chip
                  label={`${activeUsers}`}
                  size="small"
                  sx={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#34d399',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    fontWeight: 500,
                  }}
                />
              </Box>
            </Box>

            {/* User Table */}
            <UserList
              users={users}
              loading={loading}
              onDelete={handleDeleteUser}
              onToggleActive={toggleUserActive}
            />
          </Box>
        </Grid>
      </Grid>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        type={confirmDialog.type}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Xóa"
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
        loading={actionLoading}
      />
    </Box>
  );
}
