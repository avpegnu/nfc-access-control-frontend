import { Box, Typography, Alert } from "@mui/material";
import DoorStatus from "../components/door/DoorStatus";
import DoorControl from "../components/door/DoorControl";
import AccessHistoryTable from "../components/history/AccessHistoryTable";
import { useDoorStatus } from "../hooks/useDoorStatus";
import { useAccessLogs, useAccessStats } from "../hooks/useAccessLogs";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import BlockIcon from "@mui/icons-material/Block";
import DevicesIcon from "@mui/icons-material/Devices";
import HistoryIcon from "@mui/icons-material/History";

function StatCard({ icon, value, label, color }) {
  return (
    <Box
      sx={{
        p: { xs: 1, sm: 1.5 },
        borderRadius: 2,
        background:
          "linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        display: "flex",
        alignItems: "center",
        gap: { xs: 1, sm: 1.5 },
        height: "100%",
      }}
    >
      <Box
        sx={{
          p: { xs: 0.75, sm: 1 },
          borderRadius: 1.5,
          background: `${color}20`,
          display: "flex",
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography
          sx={{
            fontWeight: 700,
            color: color,
            lineHeight: 1,
            fontSize: { xs: "1rem", sm: "1.25rem" },
          }}
        >
          {value}
        </Typography>
        <Typography sx={{ color: "#94a3b8", fontSize: { xs: "0.6rem", sm: "0.7rem" } }}>
          {label}
        </Typography>
      </Box>
    </Box>
  );
}

export default function Dashboard() {
  const {
    status,
    loading: statusLoading,
    error: statusError,
    unlockDoor,
    lockDoor,
  } = useDoorStatus();
  const { logs, loading: logsLoading } = useAccessLogs(10);
  const { stats, loading: statsLoading } = useAccessStats('today');

  const grantedCount = stats?.granted || 0;
  const deniedCount = stats?.denied || 0;
  const totalActivity = stats?.totalAccess || logs.length;

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", flex: 1, width: "100%" }}
    >
      {/* Header */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          color: "#f1f5f9",
          mb: 2,
          fontSize: { xs: "1.5rem", sm: "2rem" },
        }}
      >
        Dashboard
      </Typography>

      {statusError && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#f87171",
          }}
        >
          Lỗi: {statusError}
        </Alert>
      )}

      {/* Main Grid */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          flex: 1,
          minHeight: 0,
          gap: 2,
          width: "100%",
          overflow: { xs: "auto", md: "hidden" },
        }}
      >
        {/* Left: Door Status + Control */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "row", md: "column" },
            gap: 2,
            width: { xs: "100%", md: 220 },
            flexShrink: 0,
          }}
        >
          <Box sx={{ flex: { xs: 1, md: "none" } }}>
            <DoorStatus status={status} loading={statusLoading} />
          </Box>
          <Box sx={{ flex: { xs: 1, md: "none" } }}>
            <DoorControl
              status={status}
              onUnlock={unlockDoor}
              onLock={lockDoor}
            />
          </Box>
        </Box>

        {/* Right: Stats + Table */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minWidth: 0,
            minHeight: { xs: "auto", md: 0 },
          }}
        >
          {/* Stats Row */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(4, 1fr)" },
              gap: { xs: 1.5, sm: 2 },
              mb: 2,
            }}
          >
            <StatCard
              icon={
                <CheckCircleOutlineIcon
                  sx={{ color: "#34d399", fontSize: { xs: 16, sm: 20 } }}
                />
              }
              value={grantedCount}
              label="Thành công"
              color="#34d399"
            />
            <StatCard
              icon={<BlockIcon sx={{ color: "#f87171", fontSize: { xs: 16, sm: 20 } }} />}
              value={deniedCount}
              label="Từ chối"
              color="#f87171"
            />
            <StatCard
              icon={<DevicesIcon sx={{ color: "#818cf8", fontSize: { xs: 16, sm: 20 } }} />}
              value={status?.isOnline ? "1" : "0"}
              label="Thiết bị"
              color="#818cf8"
            />
            <StatCard
              icon={<HistoryIcon sx={{ color: "#fbbf24", fontSize: { xs: 16, sm: 20 } }} />}
              value={totalActivity}
              label="Hoạt động"
              color="#fbbf24"
            />
          </Box>

          {/* Activity Table */}
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              background:
                "linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
              overflow: "hidden",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <HistoryIcon sx={{ color: "#818cf8", fontSize: 20 }} />
              <Typography
                sx={{ color: "#f1f5f9", fontWeight: 600, fontSize: "0.9rem" }}
              >
                Hoạt động gần đây
              </Typography>
            </Box>
            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <AccessHistoryTable logs={logs} loading={logsLoading} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
