import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  InputBase,
  Badge,
  Avatar,
  Button,
  Chip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
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
}) {
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

          <IconButton size="small" sx={{ color: '#64748b' }}>
            <Badge badgeContent={2} color="error" sx={{ '& .MuiBadge-badge': { fontSize: 10, height: 16, minWidth: 16 } }}>
              <NotificationsNoneIcon fontSize="small" />
            </Badge>
          </IconButton>

          <Avatar sx={{ width: 32, height: 32, bgcolor: '#059669', fontSize: '0.8rem', fontWeight: 800 }}>
            D
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
