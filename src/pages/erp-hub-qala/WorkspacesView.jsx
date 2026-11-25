import React from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  Button,
  Chip,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

export default function WorkspacesView({
  activeNav,
  currentCompanyObj,
  workspacesConfig,
  onSelectWorkspace,
}) {
  // If activeNav is a specific workspace (e.g. 'Accounts', 'Sales', 'CRM', etc.)
  const selectedWorkspace = workspacesConfig.find((ws) => ws.id === activeNav);

  if (activeNav !== 'Workspaces' && selectedWorkspace) {
    const Icon = selectedWorkspace.icon;
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Card elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: '#eef2ff',
                color: '#4f46e5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon style={{ width: 24, height: 24 }} />
            </Box>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                  {selectedWorkspace.title} Workspace
                </Typography>
                <Chip
                  size="small"
                  label={currentCompanyObj.name}
                  sx={{ bgcolor: '#ecfdf5', color: '#059669', fontWeight: 700, fontSize: '0.7rem' }}
                />
              </Box>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                {selectedWorkspace.desc}
              </Typography>
            </Box>
          </Box>
        </Card>

        {/* Operational Workspace Status */}
        <Card elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#ffffff', textAlign: 'center' }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 0.8,
              borderRadius: 9999,
              bgcolor: '#ecfdf5',
              color: '#059669',
              mb: 2,
            }}
          >
            <CheckCircleOutlinedIcon sx={{ fontSize: 18 }} />
            <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>
              Operational Module Live & Connected
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
            {selectedWorkspace.title} Department Operations for {currentCompanyObj.name}
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b', maxWidth: 480, display: 'block', mx: 'auto', mb: 3 }}>
            All active ledgers, transactions, vouchers, workflow stages and approvals for {currentCompanyObj.name} are synchronized in real-time with Central ERP Hub.
          </Typography>
          <Button
            variant="outlined"
            onClick={() => onSelectWorkspace('Workspaces')}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
          >
            ← Back to All Workspaces
          </Button>
        </Card>
      </Box>
    );
  }

  // Otherwise, render full Workspaces Overview Grid (when activeNav === 'Workspaces')
  const availableWorkspaces = workspacesConfig.filter((ws) => ws.id !== 'Task');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {/* Header Banner */}
      <Card elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
              {currentCompanyObj.name} Workspaces & Departments
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Select an operational module to open department workspace
            </Typography>
          </Box>
          <Chip
            size="small"
            label={`${availableWorkspaces.length} Operational Modules`}
            sx={{ bgcolor: '#f1f5f9', fontWeight: 700, fontSize: '0.7rem' }}
          />
        </Box>
      </Card>

      {/* Grid of Workspaces */}
      <Grid container spacing={2}>
        {availableWorkspaces.map((ws) => {
          const Icon = ws.icon;
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={ws.id}>
              <Card
                elevation={0}
                onClick={() => onSelectWorkspace(ws.id)}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#818cf8',
                    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.08)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Box>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 2,
                      bgcolor: '#eef2ff',
                      color: '#4f46e5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 1.5,
                    }}
                  >
                    <Icon style={{ width: 18, height: 18 }} />
                  </Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                    {ws.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem', display: 'block', mt: 0.5 }}>
                    {ws.desc}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2, pt: 1, borderTop: '1px solid #f8fafc' }}>
                  <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#4f46e5' }}>
                    Open Module
                  </Typography>
                  <ArrowForwardIcon sx={{ fontSize: 14, color: '#4f46e5' }} />
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
