import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  InputBase,
  Badge,
  Button,
  Chip,
  Popover,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LogoutIcon from '@mui/icons-material/Logout';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import VoiceButton from '../buttons/VoiceButton';

export default function Navbar({
  collapsed,
  onExpandSidebar,
  onOpenMobile,
  currentCompanyObj,
  searchQuery,
  onSearchChange,
  isListening,
  onVoiceClick,
  notifications = [],
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  onNotificationClick,
  onLogout,
}) {
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleOpenNotif = (e) => {
    setNotifAnchorEl(e.currentTarget);
  };

  const handleCloseNotif = () => {
    setNotifAnchorEl(null);
  };
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        color: '#0f172a',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', gap: 2, minHeight: '56px !important', px: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            size="small"
            onClick={onOpenMobile}
            sx={{ display: { xs: 'flex', md: 'none' }, color: '#64748b' }}
          >
            <MenuIcon />
          </IconButton>

          {collapsed && (
            <Button
              size="small"
              onClick={onExpandSidebar}
              startIcon={<ChevronRightIcon sx={{ fontSize: 16 }} />}
              sx={{
                display: { xs: 'none', md: 'inline-flex' },
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.75rem',
                borderRadius: 2,
                color: '#475569',
                border: '1px solid #e2e8f0',
                px: 1.5,
                py: 0.5,
              }}
            >
              Expand Sidebar
            </Button>
          )}

          {/* Search bar with Voice Input */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 2.5,
              px: 1.5,
              py: 0.4,
              width: { xs: 180, sm: 280, md: 360 },
              transition: 'border-color 0.2s ease',
              '&:focus-within': {
                borderColor: '#4f46e5',
                backgroundColor: '#ffffff',
              },
            }}
          >
            <SearchIcon sx={{ color: '#94a3b8', fontSize: 18, mr: 1 }} />
            <InputBase
              placeholder="Search items, accounts, documents, pages..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              sx={{
                fontSize: '0.8rem',
                flex: 1,
                color: '#1e293b',
              }}
            />
            <VoiceButton isListening={isListening} onClick={onVoiceClick} />
            <Typography
              variant="caption"
              sx={{
                display: { xs: 'none', sm: 'inline' },
                fontSize: '0.65rem',
                color: '#94a3b8',
                fontFamily: 'monospace',
                ml: 1,
              }}
            >
              Ctrl+K
            </Typography>
          </Box>
        </Box>

        {/* Right side items */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Chip
            size="small"
            label={currentCompanyObj.name}
            sx={{
              display: { xs: 'none', sm: 'inline-flex' },
              fontWeight: 700,
              fontSize: '0.7rem',
              backgroundColor: '#eef2ff',
              color: '#4f46e5',
              border: '1px solid #c7d2fe',
            }}
          />

          <Button
            size="small"
            startIcon={<AutoAwesomeIcon sx={{ fontSize: 14, color: '#f59e0b' }} />}
            sx={{
              display: { xs: 'none', sm: 'inline-flex' },
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.75rem',
              borderRadius: 2,
              color: '#d97706',
              backgroundColor: '#fffbeb',
              border: '1px solid #fef3c7',
              '&:hover': { backgroundColor: '#fef3c7' },
              px: 1.2,
              py: 0.4,
            }}
          >
            AI Assistant
          </Button>

          <IconButton
            size="small"
            onClick={handleOpenNotif}
            sx={{ color: notifAnchorEl ? '#4f46e5' : '#64748b' }}
            title="Notifications"
          >
            <Badge
              badgeContent={unreadCount}
              color="error"
              sx={{ '& .MuiBadge-badge': { fontSize: 10, height: 16, minWidth: 16 } }}
            >
              <NotificationsNoneIcon fontSize="small" />
            </Badge>
          </IconButton>

          <Popover
            open={Boolean(notifAnchorEl)}
            anchorEl={notifAnchorEl}
            onClose={handleCloseNotif}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
              sx: {
                mt: 1,
                width: 340,
                maxHeight: 420,
                borderRadius: 2.5,
                border: '1px solid #e2e8f0',
                boxShadow: '0 10px 30px rgba(15, 23, 42, 0.12)',
                overflow: 'hidden',
              },
            }}
          >
            <Box
              sx={{
                px: 2,
                py: 1.25,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.8rem' }}>
                  Notifications
                </Typography>
                {unreadCount > 0 && (
                  <Chip
                    size="small"
                    label={`${unreadCount} new`}
                    sx={{ height: 18, fontSize: '0.62rem', fontWeight: 700, bgcolor: '#eef2ff', color: '#4f46e5' }}
                  />
                )}
              </Box>
              {unreadCount > 0 && onMarkAllNotificationsRead && (
                <Button
                  size="small"
                  onClick={onMarkAllNotificationsRead}
                  startIcon={<DoneAllIcon sx={{ fontSize: 13 }} />}
                  sx={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'none', color: '#4f46e5', py: 0.2 }}
                >
                  Mark all read
                </Button>
              )}
            </Box>

            <Box sx={{ maxHeight: 340, overflowY: 'auto' }}>
              {notifications.length === 0 ? (
                <Box sx={{ p: 3, textAlign: 'center', color: '#94a3b8' }}>
                  <Typography variant="caption" sx={{ display: 'block', fontWeight: 600 }}>
                    No task notifications yet.
                  </Typography>
                </Box>
              ) : (
                notifications.map((notif, idx) => (
                  <React.Fragment key={notif.id}>
                    <Box
                      onClick={() => {
                        if (onMarkNotificationRead) onMarkNotificationRead(notif.id);
                        handleCloseNotif();
                        if (onNotificationClick) onNotificationClick(notif);
                      }}
                      sx={{
                        px: 2,
                        py: 1.25,
                        cursor: 'pointer',
                        bgcolor: notif.read ? '#ffffff' : '#f8faff',
                        '&:hover': { bgcolor: '#f1f5f9' },
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1.25,
                      }}
                    >
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: 1.5,
                          bgcolor: notif.read ? '#f1f5f9' : '#eef2ff',
                          color: notif.read ? '#64748b' : '#4f46e5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          mt: 0.2,
                        }}
                      >
                        <AssignmentIndOutlinedIcon sx={{ fontSize: 16 }} />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.7rem', fontFamily: 'monospace' }}
                          >
                            {notif.taskId}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {notif.priority && (
                              <Chip
                                size="small"
                                label={notif.priority}
                                sx={{
                                  height: 16,
                                  fontSize: '0.58rem',
                                  fontWeight: 700,
                                  bgcolor: notif.priority === 'Critical' ? '#fff1f2' : '#f1f5f9',
                                  color: notif.priority === 'Critical' ? '#e11d48' : '#475569',
                                }}
                              />
                            )}
                            {!notif.read && (
                              <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#4f46e5' }} />
                            )}
                          </Box>
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            color: '#1e293b',
                            fontWeight: notif.read ? 500 : 700,
                            fontSize: '0.72rem',
                            mt: 0.2,
                            lineHeight: 1.35,
                          }}
                        >
                          {notif.message}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.62rem', mt: 0.3, display: 'block' }}>
                          {notif.company} • {notif.time}
                        </Typography>
                      </Box>
                    </Box>
                    {idx < notifications.length - 1 && <Divider sx={{ borderColor: '#f1f5f9' }} />}
                  </React.Fragment>
                ))
              )}
            </Box>
          </Popover>

          <Button
            size="small"
            variant="outlined"
            onClick={onLogout}
            startIcon={<LogoutIcon sx={{ fontSize: 15 }} />}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.75rem',
              borderRadius: 2,
              color: '#e11d48',
              borderColor: '#fecdd3',
              backgroundColor: '#fff1f2',
              '&:hover': {
                backgroundColor: '#ffe4e6',
                borderColor: '#fda4af',
              },
              px: 1.25,
              py: 0.4,
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
