import React from 'react';
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
  FormControlLabel,
} from '@mui/material';

export default function GovernanceView({
  activeNav,
  initialEmployees,
  initialUsers,
  initialRoles,
  rightsModules,
  initialRightsMatrix,
  triggerToast,
}) {
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
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
            User Management & Subsidiary Access
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 2 }}>
            Manage system logins, subsidiary assignments and access levels
          </Typography>

          <TableContainer component={Paper} elevation={0}>
            <Table size="small">
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>User ID</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>User Name</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Assigned Role</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Accessible Companies</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {initialUsers.map((u) => (
                  <TableRow key={u.id} hover>
                    <TableCell sx={{ fontWeight: 700, fontFamily: 'monospace', color: '#4f46e5' }}>{u.id}</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>{u.name}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', color: '#64748b' }}>{u.email}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{u.role}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>
                      {(u.companies || ['All']).join(', ')}
                    </TableCell>
                  </TableRow>
                ))}
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
    </Box>
  );
}
