import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Chip,
  Paper,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import SouthWestIcon from '@mui/icons-material/SouthWest';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import StatCard from '../../components/common/StatCard';

export default function DashboardView({
  isGlobalMode,
  selectedCompany,
  currentCompanyObj,
  companies,
  companyOperationsData,
  initialActivity,
  stockItems,
  stockInRecords,
  stockOutRecords,
  onSelectCompany,
  onNavigate,
}) {
  if (isGlobalMode) {
    /* Central Group Dashboard */
    const totalGroupHolding = stockItems.reduce((acc, it) => acc + (it.stock || 0), 0);
    const totalGroupValuation = stockItems.reduce(
      (acc, it) => acc + (it.stock || 0) * (it.price || it.unitPrice || 0),
      0
    );

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* KPI Summary Cards */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Consolidated Valuation"
              value={`₹${totalGroupValuation.toLocaleString()}`}
              subtext={`Across 4 active operating companies`}
              icon={CurrencyRupeeIcon}
              iconColor="#059669"
              iconBg="#ecfdf5"
              actionText="View Inventory →"
              onAction={() => onNavigate('Inventory')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Catalog SKUs"
              value={stockItems.length}
              subtext={`${stockItems.filter((i) => i.stock <= (i.minStock || 0)).length} low stock alerts`}
              icon={Inventory2OutlinedIcon}
              iconColor="#4f46e5"
              iconBg="#eef2ff"
              actionText="Manage Stock →"
              onAction={() => onNavigate('Inventory')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Group Inward Receipts"
              value={stockInRecords.length}
              subtext="Logged across manufacturing plants"
              icon={SouthWestIcon}
              iconColor="#d97706"
              iconBg="#fffbeb"
              actionText="View Inward Ledger →"
              onAction={() => onNavigate('Inventory')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Outward Dispatches"
              value={stockOutRecords.length}
              subtext="Dispatched to distributors & stores"
              icon={NorthEastIcon}
              iconColor="#e11d48"
              iconBg="#fff1f2"
              actionText="View Dispatches →"
              onAction={() => onNavigate('Inventory')}
            />
          </Grid>
        </Grid>

        {/* 4 Company Operation Cards */}
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
            Subsidiary Operating Entities
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 2 }}>
            Switch directly to individual company workspaces and inventories
          </Typography>

          <Grid container spacing={2.5}>
            {companies
              .filter((c) => c.id !== 'All')
              .map((comp) => {
                const ops = companyOperationsData[comp.id] || companyOperationsData['Siona Plasto'];
                const compStockCount = stockItems.filter((i) => i.company === comp.id).length;
                const compValuation = stockItems
                  .filter((i) => i.company === comp.id)
                  .reduce((sum, it) => sum + it.stock * (it.price || it.unitPrice || 0), 0);

                return (
                  <Grid item xs={12} sm={6} md={3} key={comp.id}>
                    <Card
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        border: '1px solid #e2e8f0',
                        backgroundColor: '#ffffff',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '100%',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: '#cbd5e1',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                        },
                      }}
                    >
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                            {comp.name}
                          </Typography>
                          <Chip
                            size="small"
                            label={comp.short}
                            sx={{
                              height: 20,
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              bgcolor: '#f1f5f9',
                              color: '#475569',
                            }}
                          />
                        </Box>
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 2 }}>
                          {comp.sector} • {comp.location}
                        </Typography>

                        <Box
                          sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: 1,
                            p: 1.2,
                            borderRadius: 2,
                            bgcolor: '#f8fafc',
                            mb: 2,
                            textAlign: 'center',
                          }}
                        >
                          <Box>
                            <Typography variant="caption" sx={{ fontSize: '0.65rem', color: '#64748b', display: 'block' }}>
                              Orders
                            </Typography>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#0f172a' }}>
                              {ops.metrics?.orders || 142}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" sx={{ fontSize: '0.65rem', color: '#64748b', display: 'block' }}>
                              SKUs
                            </Typography>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#0f172a' }}>
                              {compStockCount}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" sx={{ fontSize: '0.65rem', color: '#64748b', display: 'block' }}>
                              Value
                            </Typography>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#059669' }}>
                              ₹{(compValuation / 100000).toFixed(1)}L
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      <Button
                        fullWidth
                        variant="contained"
                        size="small"
                        onClick={() => onSelectCompany(comp.id)}
                        endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          backgroundColor: '#0f172a',
                          '&:hover': { backgroundColor: '#1e293b' },
                        }}
                      >
                        Open {comp.name} ERP
                      </Button>
                    </Card>
                  </Grid>
                );
              })}
          </Grid>
        </Box>

        {/* Consolidated Activity Stream */}
        <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', p: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 2, borderBottom: '1px solid #f1f5f9' }}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                Consolidated Operational Audit Stream
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                Real-time activities across manufacturing plants, customs & sales hubs
              </Typography>
            </Box>
            <Chip
              size="small"
              label="Live Webhook Synced"
              sx={{
                bgcolor: '#ecfdf5',
                color: '#059669',
                fontWeight: 700,
                fontSize: '0.65rem',
                border: '1px solid #a7f3d0',
              }}
            />
          </Box>

          <Box sx={{ mt: 1 }}>
            {initialActivity.map((act) => (
              <Box
                key={act.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  py: 1.2,
                  borderBottom: '1px solid #f8fafc',
                  '&:last-child': { borderBottom: 'none' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#4f46e5' }} />
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#1e293b', display: 'block' }}>
                      {act.action}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.65rem' }}>
                      {act.company} • Logged by {act.user}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.65rem', fontFamily: 'monospace' }}>
                  {act.time}
                </Typography>
              </Box>
            ))}
          </Box>
        </Card>
      </Box>
    );
  }

  /* Specific Company Dashboard: 4 Clean KPI Cards + Live Stock Highlights */
  const compStock = stockItems.filter((i) => i.company === selectedCompany);
  const compStockIn = stockInRecords.filter((i) => i.company === selectedCompany);
  const compStockOut = stockOutRecords.filter((i) => i.company === selectedCompany);
  const compValuation = compStock.reduce(
    (sum, it) => sum + (it.stock || 0) * (it.price || it.unitPrice || 0),
    0
  );
  const totalUnits = compStock.reduce((sum, it) => sum + (it.stock || 0), 0);
  const lowStockCount = compStock.filter((i) => (i.stock || 0) <= (i.minStock || 0)).length;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* 4 Company Specific KPI Summary Cards */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active SKUs"
            value={compStock.length}
            subtext={`Low Stock: ${lowStockCount}`}
            icon={Inventory2OutlinedIcon}
            iconColor="#4f46e5"
            iconBg="#eef2ff"
            actionText="Manage Stock →"
            onAction={() => onNavigate('Inventory')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Inventory Valuation"
            value={`₹${compValuation.toLocaleString()}`}
            subtext={`Total Holding ${totalUnits} units`}
            icon={CurrencyRupeeIcon}
            iconColor="#059669"
            iconBg="#ecfdf5"
            actionText="Full Inventory →"
            onAction={() => onNavigate('Inventory')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Inward GRN (Stock In)"
            value={compStockIn.length}
            subtext="Recent Inward Receipts"
            icon={SouthWestIcon}
            iconColor="#d97706"
            iconBg="#fffbeb"
            actionText="View Ledger →"
            onAction={() => onNavigate('Inventory')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Outward Dispatches"
            value={compStockOut.length}
            subtext="Dispatched Orders"
            icon={NorthEastIcon}
            iconColor="#e11d48"
            iconBg="#fff1f2"
            actionText="View Dispatches →"
            onAction={() => onNavigate('Inventory')}
          />
        </Grid>
      </Grid>

      {/* Company Live Stock Highlights Table */}
      <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9' }}>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
              {currentCompanyObj.name} Live Stock Highlights
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Registered inventory catalog and stock balances
            </Typography>
          </Box>
          <Button
            size="small"
            onClick={() => onNavigate('Inventory')}
            endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.75rem',
              color: '#4f46e5',
            }}
          >
            Open Full Stock List
          </Button>
        </Box>

        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
          <Table size="small">
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#64748b' }}>Unique Code</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#64748b' }}>Product Name</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#64748b' }}>Size / Color</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#64748b' }}>Current Stock</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#64748b' }}>Unit Price</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#64748b' }}>Location</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#64748b' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {compStock.slice(0, 6).map((it) => (
                <TableRow key={it.uniqueCode || it.sku} hover>
                  <TableCell sx={{ fontWeight: 800, fontFamily: 'monospace', color: '#4f46e5', fontSize: '0.75rem' }}>
                    {it.uniqueCode || it.sku}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.75rem' }}>{it.name}</TableCell>
                  <TableCell sx={{ color: '#64748b', fontSize: '0.75rem' }}>
                    {[it.size, it.color].filter(Boolean).join(' • ') || '-'}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.75rem' }}>
                    {it.stock} {it.unit || it.uom || 'PAC'}
                  </TableCell>
                  <TableCell sx={{ color: '#334155', fontWeight: 600, fontSize: '0.75rem' }}>
                    ₹{it.price || it.unitPrice || 0}
                  </TableCell>
                  <TableCell sx={{ color: '#64748b', fontSize: '0.75rem' }}>{it.location || 'Warehouse'}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={(it.stock || 0) <= (it.minStock || 0) ? 'Low Stock' : 'Optimal'}
                      sx={{
                        height: 20,
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        bgcolor: (it.stock || 0) <= (it.minStock || 0) ? '#fff1f2' : '#ecfdf5',
                        color: (it.stock || 0) <= (it.minStock || 0) ? '#e11d48' : '#059669',
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
