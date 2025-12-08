import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Typography,
  Box,
  TablePagination,
  Avatar,
  Skeleton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import dayjs from 'dayjs';
import { useState } from 'react';

// Mobile Card Component
function MobileLogCard({ log }) {
  return (
    <Box
      sx={{
        p: 2,
        mb: 1.5,
        borderRadius: 2,
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Header: User + Result */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              background: log.userName
                ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
                : 'linear-gradient(135deg, #64748b, #475569)',
              fontSize: '0.75rem',
            }}
          >
            {log.userName ? log.userName.charAt(0).toUpperCase() : <PersonIcon sx={{ fontSize: 16 }} />}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ color: '#f1f5f9', fontWeight: 500, fontSize: '0.875rem' }}>
              {log.userName || 'Không xác định'}
            </Typography>
          </Box>
        </Box>
        <Chip
          icon={log.result === 'granted' ? <CheckCircleIcon sx={{ fontSize: 14 }} /> : <CancelIcon sx={{ fontSize: 14 }} />}
          label={log.result === 'granted' ? 'Cho phép' : 'Từ chối'}
          size="small"
          sx={{
            height: 24,
            background: log.result === 'granted'
              ? 'rgba(16, 185, 129, 0.15)'
              : 'rgba(239, 68, 68, 0.15)',
            color: log.result === 'granted' ? '#34d399' : '#f87171',
            border: `1px solid ${log.result === 'granted' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            fontWeight: 500,
            fontSize: '0.7rem',
            '& .MuiChip-icon': {
              color: 'inherit',
            },
          }}
        />
      </Box>

      {/* Info Row */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
        {/* Card UID */}
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
            {log.cardUid}
          </Typography>
        </Box>

        {/* Action */}
        <Chip
          icon={log.action === 'entry' ? <LoginIcon sx={{ fontSize: 12 }} /> : <LogoutIcon sx={{ fontSize: 12 }} />}
          label={log.action === 'entry' ? 'Vào' : 'Ra'}
          size="small"
          sx={{
            height: 22,
            background: log.action === 'entry'
              ? 'rgba(99, 102, 241, 0.15)'
              : 'rgba(236, 72, 153, 0.15)',
            color: log.action === 'entry' ? '#818cf8' : '#f472b6',
            border: `1px solid ${log.action === 'entry' ? 'rgba(99, 102, 241, 0.3)' : 'rgba(236, 72, 153, 0.3)'}`,
            fontWeight: 500,
            fontSize: '0.65rem',
            '& .MuiChip-icon': {
              color: 'inherit',
            },
          }}
        />

        {/* Time */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <AccessTimeIcon sx={{ fontSize: 12, color: '#64748b' }} />
          <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem' }}>
            {dayjs(log.timestamp).format('HH:mm DD/MM')}
          </Typography>
        </Box>
      </Box>

      {/* Reason if denied */}
      {log.reason && (
        <Typography variant="caption" sx={{ color: '#f87171', display: 'block', mt: 1, fontSize: '0.7rem' }}>
          {log.reason}
        </Typography>
      )}
    </Box>
  );
}

export default function AccessHistoryTable({ logs, loading }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
              <Skeleton variant="text" width="40%" sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
            </Box>
            <Skeleton variant="rounded" width={80} height={24} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
          </Box>
        ))}
      </Box>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <HelpOutlineIcon sx={{ fontSize: 48, color: '#64748b', mb: 2 }} />
        <Typography sx={{ color: '#94a3b8' }}>
          Chưa có lịch sử truy cập
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

  const paginatedLogs = logs.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Mobile view - Card layout
  if (isMobile) {
    return (
      <Box>
        {paginatedLogs.map((log) => (
          <MobileLogCard key={log.id} log={log} />
        ))}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={logs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage=""
          sx={{
            color: '#94a3b8',
            borderTop: '1px solid rgba(255,255,255,0.1)',
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
              color: '#94a3b8',
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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(15, 23, 42, 0.95)' }}>
                Người dùng
              </TableCell>
              <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(15, 23, 42, 0.95)' }}>
                UID Thẻ
              </TableCell>
              <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(15, 23, 42, 0.95)' }}>
                Thời gian
              </TableCell>
              <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(15, 23, 42, 0.95)' }}>
                Hành động
              </TableCell>
              <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(15, 23, 42, 0.95)' }}>
                Kết quả
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedLogs.map((log) => (
              <TableRow
                key={log.id}
                sx={{
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.03)',
                  },
                }}
              >
                <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        background: log.userName
                          ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
                          : 'linear-gradient(135deg, #64748b, #475569)',
                        fontSize: '0.875rem',
                      }}
                    >
                      {log.userName ? log.userName.charAt(0).toUpperCase() : <PersonIcon fontSize="small" />}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ color: '#f1f5f9', fontWeight: 500 }}>
                        {log.userName || 'Không xác định'}
                      </Typography>
                      {log.userId && (
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                          {log.userId.slice(0, 12)}...
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
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
                      {log.cardUid}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#f1f5f9' }}>
                      {dayjs(log.timestamp).format('HH:mm:ss')}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      {dayjs(log.timestamp).format('DD/MM/YYYY')}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <Chip
                    icon={log.action === 'entry' ? <LoginIcon /> : <LogoutIcon />}
                    label={log.action === 'entry' ? 'Vào' : 'Ra'}
                    size="small"
                    sx={{
                      background: log.action === 'entry'
                        ? 'rgba(99, 102, 241, 0.15)'
                        : 'rgba(236, 72, 153, 0.15)',
                      color: log.action === 'entry' ? '#818cf8' : '#f472b6',
                      border: `1px solid ${log.action === 'entry' ? 'rgba(99, 102, 241, 0.3)' : 'rgba(236, 72, 153, 0.3)'}`,
                      fontWeight: 500,
                      '& .MuiChip-icon': {
                        color: 'inherit',
                      },
                    }}
                  />
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <Chip
                    icon={log.result === 'granted' ? <CheckCircleIcon /> : <CancelIcon />}
                    label={log.result === 'granted' ? 'Cho phép' : 'Từ chối'}
                    size="small"
                    sx={{
                      background: log.result === 'granted'
                        ? 'rgba(16, 185, 129, 0.15)'
                        : 'rgba(239, 68, 68, 0.15)',
                      color: log.result === 'granted' ? '#34d399' : '#f87171',
                      border: `1px solid ${log.result === 'granted' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                      fontWeight: 500,
                      '& .MuiChip-icon': {
                        color: 'inherit',
                      },
                    }}
                  />
                  {log.reason && (
                    <Typography variant="caption" display="block" sx={{ color: '#64748b', mt: 0.5 }}>
                      {log.reason}
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={logs.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Số dòng:"
        sx={{
          flexShrink: 0,
          color: '#94a3b8',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          '& .MuiTablePagination-selectIcon': {
            color: '#94a3b8',
          },
          '& .MuiIconButton-root': {
            color: '#94a3b8',
          },
          '& .MuiInputBase-root': {
            color: '#94a3b8',
          },
          '& .MuiTablePagination-menuItem': {
            color: '#1e293b',
          },
        }}
      />
    </Box>
  );
}
