import React, { useState } from 'react';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function MainLayout({
  children,
  selectedCompany,
  onSelectCompany,
  activeNav,
  onSelectNav,
  companies,
  currentCompanyObj,
  workspacesConfig,
  tasksCount,
  searchQuery,
  onSearchChange,
  isListening,
  onVoiceClick,
  notifications,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  onNotificationClick,
  onLogout,
  currentUser,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Sidebar
        selectedCompany={selectedCompany}
        onSelectCompany={onSelectCompany}
        activeNav={activeNav}
        onSelectNav={onSelectNav}
        companies={companies}
        currentCompanyObj={currentCompanyObj}
        workspacesConfig={workspacesConfig}
        tasksCount={tasksCount}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(true)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        onLogout={onLogout}
        currentUser={currentUser}
      />

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Navbar
          collapsed={collapsed}
          onExpandSidebar={() => setCollapsed(false)}
          onOpenMobile={() => setMobileOpen(true)}
          currentCompanyObj={currentCompanyObj}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          isListening={isListening}
          onVoiceClick={onVoiceClick}
          notifications={notifications}
          onMarkNotificationRead={onMarkNotificationRead}
          onMarkAllNotificationsRead={onMarkAllNotificationsRead}
          onNotificationClick={onNotificationClick}
        />

        <Box component="main" sx={{ flex: 1, p: { xs: 2, sm: 3 }, maxWidth: 1600, width: '100%', mx: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
