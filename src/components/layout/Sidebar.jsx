import React, { useState } from 'react';
import {
  Box,
  Drawer,
  Typography,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Divider,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import CheckIcon from '@mui/icons-material/Check';
import GridViewIcon from '@mui/icons-material/GridView';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LogoutIcon from '@mui/icons-material/Logout';

export default function Sidebar({
  selectedCompany,
  onSelectCompany,
  activeNav,
  onSelectNav,
  companies,
  currentCompanyObj,
  workspacesConfig,
  tasksCount,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  onLogout,
  currentUser,
}) {
  const [companyMenuAnchor, setCompanyMenuAnchor] = useState(null);
  const isGlobalMode = selectedCompany === 'All';

  const handleOpenCompanyMenu = (e) => {
    setCompanyMenuAnchor(e.currentTarget);
  };

  const handleCloseCompanyMenu = () => {
    setCompanyMenuAnchor(null);
  };

  const handleCompanyChange = (companyId) => {
    onSelectCompany(companyId);
    handleCloseCompanyMenu();
  };

  const drawerWidth = 260;

  const drawerContent = (
    <Box
      sx={{
        width: drawerWidth,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e2e8f0',
      }}
    >
      {/* Top Header & Company Selector */}
      <Box sx={{ p: 2, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: '#4f46e5',
                fontSize: '0.8rem',
                fontWeight: 800,
              }}
            >
              {currentCompanyObj.short || 'ERP'}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1.1, color: '#0f172a' }}>
                {isGlobalMode ? 'ERP Hub' : currentCompanyObj.name}
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.65rem' }}>
                {isGlobalMode ? 'Group HQ • FY 2026-27' : 'FY 2026-27'}
              </Typography>
            </Box>
          </Box>
          <IconButton size="small" onClick={onToggleCollapse} sx={{ color: '#94a3b8' }}>
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Company Dropdown Trigger */}
        <Button
          fullWidth
          variant="outlined"
          onClick={handleOpenCompanyMenu}
          endIcon={<UnfoldMoreIcon sx={{ fontSize: 16, color: '#94a3b8' }} />}
          sx={{
            py: 0.8,
            px: 1.2,
            borderRadius: 2,
            textTransform: 'none',
            justifyContent: 'space-between',
            borderColor: '#e2e8f0',
            backgroundColor: '#f8fafc',
            color: '#1e293b',
            '&:hover': {
              borderColor: '#cbd5e1',
              backgroundColor: '#f1f5f9',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, textAlign: 'left' }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: isGlobalMode ? '#4f46e5' : '#059669',
              }}
            />
            <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.75rem', truncate: true }}>
              {currentCompanyObj.name}
            </Typography>
          </Box>
        </Button>

        <Menu
          anchorEl={companyMenuAnchor}
          open={Boolean(companyMenuAnchor)}
          onClose={handleCloseCompanyMenu}
          PaperProps={{
            sx: { width: 236, borderRadius: 2, mt: 0.5, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' },
          }}
        >
          {companies.map((comp) => (
            <MenuItem
              key={comp.id}
              onClick={() => handleCompanyChange(comp.id)}
              selected={selectedCompany === comp.id}
              sx={{ py: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', color: '#0f172a' }}>
                  {comp.name}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.65rem' }}>
                  {comp.sector}
                </Typography>
              </Box>
              {selectedCompany === comp.id && <CheckIcon sx={{ fontSize: 16, color: '#4f46e5' }} />}
            </MenuItem>
          ))}
        </Menu>
      </Box>

      {/* Middle Navigation */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 1.5, py: 1 }}>
        {isGlobalMode ? (
          /* Global Navigation */
          <List sx={{ p: 0 }}>
            {[
              { id: 'Dashboard', label: 'Dashboard', desc: 'Group executive overview' },
              { id: 'Task', label: 'Tasks', desc: 'Group-wide deliverables', badge: tasksCount },
              { id: 'HRMS', label: 'HRMS & Biometrics', desc: 'Central workforce directory' },
              { id: 'User', label: 'User Management', desc: 'Accounts & subsidiary scopes' },
              { id: 'Role', label: 'Role Scopes', desc: 'Role definitions & levels' },
              { id: 'Rights', label: 'Rights Matrix', desc: 'RBAC module permissions' },
              { id: 'Control', label: 'System Control', desc: 'Governance & group policies' },
            ].map((item) => {
              const isSelected = activeNav === item.id;
              return (
                <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    selected={isSelected}
                    onClick={() => {
                      onSelectNav(item.id);
                      if (onCloseMobile) onCloseMobile();
                    }}
                    sx={{
                      borderRadius: 2,
                      py: 0.8,
                      px: 1.5,
                      '&.Mui-selected': {
                        backgroundColor: '#4f46e5',
                        color: '#ffffff',
                        '&:hover': { backgroundColor: '#4338ca' },
                        '& .MuiListItemText-primary': { color: '#ffffff', fontWeight: 700 },
                        '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' },
                      },
                    }}
                  >
                    <ListItemText
                      primary={item.label}
                      secondary={item.desc}
                      primaryTypographyProps={{ fontSize: '0.8rem', fontWeight: 600 }}
                      secondaryTypographyProps={{ fontSize: '0.65rem' }}
                    />
                    {item.badge !== undefined && (
                      <Box
                        sx={{
                          px: 1,
                          py: 0.2,
                          borderRadius: 9999,
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          bgcolor: isSelected ? 'rgba(255,255,255,0.2)' : '#e2e8f0',
                          color: isSelected ? '#ffffff' : '#475569',
                        }}
                      >
                        {item.badge}
                      </Box>
                    )}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        ) : (
          /* Specific Company Navigation: Tasks (Outside) + Workspaces + Company Workspaces */
          <Box>
            {/* Top outside buttons: Tasks & Workspaces */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1.5 }}>
              <Button
                fullWidth
                variant={activeNav === 'Task' ? 'contained' : 'text'}
                onClick={() => {
                  onSelectNav('Task');
                  if (onCloseMobile) onCloseMobile();
                }}
                startIcon={<AssignmentIcon sx={{ fontSize: 16 }} />}
                sx={{
                  py: 0.8,
                  px: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  justifyContent: 'space-between',
                  fontWeight: 700,
                  fontSize: '11.5px',
                  backgroundColor: activeNav === 'Task' ? '#4f46e5' : '#f8fafc',
                  color: activeNav === 'Task' ? '#ffffff' : '#334155',
                  border: '1px solid',
                  borderColor: activeNav === 'Task' ? '#4f46e5' : '#e2e8f0',
                  '&:hover': {
                    backgroundColor: activeNav === 'Task' ? '#4338ca' : '#f1f5f9',
                  },
                }}
              >
                <span>Tasks</span>
                <Box
                  component="span"
                  sx={{
                    px: 0.8,
                    py: 0.1,
                    borderRadius: 9999,
                    fontSize: '10px',
                    fontWeight: 800,
                    bgcolor: activeNav === 'Task' ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
                    color: activeNav === 'Task' ? '#ffffff' : '#475569',
                  }}
                >
                  {tasksCount}
                </Box>
              </Button>

              <Button
                fullWidth
                variant={activeNav === 'Workspaces' ? 'contained' : 'text'}
                onClick={() => {
                  onSelectNav('Workspaces');
                  if (onCloseMobile) onCloseMobile();
                }}
                startIcon={<GridViewIcon sx={{ fontSize: 16 }} />}
                sx={{
                  py: 0.8,
                  px: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  justifyContent: 'space-between',
                  fontWeight: 700,
                  fontSize: '11.5px',
                  backgroundColor: activeNav === 'Workspaces' ? '#0f172a' : '#f8fafc',
                  color: activeNav === 'Workspaces' ? '#ffffff' : '#334155',
                  border: '1px solid',
                  borderColor: activeNav === 'Workspaces' ? '#0f172a' : '#e2e8f0',
                  '&:hover': {
                    backgroundColor: activeNav === 'Workspaces' ? '#1e293b' : '#f1f5f9',
                  },
                }}
              >
                <span>Workspaces</span>
                <Typography variant="caption" sx={{ fontSize: '10px', opacity: 0.6, fontFamily: 'monospace' }}>
                  Alt+W
                </Typography>
              </Button>
            </Box>

            <Divider sx={{ my: 1, borderColor: '#f1f5f9' }} />

            <Typography
              variant="caption"
              sx={{
                px: 1,
                py: 0.5,
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                color: '#94a3b8',
                fontSize: '0.65rem',
                display: 'block',
              }}
            >
              {currentCompanyObj.name} Workspaces
            </Typography>

            <List sx={{ p: 0 }}>
              {workspacesConfig
                .filter((ws) => ws.id !== 'Task')
                .map((ws) => {
                  const Icon = ws.icon;
                  const isSelected = activeNav === ws.id;
                  return (
                    <ListItem key={ws.id} disablePadding sx={{ mb: 0.2 }}>
                      <ListItemButton
                        selected={isSelected}
                        onClick={() => {
                          onSelectNav(ws.id);
                          if (onCloseMobile) onCloseMobile();
                        }}
                        sx={{
                          borderRadius: 2,
                          py: 0.6,
                          px: 1.2,
                          '&.Mui-selected': {
                            backgroundColor: '#ecfdf5',
                            color: '#065f46',
                            borderLeft: '3px solid #059669',
                            '&:hover': { backgroundColor: '#d1fae5' },
                            '& .MuiListItemText-primary': { color: '#065f46', fontWeight: 700 },
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 28, color: isSelected ? '#059669' : '#64748b' }}>
                          <Icon style={{ width: 16, height: 16 }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={ws.title}
                          primaryTypographyProps={{ fontSize: '10px', fontWeight: isSelected ? 700 : 500 }}
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
            </List>
          </Box>
        )}
      </Box>

      {/* Bottom Profile Footer */}
      <Box sx={{ p: 1.75, borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 1.2 }}>
        <Avatar sx={{ width: 32, height: 32, bgcolor: '#059669', fontSize: '0.8rem', fontWeight: 800, flexShrink: 0 }}>
          {(currentUser?.name || 'Deepak').charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#0f172a', display: 'block', noWrap: true, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {currentUser?.name ? currentUser.name.split(' ')[0] : 'Deepak'}
          </Typography>
          <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.65rem', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {isGlobalMode ? (currentUser?.role || 'Group Super Admin') : currentCompanyObj.name}
          </Typography>
        </Box>
        <Button
          size="small"
          onClick={onLogout}
          startIcon={<LogoutIcon sx={{ fontSize: 14 }} />}
          title="Logout"
          sx={{
            flexShrink: 0,
            minWidth: 'auto',
            px: 1,
            py: 0.4,
            fontSize: '0.7rem',
            fontWeight: 700,
            textTransform: 'none',
            borderRadius: 1.5,
            color: '#e11d48',
            bgcolor: '#fff1f2',
            border: '1px solid #fecdd3',
            '&:hover': { bgcolor: '#ffe4e6', borderColor: '#fda4af' },
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onCloseMobile}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Persistent Drawer */}
      <Box
        component="aside"
        sx={{
          display: { xs: 'none', md: collapsed ? 'none' : 'block' },
          width: drawerWidth,
          flexShrink: 0,
          height: '100vh',
          position: 'sticky',
          top: 0,
        }}
      >
        {drawerContent}
      </Box>
    </>
  );
}
