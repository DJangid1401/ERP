import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  Button,
  TextField,
  InputAdornment,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Avatar,
  AvatarGroup,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  OutlinedInput,
  Tooltip,
  Divider,
} from '@mui/material';
import PlusIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import RepeatIcon from '@mui/icons-material/Repeat';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import FilterListIcon from '@mui/icons-material/FilterList';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import VoiceButton from '../../components/buttons/VoiceButton';

export default function TasksView({
  tasks,
  setTasks,
  companies,
  staffMembers,
  triggerToast,
  startVoiceInput,
  listeningField,
}) {
  // Page Filters
  const [companyFilter, setCompanyFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [assigneeFilter, setAssigneeFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTaskForManage, setSelectedTaskForManage] = useState(null);

  // Extension Request Modal state
  const [isExtensionModalOpen, setIsExtensionModalOpen] = useState(false);
  const [taskForExtension, setTaskForExtension] = useState(null);
  const [extensionNewDate, setExtensionNewDate] = useState('');
  const [extensionReason, setExtensionReason] = useState('');

  // Forward Task Modal state
  const [isForwardModalOpen, setIsForwardModalOpen] = useState(false);
  const [taskForForward, setTaskForForward] = useState(null);
  const [forwardEmployee, setForwardEmployee] = useState(staffMembers[0] || 'Deepak Sharma');
  const [forwardNote, setForwardNote] = useState('');

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCompany, setNewCompany] = useState(
    companies.find((c) => c.id !== 'All')?.id || 'Siona Plasto'
  );
  // Multiple employee selection
  const [newAssignees, setNewAssignees] = useState([staffMembers[0] || 'Deepak Sharma']);
  const [newPriority, setNewPriority] = useState('Critical');
  const [newDueDate, setNewDueDate] = useState('2026-11-30');
  const [newRepeat, setNewRepeat] = useState('None'); // None, Daily, Weekly, Monthly
  const [newRepeatMonthDate, setNewRepeatMonthDate] = useState('28'); // fixed date for monthly repeat
  const [newRequireAttachment, setNewRequireAttachment] = useState(false);
  const [newRequireApproval, setNewRequireApproval] = useState(false);
  const [newApprover, setNewApprover] = useState(staffMembers[1] || staffMembers[0] || 'Rajesh Sharma');

  // Priority weight mapping for sorting: Critical ALWAYS appears on top!
  const priorityWeight = {
    Critical: 4,
    High: 3,
    Medium: 2,
    Low: 1,
  };

  // Filtered and Sorted Tasks (Critical on Top)
  const filteredTasks = useMemo(() => {
    const list = tasks.filter((t) => {
      // Company filter
      if (companyFilter !== 'All' && t.company !== companyFilter) return false;

      // Status filter
      if (statusFilter === 'Extension Requested') {
        if (!t.extensionRequest || t.extensionRequest.status !== 'Pending') return false;
      } else if (statusFilter !== 'All' && t.status !== statusFilter) {
        return false;
      }

      // Priority filter
      if (priorityFilter !== 'All' && t.priority !== priorityFilter) return false;

      // Assignee filter
      if (assigneeFilter !== 'All') {
        const assignees = t.assignees || [t.assignee || ''];
        if (!assignees.includes(assigneeFilter)) return false;
      }

      // Live search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = (t.id || '').toLowerCase().includes(q);
        const matchesTitle = (t.title || '').toLowerCase().includes(q);
        const matchesDesc = (t.description || '').toLowerCase().includes(q);
        const matchesCompany = (t.company || '').toLowerCase().includes(q);
        const matchesAssignees = (t.assignees || [t.assignee || '']).some((a) =>
          a.toLowerCase().includes(q)
        );
        return matchesId || matchesTitle || matchesDesc || matchesCompany || matchesAssignees;
      }

      return true;
    });

    // Sort order: Critical priority ALWAYS on top, then High, Medium, Low
    return list.sort((a, b) => {
      const weightA = priorityWeight[a.priority] || 2;
      const weightB = priorityWeight[b.priority] || 2;
      if (weightA !== weightB) {
        return weightB - weightA; // Higher weight on top (Critical first)
      }
      return (a.dueDate || '').localeCompare(b.dueDate || '');
    });
  }, [tasks, companyFilter, statusFilter, priorityFilter, assigneeFilter, searchQuery]);

  // Metrics
  const totalTasks = tasks.length;
  const inProgressCount = tasks.filter((t) => t.status === 'In Progress').length;
  const pendingCount = tasks.filter((t) => t.status === 'Pending').length;
  const completedCount = tasks.filter((t) => t.status === 'Completed').length;
  const criticalCount = tasks.filter((t) => t.priority === 'Critical').length;
  const extensionCount = tasks.filter(
    (t) => t.extensionRequest && t.extensionRequest.status === 'Pending'
  ).length;

  // Reset Filters Helper
  const hasActiveFilters =
    companyFilter !== 'All' ||
    statusFilter !== 'All' ||
    priorityFilter !== 'All' ||
    assigneeFilter !== 'All' ||
    searchQuery.trim() !== '';

  const handleResetFilters = () => {
    setCompanyFilter('All');
    setStatusFilter('All');
    setPriorityFilter('All');
    setAssigneeFilter('All');
    setSearchQuery('');
  };

  // Create Task Handler
  const handleCreateTask = () => {
    if (!newTitle.trim()) {
      triggerToast('Please enter a task title', 'error');
      return;
    }
    if (newAssignees.length === 0) {
      triggerToast('Please select at least one assignee', 'error');
      return;
    }

    const taskId = `TSK-${1050 + tasks.length}`;
    const newTask = {
      id: taskId,
      title: newTitle.trim(),
      description: newDesc.trim() || 'Operational assignment across plant divisions.',
      company: newCompany,
      assignees: newAssignees,
      priority: newPriority,
      status: 'In Progress',
      dueDate: newDueDate,
      repeat: newRepeat,
      repeatMonthDate: newRepeat === 'Monthly' ? newRepeatMonthDate : undefined,
      attachmentRequired: newRequireAttachment,
      approval: newRequireApproval
        ? { required: true, status: 'Pending Approval', approver: newApprover }
        : { required: false, status: 'Approved' },
      checklist: [
        { id: '1', title: 'Initial verification & requirements review', completed: false },
        { id: '2', title: 'Execute assignment deliverables', completed: false },
      ],
      createdAt: 'Just now',
    };

    setTasks((prev) => [newTask, ...prev]);
    triggerToast(
      `Task ${taskId} created with ${newPriority} priority and assigned to ${newAssignees.join(', ')}!`
    );

    // Reset Form
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewDesc('');
    setNewAssignees([staffMembers[0] || 'Deepak Sharma']);
    setNewPriority('Critical');
    setNewRepeat('None');
    setNewRequireAttachment(false);
    setNewRequireApproval(false);
  };

  // Checklist Item Toggle
  const toggleChecklistItem = (taskId, checkId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updatedChecklist = (t.checklist || []).map((c) =>
            c.id === checkId ? { ...c, completed: !c.completed } : c
          );
          return { ...t, checklist: updatedChecklist };
        }
        return t;
      })
    );
  };

  // Open Due Date Extension Modal
  const handleOpenExtensionModal = (task) => {
    setTaskForExtension(task);
    setExtensionNewDate(task.dueDate || '2026-12-05');
    setExtensionReason('');
    setIsExtensionModalOpen(true);
  };

  // Submit Due Date Extension Request
  const handleSubmitExtension = () => {
    if (!taskForExtension) return;
    if (!extensionNewDate) {
      triggerToast('Please choose a requested new due date', 'error');
      return;
    }

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskForExtension.id) {
          return {
            ...t,
            extensionRequest: {
              requestedDate: extensionNewDate,
              reason: extensionReason.trim() || 'Additional time required for verification.',
              status: 'Pending',
              requestedAt: 'Just now',
            },
          };
        }
        return t;
      })
    );

    triggerToast(`Due date extension requested for ${taskForExtension.id} until ${extensionNewDate}!`);
    setIsExtensionModalOpen(false);
    setTaskForExtension(null);
  };

  // Approve Due Date Extension
  const handleApproveExtension = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId && t.extensionRequest) {
          return {
            ...t,
            dueDate: t.extensionRequest.requestedDate,
            extensionRequest: { ...t.extensionRequest, status: 'Approved' },
          };
        }
        return t;
      })
    );
    triggerToast('Due date extension approved!');
    setSelectedTaskForManage(null);
  };

  // Reject Due Date Extension
  const handleRejectExtension = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId && t.extensionRequest) {
          return {
            ...t,
            extensionRequest: { ...t.extensionRequest, status: 'Rejected' },
          };
        }
        return t;
      })
    );
    triggerToast('Extension request rejected.', 'info');
    setSelectedTaskForManage(null);
  };

  // Open Forward Task Modal
  const handleOpenForwardModal = (task) => {
    setTaskForForward(task);
    setForwardEmployee(staffMembers[0] || 'Deepak Sharma');
    setForwardNote('');
    setIsForwardModalOpen(true);
  };

  // Submit Forward Task / Reassign
  const handleSubmitForward = () => {
    if (!taskForForward) return;
    if (!forwardEmployee) {
      triggerToast('Please select an employee to forward to', 'error');
      return;
    }

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskForForward.id) {
          const currentAssignees = t.assignees || [t.assignee || ''];
          const updatedAssignees = [forwardEmployee, ...currentAssignees.filter((a) => a !== forwardEmployee)];
          const forwardEntry = {
            from: currentAssignees[0] || 'Current Assignee',
            to: forwardEmployee,
            note: forwardNote.trim() || 'Forwarded for operational completion',
            date: 'Just now',
          };
          return {
            ...t,
            assignees: updatedAssignees,
            forwardHistory: [...(t.forwardHistory || []), forwardEntry],
          };
        }
        return t;
      })
    );

    triggerToast(`Task ${taskForForward.id} successfully forwarded to ${forwardEmployee}!`);
    setIsForwardModalOpen(false);
    setTaskForForward(null);
  };

  // Approve 3rd Person Approval
  const handleApproveTask = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            approval: { ...(t.approval || {}), status: 'Approved' },
          };
        }
        return t;
      })
    );
    triggerToast(`Task ${taskId} approved by 3rd person!`);
    setSelectedTaskForManage((prev) => (prev ? { ...prev, approval: { ...prev.approval, status: 'Approved' } } : null));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {/* Header Banner */}
      <Card elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                Tasks & Operational Deliverables
              </Typography>
              <Chip
                size="small"
                label="Multi-Company Hub"
                sx={{ bgcolor: '#eef2ff', color: '#4f46e5', fontWeight: 700, fontSize: '0.7rem' }}
              />
              {criticalCount > 0 && (
                <Chip
                  size="small"
                  icon={<WarningAmberIcon sx={{ fontSize: '14px !important', color: '#ef4444' }} />}
                  label={`${criticalCount} Critical on Top`}
                  sx={{ bgcolor: '#fef2f2', color: '#dc2626', fontWeight: 800, fontSize: '0.7rem', border: '1px solid #fecaca' }}
                />
              )}
            </Box>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Central task tracker across all companies with repeat cycles (Daily/Weekly/Monthly with fixed date), due date extensions, attachments, 3rd person approvals & task forwarding.
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="small"
            onClick={() => setIsAddModalOpen(true)}
            startIcon={<PlusIcon />}
            sx={{
              bgcolor: '#0f172a',
              '&:hover': { bgcolor: '#1e293b' },
              borderRadius: 2,
              fontWeight: 700,
              textTransform: 'none',
              px: 2,
              py: 0.8,
            }}
          >
            Create New Task
          </Button>
        </Box>
      </Card>

      {/* Metrics Row */}
      <Grid container spacing={2}>
        <Grid item xs={6} sm={2.4}>
          <Card elevation={0} sx={{ p: 2, borderRadius: 2.5, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', textTransform: 'uppercase', fontSize: '0.65rem' }}>
              Total Tasks
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mt: 0.5 }}>
              {totalTasks}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={6} sm={2.4}>
          <Card elevation={0} sx={{ p: 2, borderRadius: 2.5, border: '1px solid #fee2e2', bgcolor: '#fff5f5' }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', fontSize: '0.65rem' }}>
              Critical Tasks
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#dc2626', mt: 0.5 }}>
              {criticalCount}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={6} sm={2.4}>
          <Card elevation={0} sx={{ p: 2, borderRadius: 2.5, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', fontSize: '0.65rem' }}>
              In Progress
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#2563eb', mt: 0.5 }}>
              {inProgressCount}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={6} sm={2.4}>
          <Card elevation={0} sx={{ p: 2, borderRadius: 2.5, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#d97706', textTransform: 'uppercase', fontSize: '0.65rem' }}>
              Extension Requests
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#d97706', mt: 0.5 }}>
              {extensionCount} Pending
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={6} sm={2.4}>
          <Card elevation={0} sx={{ p: 2, borderRadius: 2.5, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#059669', textTransform: 'uppercase', fontSize: '0.65rem' }}>
              Completed
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#059669', mt: 0.5 }}>
              {completedCount}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Filter and Table Card */}
      <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#ffffff', overflow: 'hidden' }}>
        {/* COMPREHENSIVE FILTER BAR */}
        <Box sx={{ p: 2, borderBottom: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {/* Row 1: Company Selector Chips */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', mr: 0.5 }}>
              Company:
            </Typography>
            <Chip
              size="small"
              label={`All Companies (${tasks.length})`}
              onClick={() => setCompanyFilter('All')}
              sx={{
                fontWeight: 700,
                fontSize: '0.7rem',
                bgcolor: companyFilter === 'All' ? '#0f172a' : '#f1f5f9',
                color: companyFilter === 'All' ? '#ffffff' : '#475569',
                cursor: 'pointer',
              }}
            />
            {companies
              .filter((c) => c.id !== 'All')
              .map((c) => {
                const count = tasks.filter((t) => t.company === c.id).length;
                return (
                  <Chip
                    key={c.id}
                    size="small"
                    label={`${c.name} (${count})`}
                    onClick={() => setCompanyFilter(c.id)}
                    sx={{
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      bgcolor: companyFilter === c.id ? '#4f46e5' : '#f1f5f9',
                      color: companyFilter === c.id ? '#ffffff' : '#475569',
                      cursor: 'pointer',
                    }}
                  />
                );
              })}
          </Box>

          {/* Row 2: Status Chips, Priority Filter, Assignee Filter, Search, and Reset */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', mr: 0.5 }}>
                Status:
              </Typography>
              {['All', 'In Progress', 'Pending', 'Extension Requested', 'Completed'].map((st) => (
                <Chip
                  key={st}
                  size="small"
                  label={st}
                  onClick={() => setStatusFilter(st)}
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    bgcolor: statusFilter === st ? '#1e293b' : '#f8fafc',
                    color: statusFilter === st ? '#ffffff' : '#475569',
                    cursor: 'pointer',
                    border: '1px solid #e2e8f0',
                  }}
                />
              ))}

              {/* Priority Filter Dropdown */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b' }}>
                  Priority:
                </Typography>
                <Select
                  size="small"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  sx={{
                    height: 30,
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    bgcolor: '#f8fafc',
                    borderRadius: 1.5,
                  }}
                >
                  <MenuItem value="All">All Priorities</MenuItem>
                  <MenuItem value="Critical">🔴 Critical Only</MenuItem>
                  <MenuItem value="High">🟠 High</MenuItem>
                  <MenuItem value="Medium">🟡 Medium</MenuItem>
                  <MenuItem value="Low">⚪ Low</MenuItem>
                </Select>
              </Box>

              {/* Assignee Filter Dropdown */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 0.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b' }}>
                  Assignee:
                </Typography>
                <Select
                  size="small"
                  value={assigneeFilter}
                  onChange={(e) => setAssigneeFilter(e.target.value)}
                  sx={{
                    height: 30,
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    bgcolor: '#f8fafc',
                    borderRadius: 1.5,
                  }}
                >
                  <MenuItem value="All">All Staff</MenuItem>
                  {staffMembers.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              {hasActiveFilters && (
                <Button
                  size="small"
                  onClick={handleResetFilters}
                  sx={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    color: '#e11d48',
                    textTransform: 'none',
                    py: 0.2,
                  }}
                >
                  Reset Filters
                </Button>
              )}
            </Box>

            {/* Live Search Field with Voice Input */}
            <TextField
              size="small"
              placeholder="Search task title, staff, company, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <VoiceButton
                      isListening={listeningField === 'taskSearch'}
                      onClick={() => startVoiceInput('taskSearch', (txt) => setSearchQuery(txt))}
                    />
                  </InputAdornment>
                ),
                sx: { fontSize: '0.75rem', height: 36, width: { xs: 200, sm: 280 }, bgcolor: '#f8fafc', borderRadius: 2 },
              }}
            />
          </Box>
        </Box>

        {/* Tasks Table */}
        <TableContainer component={Paper} elevation={0}>
          <Table size="small">
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#64748b' }}>Priority</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#64748b' }}>Task ID</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#64748b', minWidth: 230 }}>
                  Title & Description
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#64748b' }}>Company</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#64748b' }}>Assignees</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#64748b' }}>Due Date</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#64748b' }}>Checklist</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#64748b' }}>3rd Person Approval</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#64748b' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#64748b', textAlign: 'right' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} sx={{ textAlign: 'center', py: 4, color: '#94a3b8' }}>
                    No tasks match the selected filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTasks.map((t) => {
                  const assignees = t.assignees || [t.assignee || 'Unassigned'];
                  const checkDone = (t.checklist || []).filter((c) => c.completed).length;
                  const checkTotal = (t.checklist || []).length;
                  const isCritical = t.priority === 'Critical';

                  return (
                    <TableRow
                      key={t.id}
                      hover
                      sx={{
                        bgcolor: isCritical ? 'rgba(254, 242, 242, 0.35)' : 'inherit',
                        borderLeft: isCritical ? '3px solid #ef4444' : 'none',
                      }}
                    >
                      {/* Priority Tag */}
                      <TableCell>
                        <Chip
                          size="small"
                          icon={
                            isCritical ? (
                              <WarningAmberIcon sx={{ fontSize: '13px !important', color: '#ef4444' }} />
                            ) : undefined
                          }
                          label={t.priority || 'Medium'}
                          sx={{
                            height: 20,
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            bgcolor:
                              t.priority === 'Critical'
                                ? '#fee2e2'
                                : t.priority === 'High'
                                ? '#fff1f2'
                                : t.priority === 'Low'
                                ? '#f1f5f9'
                                : '#fffbeb',
                            color:
                              t.priority === 'Critical'
                                ? '#b91c1c'
                                : t.priority === 'High'
                                ? '#e11d48'
                                : t.priority === 'Low'
                                ? '#475569'
                                : '#d97706',
                          }}
                        />
                      </TableCell>

                      {/* Task ID */}
                      <TableCell sx={{ fontWeight: 800, fontFamily: 'monospace', color: '#4f46e5', fontSize: '0.75rem' }}>
                        {t.id}
                      </TableCell>

                      {/* Title & Description & Flags */}
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, flexWrap: 'wrap' }}>
                          <Typography variant="caption" sx={{ fontWeight: 800, color: '#0f172a' }}>
                            {t.title}
                          </Typography>
                          {t.attachmentRequired && (
                            <Chip
                              size="small"
                              icon={<AttachFileIcon sx={{ fontSize: '11px !important', color: '#2563eb' }} />}
                              label="Proof Req"
                              sx={{
                                height: 18,
                                fontSize: '0.6rem',
                                fontWeight: 700,
                                bgcolor: '#eff6ff',
                                color: '#1d4ed8',
                                border: '1px solid #bfdbfe',
                              }}
                            />
                          )}
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{ color: '#64748b', fontSize: '0.65rem', display: 'block', maxWidth: 280, truncate: true }}
                        >
                          {t.description}
                        </Typography>

                        {/* Repeat indicator */}
                        {t.repeat && t.repeat !== 'None' && (
                          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, mt: 0.3, color: '#4f46e5' }}>
                            <RepeatIcon sx={{ fontSize: 11 }} />
                            <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 700 }}>
                              Repeats {t.repeat}
                              {t.repeat === 'Monthly' && t.repeatMonthDate ? ` (${t.repeatMonthDate}th)` : ''}
                            </Typography>
                          </Box>
                        )}
                      </TableCell>

                      {/* Company */}
                      <TableCell>
                        <Chip
                          size="small"
                          label={t.company}
                          sx={{ height: 20, fontSize: '0.65rem', fontWeight: 600, bgcolor: '#f1f5f9' }}
                        />
                      </TableCell>

                      {/* Assignees (Multiple selection support) */}
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 22, height: 22, fontSize: 9 } }}>
                            {assignees.map((a, i) => (
                              <Avatar key={i}>{a.split(' ').map((n) => n[0]).join('')}</Avatar>
                            ))}
                          </AvatarGroup>
                          <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#475569', fontWeight: 600 }}>
                            {assignees.join(', ')}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Due Date & Extension status */}
                      <TableCell>
                        <Typography variant="caption" sx={{ fontSize: '0.75rem', fontWeight: 600, display: 'block' }}>
                          {t.dueDate}
                        </Typography>
                        {t.extensionRequest && t.extensionRequest.status === 'Pending' && (
                          <Chip
                            size="small"
                            icon={<AccessTimeIcon sx={{ fontSize: '11px !important', color: '#d97706' }} />}
                            label={`Ext: ${t.extensionRequest.requestedDate}`}
                            sx={{ height: 18, fontSize: '0.6rem', bgcolor: '#fffbeb', color: '#d97706', fontWeight: 700 }}
                          />
                        )}
                      </TableCell>

                      {/* Checklist */}
                      <TableCell>
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: checkDone === checkTotal && checkTotal > 0 ? '#059669' : '#64748b',
                          }}
                        >
                          {checkDone}/{checkTotal} done
                        </Typography>
                      </TableCell>

                      {/* 3rd Person Approval */}
                      <TableCell>
                        {t.approval?.required ? (
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3 }}>
                            <Chip
                              size="small"
                              icon={<VerifiedUserIcon sx={{ fontSize: '12px !important' }} />}
                              label={t.approval?.status || 'Pending Approval'}
                              sx={{
                                height: 20,
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                bgcolor: t.approval?.status === 'Pending Approval' ? '#fffbeb' : '#ecfdf5',
                                color: t.approval?.status === 'Pending Approval' ? '#d97706' : '#059669',
                              }}
                            />
                            {t.approval?.approver && (
                              <Typography variant="caption" sx={{ fontSize: '0.6rem', color: '#64748b' }}>
                                by {t.approval.approver}
                              </Typography>
                            )}
                          </Box>
                        ) : (
                          <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.65rem' }}>
                            Not Required
                          </Typography>
                        )}
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Chip
                          size="small"
                          label={t.status}
                          sx={{
                            height: 20,
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            bgcolor:
                              t.status === 'Completed'
                                ? '#ecfdf5'
                                : t.status === 'In Progress'
                                ? '#eff6ff'
                                : '#f8fafc',
                            color:
                              t.status === 'Completed'
                                ? '#059669'
                                : t.status === 'In Progress'
                                ? '#2563eb'
                                : '#64748b',
                          }}
                        />
                      </TableCell>

                      {/* Action Buttons: Manage, Forward, Extend */}
                      <TableCell sx={{ textAlign: 'right' }}>
                        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => setSelectedTaskForManage(t)}
                            sx={{
                              py: 0.2,
                              px: 1,
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              textTransform: 'none',
                              borderRadius: 1.5,
                            }}
                          >
                            Manage
                          </Button>
                          <Button
                            size="small"
                            variant="text"
                            onClick={() => handleOpenForwardModal(t)}
                            startIcon={<SwapHorizIcon sx={{ fontSize: '13px !important' }} />}
                            sx={{
                              py: 0.2,
                              px: 0.8,
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              textTransform: 'none',
                              color: '#4f46e5',
                            }}
                          >
                            Forward
                          </Button>
                          <Button
                            size="small"
                            variant="text"
                            onClick={() => handleOpenExtensionModal(t)}
                            startIcon={<AccessTimeIcon sx={{ fontSize: '13px !important' }} />}
                            sx={{
                              py: 0.2,
                              px: 0.8,
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              textTransform: 'none',
                              color: '#d97706',
                            }}
                          >
                            Extend
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* MODAL 1: CREATE NEW TASK */}
      <Dialog
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
              Create New Task
            </Typography>
            <Chip size="small" label="Workflow" sx={{ bgcolor: '#eef2ff', color: '#4f46e5', fontWeight: 700 }} />
          </Box>
          <IconButton size="small" onClick={() => setIsAddModalOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* 1. Title */}
            <TextField
              label="Task Title *"
              size="small"
              fullWidth
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Q4 Raw Material Batch Inspection"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <VoiceButton
                      isListening={listeningField === 'newTitle'}
                      onClick={() => startVoiceInput('newTitle', (txt) => setNewTitle(txt))}
                    />
                  </InputAdornment>
                ),
              }}
            />

            {/* 2. Company & Multiple Assignees */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              {/* Company dropdown */}
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', display: 'block', mb: 0.5 }}>
                  Company Dropdown *
                </Typography>
                <Select fullWidth size="small" value={newCompany} onChange={(e) => setNewCompany(e.target.value)}>
                  {companies
                    .filter((c) => c.id !== 'All')
                    .map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        {c.name}
                      </MenuItem>
                    ))}
                </Select>
              </Box>

              {/* Multiple Employee Selection */}
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', display: 'block', mb: 0.5 }}>
                  Assignees (Multiple Selection) *
                </Typography>
                <Select
                  fullWidth
                  size="small"
                  multiple
                  value={newAssignees}
                  onChange={(e) => {
                    const value = e.target.value;
                    setNewAssignees(typeof value === 'string' ? value.split(',') : value);
                  }}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((val) => (
                        <Chip key={val} label={val} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }} />
                      ))}
                    </Box>
                  )}
                >
                  {staffMembers.map((s) => (
                    <MenuItem key={s} value={s}>
                      <Checkbox checked={newAssignees.indexOf(s) > -1} size="small" />
                      <Typography variant="caption" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                        {s}
                      </Typography>
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </Box>

            {/* 3. Description */}
            <TextField
              label="Description & Deliverables"
              size="small"
              multiline
              rows={2}
              fullWidth
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Detailed instructions for the assignment..."
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <VoiceButton
                      isListening={listeningField === 'newDesc'}
                      onClick={() => startVoiceInput('newDesc', (txt) => setNewDesc(txt))}
                    />
                  </InputAdornment>
                ),
              }}
            />

            {/* 4. Priority, Due Date, Repeat */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
              {/* Priority Dropdown (Critical on Top) */}
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', display: 'block', mb: 0.5 }}>
                  Priority *
                </Typography>
                <Select fullWidth size="small" value={newPriority} onChange={(e) => setNewPriority(e.target.value)}>
                  <MenuItem value="Critical">🔴 Critical (Top)</MenuItem>
                  <MenuItem value="High">🟠 High</MenuItem>
                  <MenuItem value="Medium">🟡 Medium</MenuItem>
                  <MenuItem value="Low">⚪ Low</MenuItem>
                </Select>
              </Box>

              {/* Due Date */}
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', display: 'block', mb: 0.5 }}>
                  Due Date *
                </Typography>
                <TextField
                  type="date"
                  size="small"
                  fullWidth
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                />
              </Box>

              {/* Repeat Dropdown */}
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', display: 'block', mb: 0.5 }}>
                  Repeat Cycle *
                </Typography>
                <Select fullWidth size="small" value={newRepeat} onChange={(e) => setNewRepeat(e.target.value)}>
                  <MenuItem value="None">None</MenuItem>
                  <MenuItem value="Daily">Daily</MenuItem>
                  <MenuItem value="Weekly">Weekly</MenuItem>
                  <MenuItem value="Monthly">Monthly (Fixed Date)</MenuItem>
                </Select>
              </Box>
            </Box>

            {/* Fixed Date for Monthly Repeat */}
            {newRepeat === 'Monthly' && (
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#4f46e5', display: 'block', mb: 0.5 }}>
                  Monthly Repeat Fixed Date (1 to 31):
                </Typography>
                <TextField
                  type="number"
                  size="small"
                  fullWidth
                  inputProps={{ min: 1, max: 31 }}
                  value={newRepeatMonthDate}
                  onChange={(e) => setNewRepeatMonthDate(e.target.value)}
                  helperText="Task will automatically recur on this day every month"
                />
              </Box>
            )}

            <Divider />

            {/* 5. Checkbox: Attachment Required */}
            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newRequireAttachment}
                    onChange={(e) => setNewRequireAttachment(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#0f172a', display: 'block' }}>
                      Require Attachment / Proof of Work on completion
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.65rem' }}>
                      Assignee must upload document, test report, or photo before marking task done.
                    </Typography>
                  </Box>
                }
              />
            </Box>

            {/* 6. Checkbox: 3rd Person Approval with Single Employee Dropdown */}
            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newRequireApproval}
                    onChange={(e) => setNewRequireApproval(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#0f172a', display: 'block' }}>
                      Require 3rd Person Approval
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.65rem' }}>
                      Task completion requires verification and sign-off by a designated supervisor.
                    </Typography>
                  </Box>
                }
              />

              {newRequireApproval && (
                <Box sx={{ mt: 1, pl: 4 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', display: 'block', mb: 0.5 }}>
                    Select Approver (Single Employee) *
                  </Typography>
                  <Select
                    fullWidth
                    size="small"
                    value={newApprover}
                    onChange={(e) => setNewApprover(e.target.value)}
                    sx={{ bgcolor: '#ffffff' }}
                  >
                    {staffMembers.map((s) => (
                      <MenuItem key={s} value={s}>
                        {s}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIsAddModalOpen(false)} color="inherit" sx={{ fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateTask}
            sx={{ bgcolor: '#0f172a', '&:hover': { bgcolor: '#1e293b' }, fontWeight: 700, borderRadius: 2 }}
          >
            Create Task
          </Button>
        </DialogActions>
      </Dialog>

      {/* MODAL 2: MANAGE TASK (Checklist, Approvals, Extensions & Attachments) */}
      <Dialog
        open={Boolean(selectedTaskForManage)}
        onClose={() => setSelectedTaskForManage(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        {selectedTaskForManage && (
          <>
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                  {selectedTaskForManage.id}: {selectedTaskForManage.title}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  {selectedTaskForManage.company} • Due: {selectedTaskForManage.dueDate} • Priority: {selectedTaskForManage.priority}
                </Typography>
              </Box>
              <IconButton size="small" onClick={() => setSelectedTaskForManage(null)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 2.5 }}>
              {/* Description */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', display: 'block' }}>
                  Description:
                </Typography>
                <Typography variant="caption" sx={{ color: '#334155', display: 'block', mt: 0.5 }}>
                  {selectedTaskForManage.description}
                </Typography>
              </Box>

              {/* Assignees */}
              <Box sx={{ mb: 2, p: 1.5, borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', display: 'block', mb: 0.5 }}>
                  Assigned Team Members:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {(selectedTaskForManage.assignees || [selectedTaskForManage.assignee || '']).map((a, i) => (
                    <Chip key={i} label={a} size="small" sx={{ fontWeight: 700, fontSize: '0.7rem' }} />
                  ))}
                </Box>
              </Box>

              {/* Subtask Checklist */}
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', display: 'block', mb: 1 }}>
                Deliverables & Subtask Checklist:
              </Typography>
              {(selectedTaskForManage.checklist || []).map((c) => (
                <Box key={c.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
                  <Checkbox
                    checked={c.completed}
                    onChange={() => toggleChecklistItem(selectedTaskForManage.id, c.id)}
                    size="small"
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: '0.75rem',
                      textDecoration: c.completed ? 'line-through' : 'none',
                      color: c.completed ? '#94a3b8' : '#1e293b',
                    }}
                  >
                    {c.title || c.text}
                  </Typography>
                </Box>
              ))}

              {/* Attachment Proof Requirement */}
              {selectedTaskForManage.attachmentRequired && (
                <Box sx={{ mt: 2, p: 1.5, borderRadius: 2, bgcolor: '#eff6ff', border: '1px solid #bfdbfe' }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#1e40af', display: 'block' }}>
                    Attachment / Proof of Work Required
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#3b82f6', display: 'block', mb: 1 }}>
                    Upload execution document or signed voucher before task completion.
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<UploadFileIcon />}
                    onClick={() => triggerToast('File uploaded and attached to task deliverables!')}
                    sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.7rem' }}
                  >
                    Upload Proof Document (PDF / Image)
                  </Button>
                </Box>
              )}

              {/* 3rd Person Approval Section */}
              {selectedTaskForManage.approval?.required && (
                <Box sx={{ mt: 2, p: 1.5, borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#0f172a', display: 'block' }}>
                        3rd Person Approver: {selectedTaskForManage.approval.approver}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        Status: <b>{selectedTaskForManage.approval.status}</b>
                      </Typography>
                    </Box>
                    {selectedTaskForManage.approval.status === 'Pending Approval' && (
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleApproveTask(selectedTaskForManage.id)}
                        sx={{ bgcolor: '#059669', '&:hover': { bgcolor: '#047857' }, textTransform: 'none', fontWeight: 700, fontSize: '0.7rem' }}
                      >
                        Approve Task
                      </Button>
                    )}
                  </Box>
                </Box>
              )}

              {/* Pending Extension Request */}
              {selectedTaskForManage.extensionRequest && selectedTaskForManage.extensionRequest.status === 'Pending' && (
                <Box sx={{ mt: 2, p: 1.5, borderRadius: 2, bgcolor: '#fffbeb', border: '1px solid #fef3c7' }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#d97706', display: 'block' }}>
                    Pending Extension Request:
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#92400e', display: 'block', mt: 0.5 }}>
                    Requested New Date: <b>{selectedTaskForManage.extensionRequest.requestedDate}</b>
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#b45309', display: 'block' }}>
                    Reason: {selectedTaskForManage.extensionRequest.reason}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleApproveExtension(selectedTaskForManage.id)}
                      sx={{ bgcolor: '#d97706', '&:hover': { bgcolor: '#b45309' }, textTransform: 'none', fontWeight: 700, fontSize: '0.7rem' }}
                    >
                      Approve Extension
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="inherit"
                      onClick={() => handleRejectExtension(selectedTaskForManage.id)}
                      sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.7rem' }}
                    >
                      Reject
                    </Button>
                  </Box>
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    handleOpenForwardModal(selectedTaskForManage);
                    setSelectedTaskForManage(null);
                  }}
                  startIcon={<SwapHorizIcon />}
                  sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.7rem' }}
                >
                  Forward Task
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    handleOpenExtensionModal(selectedTaskForManage);
                    setSelectedTaskForManage(null);
                  }}
                  startIcon={<AccessTimeIcon />}
                  sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.7rem', color: '#d97706' }}
                >
                  Request Extension
                </Button>
              </Box>
              <Button onClick={() => setSelectedTaskForManage(null)} color="inherit" sx={{ fontWeight: 600 }}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* MODAL 3: REQUEST DUE DATE EXTENSION */}
      <Dialog
        open={isExtensionModalOpen}
        onClose={() => setIsExtensionModalOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
              Request Due Date Extension
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              {taskForExtension?.id} • Current Due: {taskForExtension?.dueDate}
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setIsExtensionModalOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', display: 'block', mb: 0.5 }}>
                Requested New Due Date *
              </Typography>
              <TextField
                type="date"
                size="small"
                fullWidth
                value={extensionNewDate}
                onChange={(e) => setExtensionNewDate(e.target.value)}
              />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', display: 'block', mb: 0.5 }}>
                Reason for Extension *
              </Typography>
              <TextField
                size="small"
                multiline
                rows={3}
                fullWidth
                placeholder="State operational constraints or lab testing delays..."
                value={extensionReason}
                onChange={(e) => setExtensionReason(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <VoiceButton
                        isListening={listeningField === 'extensionReason'}
                        onClick={() => startVoiceInput('extensionReason', (txt) => setExtensionReason(txt))}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIsExtensionModalOpen(false)} color="inherit" sx={{ fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitExtension}
            sx={{ bgcolor: '#d97706', '&:hover': { bgcolor: '#b45309' }, fontWeight: 700, borderRadius: 2 }}
          >
            Submit Extension Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* MODAL 4: FORWARD / REASSIGN TASK */}
      <Dialog
        open={isForwardModalOpen}
        onClose={() => setIsForwardModalOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
              Forward Task / Reassign
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              {taskForForward?.id}: {taskForForward?.title}
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setIsForwardModalOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', display: 'block', mb: 0.5 }}>
                Forward / Assign To Employee *
              </Typography>
              <Select
                fullWidth
                size="small"
                value={forwardEmployee}
                onChange={(e) => setForwardEmployee(e.target.value)}
              >
                {staffMembers.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', display: 'block', mb: 0.5 }}>
                Forwarding Handover Notes & Instructions
              </Typography>
              <TextField
                size="small"
                multiline
                rows={3}
                fullWidth
                placeholder="Provide briefing notes or handover context for the recipient..."
                value={forwardNote}
                onChange={(e) => setForwardNote(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <VoiceButton
                        isListening={listeningField === 'forwardNote'}
                        onClick={() => startVoiceInput('forwardNote', (txt) => setForwardNote(txt))}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIsForwardModalOpen(false)} color="inherit" sx={{ fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitForward}
            sx={{ bgcolor: '#4f46e5', '&:hover': { bgcolor: '#4338ca' }, fontWeight: 700, borderRadius: 2 }}
          >
            Confirm Forward
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
