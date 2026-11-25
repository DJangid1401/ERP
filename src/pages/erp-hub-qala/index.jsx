import React, { useState, useMemo, useEffect } from 'react';
import { Box } from '@mui/material';

import MainLayout from '../../components/layout/MainLayout';
import ToastNotification from '../../components/common/ToastNotification';
import DashboardView from './DashboardView';
import InventoryView from './InventoryView';
import TasksView from './TasksView';
import GovernanceView from './GovernanceView';
import WorkspacesView from './WorkspacesView';

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

  // Shared data state
  const [stockItems, setStockItems] = useState(INITIAL_STOCK_LIST);
  const [stockInRecords, setStockInRecords] = useState(INITIAL_STOCK_IN);
  const [stockOutRecords, setStockOutRecords] = useState(INITIAL_STOCK_OUT);
  const [tasks, setTasks] = useState(INITIAL_TASKS);

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
          />
        )}

        {/* VIEW: GOVERNANCE (HRMS, User, Role, Rights, Control) */}
        {['HRMS', 'User', 'Role', 'Rights', 'Control'].includes(activeNav) && (
          <GovernanceView
            activeNav={activeNav}
            initialEmployees={INITIAL_EMPLOYEES}
            initialUsers={INITIAL_USERS}
            initialRoles={INITIAL_ROLES}
            rightsModules={RIGHTS_MODULES}
            initialRightsMatrix={INITIAL_RIGHTS_MATRIX}
            triggerToast={triggerToast}
          />
        )}

        {/* VIEW: WORKSPACES (Grid or specific department workspace) */}
        {activeNav !== 'Dashboard' &&
          activeNav !== 'Inventory' &&
          activeNav !== 'Task' &&
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
