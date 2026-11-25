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
} from '@mui/material';
import PlusIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import RepeatIcon from '@mui/icons-material/Repeat';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import AttachFileIcon from '@mui/icons-material/AttachFile';
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
  const [companyFilter, setCompanyFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTaskForManage, setSelectedTaskForManage] = useState(null);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCompany, setNewCompany] = useState('Siona Plasto');
  const [newAssignee, setNewAssignee] = useState(staffMembers[0] || 'Deepak Sharma');
  const [newPriority, setNewPriority] = useState('High');
  const [newDueDate, setNewDueDate] = useState('2026-11-30');
  const [newRepeat, setNewRepeat] = useState('None');

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (companyFilter !== 'All' && t.company !== companyFilter) return false;
      if (statusFilter !== 'All' && t.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = (t.id || '').toLowerCase().includes(q);
        const matchesTitle = (t.title || '').toLowerCase().includes(q);
        const matchesCompany = (t.company || '').toLowerCase().includes(q);
        const matchesAssignees = (t.assignees || [t.assignee || '']).some((a) =>
          a.toLowerCase().includes(q)
        );
        return matchesId || matchesTitle || matchesCompany || matchesAssignees;
      }
      return true;
    });
  }, [tasks, companyFilter, statusFilter, searchQuery]);

  // Metrics
  const totalTasks = tasks.length;
  const inProgressCount = tasks.filter((t) => t.status === 'In Progress').length;
  const pendingCount = tasks.filter((t) => t.status === 'Pending').length;
  const completedCount = tasks.filter((t) => t.status === 'Completed').length;
  const extensionCount = tasks.filter(
    (t) => t.extensionRequest && t.extensionRequest.status === 'Pending'
  ).length;

  const handleCreateTask = () => {
    if (!newTitle.trim()) {
      alert('Please enter a task title');
      return;
    }
    const newTask = {
      id: `TSK-${1050 + tasks.length}`,
      title: newTitle.trim(),
      description: newDesc.trim() || 'Operational assignment across plant divisions.',
      company: newCompany,
      assignees: [newAssignee],
      priority: newPriority,
      status: 'In Progress',
      dueDate: newDueDate,
      repeat: newRepeat,
      checklist: [
        { id: '1', title: 'Initial verification', completed: false },
        { id: '2', title: 'Execute assignment deliverables', completed: false },
      ],
      approval: { required: true, status: 'Pending Approval', approver: 'Rajesh Sharma' },
    };
    setTasks((prev) => [newTask, ...prev]);
    triggerToast(`Task ${newTask.id} created successfully!`);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewDesc('');
  };

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
            </Box>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Central task tracker across Siona Plasto, Sudhi Impex, Swati Enterprise & Vilaano with recurring cycles, approvals & extensions.
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="small"
            onClick={() => setIsAddModalOpen(true)}
            startIcon={<PlusIcon />}
            sx={{ bgcolor: '#0f172a', '&:hover': { bgcolor: '#1e293b' }, borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
          >
            Add New Task
          </Button>
        </Box>
      </Card>

      {/* Metrics Row */}
      <Grid container spacing={2}>
        <Grid item xs={6} sm={3}>
          <Card elevation={0} sx={{ p: 2, borderRadius: 2.5, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', textTransform: 'uppercase', fontSize: '0.65rem' }}>
              Total Group Tasks
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mt: 0.5 }}>
              {totalTasks}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card elevation={0} sx={{ p: 2, borderRadius: 2.5, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', fontSize: '0.65rem' }}>
              In Progress
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#2563eb', mt: 0.5 }}>
              {inProgressCount}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card elevation={0} sx={{ p: 2, borderRadius: 2.5, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#d97706', textTransform: 'uppercase', fontSize: '0.65rem' }}>
              Extension Requests
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#d97706', mt: 0.5 }}>
              {extensionCount} Pending
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
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
        {/* Company Pills & Status Pills & Search */}
        <Box sx={{ p: 2, borderBottom: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {/* Company Pills */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', mr: 0.5 }}>Company:</Typography>
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
            {companies.filter((c) => c.id !== 'All').map((c) => {
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

          {/* Status Pills & Search */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', mr: 0.5 }}>Status:</Typography>
              {['All', 'In Progress', 'Pending', 'Completed'].map((st) => (
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
            </Box>

            <TextField
              size="small"
              placeholder="Search title, @company, staff, id..."
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
                sx: { fontSize: '0.75rem', height: 36, width: { xs: 200, sm: 260 }, bgcolor: '#f8fafc', borderRadius: 2 },
              }}
            />
          </Box>
        </Box>

        {/* Tasks Table */}
        <TableContainer component={Paper} elevation={0}>
          <Table size="small">
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#64748b' }}>Task ID</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#64748b', minWidth: 200 }}>Title & Description</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#64748b' }}>Company</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#64748b' }}>Assignees</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#64748b' }}>Due Date</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#64748b' }}>Checklist</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#64748b' }}>Approval</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#64748b' }}>Priority</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#64748b' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#64748b', textAlign: 'right' }}>Action</TableCell>
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
                  return (
                    <TableRow key={t.id} hover>
                      <TableCell sx={{ fontWeight: 800, fontFamily: 'monospace', color: '#4f46e5', fontSize: '0.75rem' }}>
                        {t.id}
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#0f172a', display: 'block' }}>
                          {t.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.65rem', display: 'block', maxWidth: 260, truncate: true }}>
                          {t.description}
                        </Typography>
                        {t.repeat && t.repeat !== 'None' && (
                          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, mt: 0.5, color: '#4f46e5' }}>
                            <RepeatIcon sx={{ fontSize: 12 }} />
                            <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 700 }}>
                              Repeats {t.repeat}
                            </Typography>
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip size="small" label={t.company} sx={{ height: 20, fontSize: '0.65rem', fontWeight: 600 }} />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AvatarGroup max={2} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: 10 } }}>
                            {assignees.map((a, i) => (
                              <Avatar key={i}>{a.split(' ').map((n) => n[0]).join('')}</Avatar>
                            ))}
                          </AvatarGroup>
                          <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#475569', fontWeight: 600 }}>
                            {assignees.join(', ')}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ fontSize: '0.75rem', fontWeight: 600, display: 'block' }}>
                          {t.dueDate}
                        </Typography>
                        {t.extensionRequest && t.extensionRequest.status === 'Pending' && (
                          <Chip size="small" label={`Ext: ${t.extensionRequest.requestedDate}`} sx={{ height: 18, fontSize: '0.6rem', bgcolor: '#fffbeb', color: '#d97706', fontWeight: 700 }} />
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ fontSize: '0.75rem', fontWeight: 700, color: checkDone === checkTotal && checkTotal > 0 ? '#059669' : '#64748b' }}>
                          {checkDone}/{checkTotal} done
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={t.approval?.status || 'Approved'}
                          sx={{
                            height: 20,
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            bgcolor: t.approval?.status === 'Pending Approval' ? '#fffbeb' : '#ecfdf5',
                            color: t.approval?.status === 'Pending Approval' ? '#d97706' : '#059669',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={t.priority}
                          sx={{
                            height: 20,
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            bgcolor: t.priority === 'High' ? '#fff1f2' : '#f1f5f9',
                            color: t.priority === 'High' ? '#e11d48' : '#475569',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={t.status}
                          sx={{
                            height: 20,
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            bgcolor: t.status === 'Completed' ? '#ecfdf5' : t.status === 'In Progress' ? '#eff6ff' : '#f8fafc',
                            color: t.status === 'Completed' ? '#059669' : t.status === 'In Progress' ? '#2563eb' : '#64748b',
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ textAlign: 'right' }}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => setSelectedTaskForManage(t)}
                          sx={{
                            py: 0.2,
                            px: 1.2,
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            textTransform: 'none',
                            borderRadius: 1.5,
                          }}
                        >
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* MODAL: ADD TASK */}
      <Dialog open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Create New Task</Typography>
          <IconButton size="small" onClick={() => setIsAddModalOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Task Title *" size="small" fullWidth value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            <TextField label="Description & Deliverables" size="small" multiline rows={2} fullWidth value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', display: 'block', mb: 0.5 }}>Company</Typography>
                <Select fullWidth size="small" value={newCompany} onChange={(e) => setNewCompany(e.target.value)}>
                  {companies.filter((c) => c.id !== 'All').map((c) => (
                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                  ))}
                </Select>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', display: 'block', mb: 0.5 }}>Assignee</Typography>
                <Select fullWidth size="small" value={newAssignee} onChange={(e) => setNewAssignee(e.target.value)}>
                  {staffMembers.map((s) => (
                    <MenuItem key={s} value={s}>{s}</MenuItem>
                  ))}
                </Select>
              </Box>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', display: 'block', mb: 0.5 }}>Priority</Typography>
                <Select fullWidth size="small" value={newPriority} onChange={(e) => setNewPriority(e.target.value)}>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </Select>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', display: 'block', mb: 0.5 }}>Due Date</Typography>
                <TextField type="date" size="small" fullWidth value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', display: 'block', mb: 0.5 }}>Repeat</Typography>
                <Select fullWidth size="small" value={newRepeat} onChange={(e) => setNewRepeat(e.target.value)}>
                  <MenuItem value="None">None</MenuItem>
                  <MenuItem value="Weekly">Weekly</MenuItem>
                  <MenuItem value="Monthly">Monthly</MenuItem>
                </Select>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIsAddModalOpen(false)} color="inherit">Cancel</Button>
          <Button variant="contained" onClick={handleCreateTask} sx={{ bgcolor: '#0f172a' }}>Create Task</Button>
        </DialogActions>
      </Dialog>

      {/* MODAL: MANAGE TASK */}
      <Dialog open={Boolean(selectedTaskForManage)} onClose={() => setSelectedTaskForManage(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        {selectedTaskForManage && (
          <>
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>{selectedTaskForManage.id}: {selectedTaskForManage.title}</Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>{selectedTaskForManage.company} • Due: {selectedTaskForManage.dueDate}</Typography>
              </Box>
              <IconButton size="small" onClick={() => setSelectedTaskForManage(null)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 2.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', display: 'block', mb: 1 }}>
                Deliverables & Subtask Checklist:
              </Typography>
              {(selectedTaskForManage.checklist || []).map((c) => (
                <Box key={c.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
                  <Checkbox checked={c.completed} onChange={() => toggleChecklistItem(selectedTaskForManage.id, c.id)} size="small" />
                  <Typography variant="caption" sx={{ fontSize: '0.75rem', textDecoration: c.completed ? 'line-through' : 'none', color: c.completed ? '#94a3b8' : '#1e293b' }}>
                    {c.title}
                  </Typography>
                </Box>
              ))}

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
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => handleApproveExtension(selectedTaskForManage.id)}
                    sx={{ mt: 1, bgcolor: '#d97706', '&:hover': { bgcolor: '#b45309' }, textTransform: 'none', fontWeight: 700, fontSize: '0.7rem' }}
                  >
                    Approve Extension Request
                  </Button>
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setSelectedTaskForManage(null)} color="inherit">Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
