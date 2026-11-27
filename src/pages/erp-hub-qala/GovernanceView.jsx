import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Chip,
  Switch,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  InputAdornment,
} from '@mui/material';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

export default function GovernanceView({
  activeNav,
  initialEmployees,
  initialUsers,
  users: controlledUsers,
  setUsers: setControlledUsers,
  companies = [],
  initialRoles,
  rightsModules,
  initialRightsMatrix,
  triggerToast,
}) {
  const [internalUsers, setInternalUsers] = useState(
    (initialUsers || []).map((u) => ({
      ...u,
      loginId: u.loginId || u.email,
      password: u.password || '123456',
    }))
  );
  const users = controlledUsers !== undefined ? controlledUsers : internalUsers;
  const setUsers = setControlledUsers !== undefined ? setControlledUsers : setInternalUsers;

  const [revealedPasswords, setRevealedPasswords] = useState({});
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showModalPassword, setShowModalPassword] = useState(false);

  // User Form state
  const [userName, setUserName] = useState('');
  const [userLoginId, setUserLoginId] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userRole, setUserRole] = useState('Operations Manager');
  const [userCompanies, setUserCompanies] = useState(['Siona Plasto']);

  const companyOptions = companies.filter((c) => c.id !== 'All').map((c) => c.id);
  const availableCompanies =
    companyOptions.length > 0
      ? companyOptions
      : ['Siona Plasto', 'Sudhi Impex', 'Swati Enterprise', 'Vilaano'];

  const handleOpenAddUser = () => {
    setEditingUser(null);
    setUserName('');
    setUserLoginId('');
    setUserPassword('');
    setUserRole(initialRoles?.[1]?.name || 'Operations Manager');
    setUserCompanies([availableCompanies[0]]);
    setShowModalPassword(false);
    setIsUserModalOpen(true);
  };

  const handleOpenEditUser = (u) => {
    setEditingUser(u);
    setUserName(u.name || '');
    setUserLoginId(u.loginId || u.email || '');
    setUserPassword(u.password || '123456');
    setUserRole(u.role || 'Operations Manager');
    setUserCompanies(u.companies || [availableCompanies[0]]);
    setShowModalPassword(false);
    setIsUserModalOpen(true);
  };

  const handleToggleUserCompany = (comp) => {
    setUserCompanies((prev) =>
      prev.includes(comp) ? prev.filter((c) => c !== comp) : [...prev, comp]
    );
  };

  const handleSaveUser = () => {
    if (!userName.trim()) {
      triggerToast('Please enter employee name', 'error');
      return;
    }
    if (!userLoginId.trim()) {
      triggerToast('Please enter login ID', 'error');
      return;
    }
    if (!userPassword.trim()) {
      triggerToast('Please enter password', 'error');
      return;
    }

    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                name: userName.trim(),
                loginId: userLoginId.trim(),
                email: userLoginId.trim(),
                password: userPassword,
                role: userRole,
                companies: userCompanies.length > 0 ? userCompanies : [availableCompanies[0]],
              }
            : u
        )
      );
      triggerToast(`Updated login credentials for ${userName.trim()}!`);
    } else {
      const nextNum = users.length + 1;
      const newId = `USR-${nextNum < 10 ? `0${nextNum}` : nextNum}`;
      const newUser = {
        id: newId,
        name: userName.trim(),
        loginId: userLoginId.trim(),
        email: userLoginId.trim(),
        password: userPassword,
        role: userRole,
        companies: userCompanies.length > 0 ? userCompanies : [availableCompanies[0]],
        active: true,
        lastLogin: 'Never',
      };
      setUsers((prev) => [...prev, newUser]);
      triggerToast(`Added employee login ${newId} (${userName.trim()})!`);
    }
    setIsUserModalOpen(false);
  };

  const handleDeleteUser = (u) => {
    setUsers((prev) => prev.filter((item) => item.id !== u.id));
    triggerToast(`Deleted user ${u.name} (${u.id})`, 'info');
  };
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {/* HRMS View */}
      {activeNav === 'HRMS' && (
        <Card elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
            HRMS & Central Workforce Directory
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 2 }}>
            Central personnel records across all group subsidiaries and manufacturing facilities
          </Typography>

          <TableContainer component={Paper} elevation={0}>
            <Table size="small">
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Emp ID</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Employee Name</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Company</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Department</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Designation</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {initialEmployees.map((emp) => (
                  <TableRow key={emp.id} hover>
                    <TableCell sx={{ fontWeight: 700, fontFamily: 'monospace', color: '#4f46e5' }}>{emp.id}</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>{emp.name}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{emp.company}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{emp.department}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{emp.role}</TableCell>
                    <TableCell>
                      <Chip size="small" label={emp.status} sx={{ height: 20, fontSize: '0.65rem', bgcolor: '#ecfdf5', color: '#059669', fontWeight: 700 }} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* User Management View */}
      {activeNav === 'User' && (
        <Card elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                User Management & Subsidiary Access
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                Manage employee login IDs, passwords, subsidiary assignments and access levels
              </Typography>
            </Box>

            <Button
              variant="contained"
              size="small"
              onClick={handleOpenAddUser}
              startIcon={<AddCircleOutlinedIcon />}
              sx={{
                bgcolor: '#4f46e5',
                '&:hover': { bgcolor: '#4338ca' },
                borderRadius: 2,
                fontWeight: 700,
                textTransform: 'none',
                px: 2,
              }}
            >
              Add Employee Login
            </Button>
          </Box>

          <TableContainer component={Paper} elevation={0}>
            <Table size="small">
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>User ID</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Employee Name</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Login ID</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Password</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Assigned Role</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Accessible Companies</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', textAlign: 'right' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((u) => {
                  const isRevealed = Boolean(revealedPasswords[u.id]);
                  return (
                    <TableRow key={u.id} hover>
                      <TableCell sx={{ fontWeight: 700, fontFamily: 'monospace', color: '#4f46e5' }}>{u.id}</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>{u.name}</TableCell>
                      <TableCell sx={{ fontSize: '0.75rem', color: '#334155', fontWeight: 600 }}>
                        {u.loginId || u.email}
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#475569' }}>
                        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                          <span>{isRevealed ? (u.password || '123456') : '••••••'}</span>
                          <IconButton
                            size="small"
                            onClick={() =>
                              setRevealedPasswords((prev) => ({ ...prev, [u.id]: !prev[u.id] }))
                            }
                            sx={{ p: 0.25, color: '#64748b' }}
                            title={isRevealed ? 'Hide password' : 'Show password'}
                          >
                            {isRevealed ? (
                              <VisibilityOffOutlinedIcon sx={{ fontSize: 14 }} />
                            ) : (
                              <VisibilityOutlinedIcon sx={{ fontSize: 14 }} />
                            )}
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{u.role}</TableCell>
                      <TableCell sx={{ fontSize: '0.75rem' }}>
                        {(u.companies || ['All']).join(', ')}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'right' }}>
                        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenEditUser(u)}
                            sx={{ color: '#4f46e5' }}
                            title="Edit Employee"
                          >
                            <EditOutlinedIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteUser(u)}
                            sx={{ color: '#e11d48' }}
                            title="Delete Employee"
                          >
                            <DeleteOutlinedIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Role Scopes View */}
      {activeNav === 'Role' && (
        <Card elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
            Role Scopes & Governance Hierarchy
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 2 }}>
            Enterprise permission levels and administrative hierarchy
          </Typography>

          <Grid container spacing={2}>
            {initialRoles.map((r) => (
              <Grid item xs={12} sm={6} md={3} key={r.id}>
                <Card elevation={0} sx={{ p: 2, borderRadius: 2.5, border: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                    {r.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.5 }}>
                    {r.description}
                  </Typography>
                  <Chip
                    size="small"
                    label={`Level ${r.level}`}
                    sx={{ mt: 1.5, height: 20, fontSize: '0.65rem', fontWeight: 700, bgcolor: '#eef2ff', color: '#4f46e5' }}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
        </Card>
      )}

      {/* Rights Matrix View */}
      {activeNav === 'Rights' && (
        <Card elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
            RBAC Module Rights Matrix
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 2 }}>
            Fine-grained module access controls across enterprise roles
          </Typography>

          <TableContainer component={Paper} elevation={0}>
            <Table size="small">
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Module Name</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Super Admin</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Subsidiary Admin</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Plant Manager</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Operator</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rightsModules.map((mod) => (
                  <TableRow key={mod} hover>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>{mod}</TableCell>
                    <TableCell><Chip size="small" label="Full Access" sx={{ bgcolor: '#ecfdf5', color: '#059669', height: 20, fontSize: '0.65rem', fontWeight: 700 }} /></TableCell>
                    <TableCell><Chip size="small" label="Subsidiary" sx={{ bgcolor: '#eff6ff', color: '#2563eb', height: 20, fontSize: '0.65rem', fontWeight: 700 }} /></TableCell>
                    <TableCell><Chip size="small" label="Plant Only" sx={{ bgcolor: '#fffbeb', color: '#d97706', height: 20, fontSize: '0.65rem', fontWeight: 700 }} /></TableCell>
                    <TableCell><Chip size="small" label="Read-Only" sx={{ bgcolor: '#f1f5f9', color: '#475569', height: 20, fontSize: '0.65rem', fontWeight: 700 }} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* System Control View */}
      {activeNav === 'Control' && (
        <Card elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
            System Control & Group Governance
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 2 }}>
            Manage group policies, automated sync, multi-company auditing and security locks
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              { title: 'Automated Real-Time Webhook Synchronization', desc: 'Sync inventory ledger events across all 4 plants immediately upon GRN recording.', defaultChecked: true },
              { title: 'Strict Two-Person Approval for Stock Dispatches > ₹10,000', desc: 'Require digital signature from plant supervisor before clearing dispatch note.', defaultChecked: true },
              { title: 'Live Camera Barcode Scanner Optimization', desc: 'Allow mobile and desktop browsers to access camera scanner with instant cancel.', defaultChecked: true },
              { title: 'Automated Nightly Database Snapshots', desc: 'Take incremental backup of all companies database to cloud storage.', defaultChecked: true },
            ].map((item, idx) => (
              <Box key={idx} sx={{ p: 2, borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>{item.title}</Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>{item.desc}</Typography>
                </Box>
                <Switch defaultChecked={item.defaultChecked} onChange={() => triggerToast('System policy updated!')} />
              </Box>
            ))}
          </Box>
        </Card>
      )}

      {/* Add / Edit Employee Login Dialog */}
      <Dialog
        open={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a' }}>
            {editingUser ? `Edit Employee Login — ${editingUser.id}` : 'Add Employee Login'}
          </Typography>
          <IconButton size="small" onClick={() => setIsUserModalOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            size="small"
            label="Employee Name *"
            placeholder="e.g. Rahul Verma"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <TextField
            fullWidth
            size="small"
            label="Login ID *"
            placeholder="e.g. rahul@sionaplasto.in"
            value={userLoginId}
            onChange={(e) => setUserLoginId(e.target.value)}
          />
          <TextField
            fullWidth
            size="small"
            label="Password *"
            type={showModalPassword ? 'text' : 'password'}
            placeholder="Enter password"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setShowModalPassword((prev) => !prev)}
                  >
                    {showModalPassword ? (
                      <VisibilityOffOutlinedIcon fontSize="small" />
                    ) : (
                      <VisibilityOutlinedIcon fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', display: 'block', mb: 0.5 }}>
              Assigned Role
            </Typography>
            <Select
              fullWidth
              size="small"
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
            >
              {(initialRoles || []).map((r) => (
                <MenuItem key={r.id} value={r.name}>
                  {r.name}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', display: 'block', mb: 0.5 }}>
              Accessible Companies
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.5 }}>
              {availableCompanies.map((comp) => (
                <FormControlLabel
                  key={comp}
                  control={
                    <Checkbox
                      size="small"
                      checked={userCompanies.includes(comp)}
                      onChange={() => handleToggleUserCompany(comp)}
                    />
                  }
                  label={<Typography variant="caption" sx={{ fontWeight: 600 }}>{comp}</Typography>}
                />
              ))}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 2.5, py: 1.5 }}>
          <Button
            size="small"
            onClick={() => setIsUserModalOpen(false)}
            sx={{ textTransform: 'none', fontWeight: 700, color: '#64748b' }}
          >
            Cancel
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={handleSaveUser}
            sx={{
              bgcolor: '#4f46e5',
              '&:hover': { bgcolor: '#4338ca' },
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: 2,
              px: 2,
            }}
          >
            {editingUser ? 'Save Changes' : 'Add Employee'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
