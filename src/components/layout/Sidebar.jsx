import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HistoryIcon from "@mui/icons-material/History";
import PeopleIcon from "@mui/icons-material/People";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import RouterIcon from "@mui/icons-material/Router";
import SettingsIcon from "@mui/icons-material/Settings";
import DoorSlidingIcon from "@mui/icons-material/DoorSliding";
import { useThemeMode } from "../../contexts/ThemeContext";
import { useDoorStatus } from "../../hooks/useDoorStatus";
import { drawerWidth } from "./constants";

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
  { text: "Lịch sử truy cập", icon: <HistoryIcon />, path: "/history" },
  { text: "Người dùng", icon: <PeopleIcon />, path: "/users" },
  { text: "Quản lý thẻ", icon: <CreditCardIcon />, path: "/cards" },
  { text: "Thiết bị", icon: <RouterIcon />, path: "/devices" },
  { text: "Cài đặt", icon: <SettingsIcon />, path: "/settings" },
];

export default function Sidebar({ open, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { isDark, colors } = useThemeMode();

  // Read default door from Settings - initialize directly from localStorage
  const getInitialDoorId = () => {
    try {
      const savedConfig = localStorage.getItem("systemConfig");
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        return config.defaultDoorId || "door_main";
      }
    } catch (e) {
      console.error("Failed to parse config:", e);
    }
    return "door_main";
  };

  const [doorId] = useState(getInitialDoorId);

  const { status } = useDoorStatus(doorId);

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: isDark
          ? "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)"
          : "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
      }}
    >
      <Toolbar />

      {/* Quick Status */}
      <Box sx={{ px: 2, py: 3 }}>
        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            background: status?.isOnline
              ? "linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(236, 72, 153, 0.1))"
              : "linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1))",
            border: status?.isOnline
              ? "1px solid rgba(99, 102, 241, 0.3)"
              : "1px solid rgba(239, 68, 68, 0.3)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
            <DoorSlidingIcon
              sx={{ color: status?.isOnline ? "#6366f1" : "#f87171" }}
            />
            <Typography
              variant="subtitle2"
              sx={{ color: colors.textPrimary, fontWeight: 600 }}
            >
              {doorId}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: status?.isOnline ? "#10b981" : "#f87171",
                boxShadow: status?.isOnline
                  ? "0 0 10px #10b981"
                  : "0 0 10px #f87171",
              }}
            />
            <Typography variant="caption" sx={{ color: colors.textSecondary }}>
              {status?.isOnline ? "Online" : "Offline"}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation */}
      <List sx={{ px: 1, flex: 1, py: 1 }}>
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={isSelected}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  transition: "all 0.3s ease",
                  "&.Mui-selected": {
                    background:
                      "linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(99, 102, 241, 0.1))",
                    borderLeft: "3px solid #6366f1",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, rgba(99, 102, 241, 0.4), rgba(99, 102, 241, 0.2))",
                    },
                  },
                  "&:hover": {
                    background: isDark
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isSelected ? "#818cf8" : colors.textSecondary,
                    transition: "color 0.3s ease",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isSelected ? 600 : 400,
                    color: isSelected
                      ? colors.textPrimary
                      : colors.textSecondary,
                    fontSize: "0.9rem",
                  }}
                />
                {isSelected && (
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#6366f1",
                      boxShadow: "0 0 10px #6366f1",
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Footer */}
      <Box sx={{ p: 2 }}>
        <Typography
          variant="caption"
          sx={{
            color: colors.textMuted,
            display: "block",
            textAlign: "center",
          }}
        >
          IoT Access Control v1.0
        </Typography>
      </Box>
    </Box>
  );

  const drawerStyles = {
    "& .MuiDrawer-paper": {
      boxSizing: "border-box",
      width: drawerWidth,
      borderRight: `1px solid ${colors.border}`,
      background: "transparent",
    },
  };

  return (
    <>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          ...drawerStyles,
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          ...drawerStyles,
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
