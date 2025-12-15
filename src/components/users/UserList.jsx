import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Typography,
  Box,
  Tooltip,
  Switch,
  Avatar,
  Skeleton,
  TablePagination,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useThemeMode } from '../../contexts/ThemeContext';

// Mobile Card Component
function MobileUserCard({ user, onDelete, onToggleActive, colors }) {
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
      {/* Row 1: User Info */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
        <Avatar
          sx={{
            width: 36,
            height: 36,
            background: user.role === 'admin'
              ? 'linear-gradient(135deg, #ec4899, #db2777)'
              : 'linear-gradient(135deg, #6366f1, #4f46e5)',
            fontSize: '0.75rem',
          }}
        >
          {user.role === 'admin' ? (
            <AdminPanelSettingsIcon sx={{ fontSize: 18 }} />
          ) : (
            user.name ? user.name.charAt(0).toUpperCase() : <PersonIcon sx={{ fontSize: 18 }} />
          )}
        </Avatar>
        <Box>
          <Typography variant="body2" sx={{ color: colors.textPrimary, fontWeight: 500, fontSize: '0.875rem' }}>
            {user.name}
          </Typography>
          <Typography variant="caption" sx={{ color: colors.textSecondary, fontSize: '0.7rem' }}>
            {user.email || 'Chưa có email'}
          </Typography>
        </Box>
      </Box>

      {/* Row 2: Card UID + Role + Date */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
        {/* Card UID */}
        {user.cardUid ? (
          <Box
            sx={{
              display: 'inline-block',
              px: 1,
              py: 0.25,
              borderRadius: 1,
              background: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: '#818cf8',
                fontFamily: 'monospace',
                fontWeight: 600,
                fontSize: '0.7rem',
              }}
            >
              {user.cardUid}
            </Typography>
          </Box>
        ) : (
          <Typography variant="caption" sx={{ color: colors.textSecondary, fontStyle: 'italic', fontSize: '0.7rem' }}>
            Chưa có thẻ
          </Typography>
        )}

        {/* Role */}
        <Chip
          icon={user.role === 'admin' ? <AdminPanelSettingsIcon sx={{ fontSize: 12 }} /> : <PersonIcon sx={{ fontSize: 12 }} />}
          label={user.role === 'admin' ? 'Admin' : 'User'}
          size="small"
          sx={{
            height: 22,
            background: user.role === 'admin'
              ? 'rgba(236, 72, 153, 0.15)'
              : 'rgba(99, 102, 241, 0.15)',
            color: user.role === 'admin' ? '#f472b6' : '#818cf8',
            border: `1px solid ${user.role === 'admin' ? 'rgba(236, 72, 153, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`,
            fontWeight: 500,
            fontSize: '0.65rem',
            '& .MuiChip-icon': {
              color: 'inherit',
            },
          }}
        />

        {/* Date */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <CalendarTodayIcon sx={{ fontSize: 12, color: colors.textSecondary }} />
          <Typography variant="caption" sx={{ color: colors.textSecondary, fontSize: '0.7rem' }}>
            {user.createdAt ? dayjs(user.createdAt).format('DD/MM/YY') : '-'}
          </Typography>
        </Box>
      </Box>

      {/* Row 3: Actions (Switch + Delete) */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Switch
          checked={user.isActive}
          onChange={() => onToggleActive(user.id, user.isActive)}
          size="small"
          sx={{
            '& .MuiSwitch-switchBase.Mui-checked': {
              color: '#10b981',
            },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
              backgroundColor: '#10b981',
            },
          }}
        />
        <IconButton
          size="small"
          onClick={() => onDelete(user.id, user.name)}
          sx={{
            color: '#f87171',
            p: 0.5,
            '&:hover': {
              background: 'rgba(239, 68, 68, 0.15)',
            },
          }}
        >
          <DeleteIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>
    </Box>
  );
}

export default function UserList({ users, loading, onDelete, onToggleActive }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { colors, isDark } = useThemeMode();

  if (loading) {
    return (
      <Box>
        {[1, 2, 3, 4, 5].map((i) => (
          <Box
            key={i}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 2,
              borderBottom: `1px solid ${colors.borderLight}`,
            }}
          >
            <Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
              <Skeleton variant="text" width="40%" sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
            </Box>
            <Skeleton variant="rounded" width={60} height={24} sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
          </Box>
        ))}
      </Box>
    );
  }

  if (!users || users.length === 0) {
    return (
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <HelpOutlineIcon sx={{ fontSize: 48, color: colors.textSecondary, mb: 2 }} />
        <Typography sx={{ color: colors.textSecondary }}>
          Chưa có người dùng nào
        </Typography>
      </Box>
    );
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedUsers = users.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Mobile view - Card layout
  if (isMobile) {
    return (
      <Box>
        {paginatedUsers.map((user) => (
          <MobileUserCard
            key={user.id}
            user={user}
            onDelete={onDelete}
            onToggleActive={onToggleActive}
            colors={colors}
          />
        ))}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage=""
          sx={{
            color: colors.textSecondary,
            borderTop: `1px solid ${colors.border}`,
            '& .MuiTablePagination-selectLabel': {
              display: 'none',
            },
            '& .MuiTablePagination-select': {
              display: 'none',
            },
            '& .MuiTablePagination-selectIcon': {
              display: 'none',
            },
            '& .MuiIconButton-root': {
              color: colors.textSecondary,
            },
            '& .MuiTablePagination-displayedRows': {
              fontSize: '0.75rem',
            },
          }}
        />
      </Box>
    );
  }

  // Desktop view - Table layout
  return (
    <Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: colors.textSecondary, fontWeight: 600, borderBottom: `1px solid ${colors.border}` }}>
                Người dùng
              </TableCell>
              <TableCell sx={{ color: colors.textSecondary, fontWeight: 600, borderBottom: `1px solid ${colors.border}` }}>
                UID Thẻ
              </TableCell>
              <TableCell sx={{ color: colors.textSecondary, fontWeight: 600, borderBottom: `1px solid ${colors.border}` }}>
                Vai trò
              </TableCell>
              <TableCell sx={{ color: colors.textSecondary, fontWeight: 600, borderBottom: `1px solid ${colors.border}` }}>
                Ngày tạo
              </TableCell>
              <TableCell sx={{ color: colors.textSecondary, fontWeight: 600, borderBottom: `1px solid ${colors.border}` }}>
                Trạng thái
              </TableCell>
              <TableCell align="center" sx={{ color: colors.textSecondary, fontWeight: 600, borderBottom: `1px solid ${colors.border}` }}>
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow
                key={user.id}
                sx={{
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: colors.bgHover,
                  },
                }}
              >
                <TableCell sx={{ borderBottom: `1px solid ${colors.borderLight}` }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        background: user.role === 'admin'
                          ? 'linear-gradient(135deg, #ec4899, #db2777)'
                          : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                        fontSize: '0.875rem',
                      }}
                    >
                      {user.role === 'admin' ? (
                        <AdminPanelSettingsIcon fontSize="small" />
                      ) : (
                        user.name ? user.name.charAt(0).toUpperCase() : <PersonIcon fontSize="small" />
                      )}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ color: colors.textPrimary, fontWeight: 500 }}>
                        {user.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                        {user.email || 'Chưa có email'}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ borderBottom: `1px solid ${colors.borderLight}` }}>
                  {user.cardUid ? (
                    <Box
                      sx={{
                        display: 'inline-block',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1.5,
                        background: 'rgba(99, 102, 241, 0.15)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#818cf8',
                          fontFamily: 'monospace',
                          fontWeight: 600,
                          letterSpacing: '0.5px',
                        }}
                      >
                        {user.cardUid}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="caption" sx={{ color: colors.textSecondary, fontStyle: 'italic' }}>
                      Chưa có thẻ
                    </Typography>
                  )}
                </TableCell>
                <TableCell sx={{ borderBottom: `1px solid ${colors.borderLight}` }}>
                  <Chip
                    icon={user.role === 'admin' ? <AdminPanelSettingsIcon /> : <PersonIcon />}
                    label={user.role === 'admin' ? 'Admin' : 'User'}
                    size="small"
                    sx={{
                      background: user.role === 'admin'
                        ? 'rgba(236, 72, 153, 0.15)'
                        : 'rgba(99, 102, 241, 0.15)',
                      color: user.role === 'admin' ? '#f472b6' : '#818cf8',
                      border: `1px solid ${user.role === 'admin' ? 'rgba(236, 72, 153, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`,
                      fontWeight: 500,
                      '& .MuiChip-icon': {
                        color: 'inherit',
                      },
                    }}
                  />
                </TableCell>
                <TableCell sx={{ borderBottom: `1px solid ${colors.borderLight}` }}>
                  <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                    {user.createdAt
                      ? dayjs(user.createdAt).format('DD/MM/YYYY')
                      : '-'}
                  </Typography>
                </TableCell>
                <TableCell sx={{ borderBottom: `1px solid ${colors.borderLight}` }}>
                  <Tooltip title={user.isActive ? 'Đang hoạt động' : 'Đã vô hiệu hóa'}>
                    <Switch
                      checked={user.isActive}
                      onChange={() => onToggleActive(user.id, user.isActive)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#10b981',
                          '&:hover': {
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                          },
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#10b981',
                        },
                      }}
                    />
                  </Tooltip>
                </TableCell>
                <TableCell align="center" sx={{ borderBottom: `1px solid ${colors.borderLight}` }}>
                  <Tooltip title="Xóa người dùng">
                    <IconButton
                      onClick={() => onDelete(user.id, user.name)}
                      sx={{
                        color: '#f87171',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          background: 'rgba(239, 68, 68, 0.15)',
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Số dòng:"
        sx={{
          color: colors.textSecondary,
          borderTop: `1px solid ${colors.border}`,
          '& .MuiTablePagination-selectIcon': {
            color: colors.textSecondary,
          },
          '& .MuiIconButton-root': {
            color: colors.textSecondary,
          },
        }}
      />
    </Box>
  );
}
