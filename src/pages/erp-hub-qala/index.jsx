import React, { useState, useMemo, useEffect } from 'react';
import { Box, Card, Typography, Button, TextField } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import MainLayout from '../../components/layout/MainLayout';
import ToastNotification from '../../components/common/ToastNotification';
import DashboardView from './DashboardView';
import InventoryView from './InventoryView';
import TasksView from './TasksView';
import GovernanceView from './GovernanceView';
import WorkspacesView from './WorkspacesView';
import HardwareIntegrationView from './HardwareIntegrationView';

import {
  COMPANIES,
  WORKSPACES_CONFIG,
  STAFF_MEMBERS,
  INITIAL_TASKS,
  INITIAL_EMPLOYEES,
  INITIAL_USERS,
  INITIAL_ROLES,
  RIGHTS_MODULES,
  INITIAL_RIGHTS_MATRIX,
  INITIAL_ACTIVITY,
  COMPANY_OPERATIONS_DATA,
  INITIAL_STOCK_LIST,
  INITIAL_STOCK_IN,
  INITIAL_STOCK_OUT,
} from './mockData';

export default function ErpHubQalaPage() {
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [inventoryTab, setInventoryTab] = useState(0);
  const [inventoryStatusFilter, setInventoryStatusFilter] = useState('All');
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  const handleNavigateToInventoryTab = (tabIndex, statusFilter = 'All') => {
    setInventoryTab(tabIndex);
    setInventoryStatusFilter(statusFilter);
    setActiveNav('Inventory');
  };

  // Shared data state
  const [stockItems, setStockItems] = useState(INITIAL_STOCK_LIST);
  const [stockInRecords, setStockInRecords] = useState(INITIAL_STOCK_IN);
  const [stockOutRecords, setStockOutRecords] = useState(INITIAL_STOCK_OUT);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [users, setUsers] = useState(() =>
    INITIAL_USERS.map((u) => ({
      ...u,
      loginId: u.loginId || u.email,
      password: u.password || '123456',
    }))
  );
  const [currentUser, setCurrentUser] = useState(() => ({
    ...INITIAL_USERS[0],
    loginId: INITIAL_USERS[0].email,
    password: '123456',
  }));
  const [loginIdInput, setLoginIdInput] = useState(INITIAL_USERS[0].email);
  const [loginPassInput, setLoginPassInput] = useState('123456');

  // Employee Task Notifications state
  const [notifications, setNotifications] = useState(() =>
    INITIAL_TASKS.map((t, idx) => ({
      id: `notif-init-${t.id}`,
      taskId: t.id,
      title: t.title,
      assignees: t.assignees || (t.assignee ? [t.assignee] : []),
      company: t.company,
      priority: t.priority,
      message: `${(t.assignees || (t.assignee ? [t.assignee] : ['Employee'])).join(', ')} received task: "${t.title}"`,
      time: t.createdAt || 'Recently',
      read: idx >= 2,
    }))
  );

  const handleTaskAssignedNotification = (task, targetEmployees) => {
    const empList = targetEmployees && targetEmployees.length > 0
      ? targetEmployees
      : task.assignees || (task.assignee ? [task.assignee] : ['Employee']);
    const newNotif = {
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      taskId: task.id,
      title: task.title,
      assignees: empList,
      company: task.company,
      priority: task.priority,
      message: `${empList.join(', ')} received task: "${task.title}"`,
      time: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleMarkNotificationRead = (notifId) => {
    setNotifications((prev) => prev.map((n) => (n.id === notifId ? { ...n, read: true } : n)));
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleLogout = () => {
    setLoginIdInput(currentUser?.loginId || currentUser?.email || users[0]?.loginId || '');
    setLoginPassInput(currentUser?.password || '123456');
    setIsLoggedOut(true);
    triggerToast('Logged out successfully', 'info');
  };

  const handleLogin = () => {
    const matched = users.find(
      (u) =>
        (u.loginId === loginIdInput.trim() || u.email === loginIdInput.trim()) &&
        u.password === loginPassInput
    );
    if (!matched) {
      triggerToast('Invalid Login ID or Password', 'error');
      return;
    }
    setCurrentUser(matched);
    setIsLoggedOut(false);
    setActiveNav('Dashboard');
    triggerToast(`Welcome back, ${matched.name}!`, 'success');
  };

  // Global search & Voice recognition
  const [globalSearch, setGlobalSearch] = useState('');
  const [listeningField, setListeningField] = useState(null);

  // Toast notification
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const triggerToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  // Current company object
  const currentCompanyObj = useMemo(() => {
    return COMPANIES.find((c) => c.id === selectedCompany) || COMPANIES[0];
  }, [selectedCompany]);

  const isGlobalMode = selectedCompany === 'All';

  // Handle company change
  const handleSelectCompany = (companyId) => {
    setSelectedCompany(companyId);
    if (companyId === 'All') {
      setActiveNav('Dashboard');
      triggerToast('Switched to Central Group Dashboard (All Companies)');
    } else {
      setActiveNav('Dashboard');
      triggerToast(`Switched to ${companyId}`);
    }
  };

  // Keyboard shortcut listener (Alt+W for Workspaces, Ctrl+K for Search)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && (e.key === 'w' || e.key === 'W')) {
        e.preventDefault();
        setActiveNav('Workspaces');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Voice recognition helper
  const startVoiceInput = (fieldName, onResult) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      triggerToast('Speech Recognition is not supported by your browser.', 'warning');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setListeningField(fieldName);
        triggerToast('Listening... Speak now 🎙️', 'info');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          onResult(transcript);
          triggerToast(`Recognized: "${transcript}"`);
        }
      };

      recognition.onerror = (err) => {
        console.warn('Speech recognition error:', err);
        setListeningField(null);
      };

      recognition.onend = () => {
        setListeningField(null);
      };

      recognition.start();
    } catch (err) {
      console.warn('Failed to start speech recognition:', err);
      setListeningField(null);
    }
  };

  if (isLoggedOut) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f8fafc',
          p: 2,
        }}
      >
        <Card
          elevation={0}
          sx={{
            p: 4,
            maxWidth: 380,
            width: '100%',
            textAlign: 'center',
            borderRadius: 3,
            border: '1px solid #e2e8f0',
            bgcolor: '#ffffff',
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2.5,
              bgcolor: '#eef2ff',
              color: '#4f46e5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
            }}
          >
            <LockOutlinedIcon />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
            ERP Hub Sign In
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 2.5 }}>
            Enter your employee Login ID and Password to continue.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2.5, textAlign: 'left' }}>
            <TextField
              fullWidth
              size="small"
              label="Login ID"
              value={loginIdInput}
              onChange={(e) => setLoginIdInput(e.target.value)}
            />
            <TextField
              fullWidth
              size="small"
              type="password"
              label="Password"
              value={loginPassInput}
              onChange={(e) => setLoginPassInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleLogin();
              }}
            />
          </Box>
          <Button
            fullWidth
            variant="contained"
            onClick={handleLogin}
            sx={{
              bgcolor: '#4f46e5',
              '&:hover': { bgcolor: '#4338ca' },
              fontWeight: 700,
              borderRadius: 2,
              textTransform: 'none',
            }}
          >
            Sign In to ERP Hub
          </Button>
        </Card>
        <ToastNotification
          open={toast.open}
          message={toast.message}
          severity={toast.severity}
          onClose={handleCloseToast}
        />
      </Box>
    );
  }

  return (
    <MainLayout
      selectedCompany={selectedCompany}
      onSelectCompany={handleSelectCompany}
      activeNav={activeNav}
      onSelectNav={setActiveNav}
      companies={COMPANIES}
      currentCompanyObj={currentCompanyObj}
      workspacesConfig={WORKSPACES_CONFIG}
      tasksCount={tasks.length}
      searchQuery={globalSearch}
      onSearchChange={setGlobalSearch}
      isListening={listeningField === 'globalSearch'}
      onVoiceClick={() => startVoiceInput('globalSearch', (txt) => setGlobalSearch(txt))}
      notifications={notifications}
      onMarkNotificationRead={handleMarkNotificationRead}
      onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
      onNotificationClick={() => setActiveNav('Task')}
      onLogout={handleLogout}
      currentUser={currentUser}
    >
      <Box className="animate-fade-in">
        {/* VIEW: DASHBOARD */}
        {activeNav === 'Dashboard' && (
          <DashboardView
            isGlobalMode={isGlobalMode}
            selectedCompany={selectedCompany}
            currentCompanyObj={currentCompanyObj}
            companies={COMPANIES}
            companyOperationsData={COMPANY_OPERATIONS_DATA}
            initialActivity={INITIAL_ACTIVITY}
            stockItems={stockItems}
            stockInRecords={stockInRecords}
            stockOutRecords={stockOutRecords}
            onSelectCompany={handleSelectCompany}
            onNavigate={setActiveNav}
            onNavigateToInventoryTab={handleNavigateToInventoryTab}
          />
        )}

        {/* VIEW: INVENTORY */}
        {activeNav === 'Inventory' && (
          <InventoryView
            selectedCompany={selectedCompany}
            companies={COMPANIES}
            stockItems={stockItems}
            setStockItems={setStockItems}
            stockInRecords={stockInRecords}
            setStockInRecords={setStockInRecords}
            stockOutRecords={stockOutRecords}
            setStockOutRecords={setStockOutRecords}
            triggerToast={triggerToast}
            startVoiceInput={startVoiceInput}
            listeningField={listeningField}
            currentTab={inventoryTab}
            onTabChange={setInventoryTab}
            stockStatusFilter={inventoryStatusFilter}
            onStockStatusChange={setInventoryStatusFilter}
          />
        )}

        {/* VIEW: TASKS */}
        {activeNav === 'Task' && (
          <TasksView
            tasks={tasks}
            setTasks={setTasks}
            companies={COMPANIES}
            staffMembers={STAFF_MEMBERS}
            triggerToast={triggerToast}
            startVoiceInput={startVoiceInput}
            listeningField={listeningField}
            onNotifyTaskAssigned={handleTaskAssignedNotification}
          />
        )}

        {/* VIEW: GOVERNANCE (HRMS, User, Role, Rights, Control) */}
        {['HRMS', 'User', 'Role', 'Rights', 'Control'].includes(activeNav) && (
          <GovernanceView
            activeNav={activeNav}
            initialEmployees={INITIAL_EMPLOYEES}
            initialUsers={INITIAL_USERS}
            users={users}
            setUsers={setUsers}
            companies={COMPANIES}
            initialRoles={INITIAL_ROLES}
            rightsModules={RIGHTS_MODULES}
            initialRightsMatrix={INITIAL_RIGHTS_MATRIX}
            triggerToast={triggerToast}
          />
        )}

        {/* VIEW: HARDWARE INTEGRATION */}
        {activeNav === 'Hardware' && (
          <HardwareIntegrationView
            currentUser={currentUser}
            stockItems={stockItems}
            setStockItems={setStockItems}
            stockInRecords={stockInRecords}
            setStockInRecords={setStockInRecords}
            stockOutRecords={stockOutRecords}
            setStockOutRecords={setStockOutRecords}
            triggerToast={triggerToast}
          />
        )}

        {/* VIEW: WORKSPACES (Grid or specific department workspace) */}
        {activeNav !== 'Dashboard' &&
          activeNav !== 'Inventory' &&
          activeNav !== 'Task' &&
          activeNav !== 'Hardware' &&
          !['HRMS', 'User', 'Role', 'Rights', 'Control'].includes(activeNav) && (
            <WorkspacesView
              activeNav={activeNav}
              currentCompanyObj={currentCompanyObj}
              workspacesConfig={WORKSPACES_CONFIG}
              onSelectWorkspace={setActiveNav}
            />
          )}
      </Box>

      {/* Global Toast Notification */}
      <ToastNotification
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={handleCloseToast}
      />
    </MainLayout>
  );
}
