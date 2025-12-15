import { Box, Typography, Chip } from '@mui/material';
import AccessHistoryTable from '../components/history/AccessHistoryTable';
import { useAccessLogs } from '../hooks/useAccessLogs';
import HistoryIcon from '@mui/icons-material/History';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { useThemeMode } from '../contexts/ThemeContext';

export default function History() {
  const { logs, loading } = useAccessLogs(100);
  const { colors } = useThemeMode();

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
          Lịch sử truy cập
        </Typography>
        <Typography variant="body1" sx={{ color: colors.textSecondary, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
          Theo dõi tất cả hoạt động vào ra trong hệ thống
        </Typography>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: { xs: 3, sm: 4 },
          background: colors.bgCard,
          border: `1px solid ${colors.border}`,
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
              }}
            >
              <HistoryIcon sx={{ color: '#818cf8', fontSize: { xs: 20, sm: 24 } }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ color: colors.textPrimary, fontWeight: 600, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                Nhật ký hoạt động
              </Typography>
              <Typography variant="caption" sx={{ color: colors.textSecondary, fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                Cập nhật theo thời gian thực
              </Typography>
            </Box>
          </Box>

          <Chip
            icon={<EventNoteIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />}
            label={`${logs.length} bản ghi`}
            size="small"
            sx={{
              background: 'rgba(99, 102, 241, 0.15)',
              color: '#818cf8',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              fontWeight: 500,
              fontSize: { xs: '0.7rem', sm: '0.8125rem' },
              height: { xs: 24, sm: 32 },
              '& .MuiChip-icon': {
                color: 'inherit',
              },
            }}
          />
        </Box>

        {/* Table */}
        <AccessHistoryTable logs={logs} loading={loading} />
      </Box>
    </Box>
  );
}
