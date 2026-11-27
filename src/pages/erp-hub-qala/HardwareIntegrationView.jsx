import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  Typography,
  Tabs,
  Tab,
  Chip,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Alert,
} from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import PrintIcon from '@mui/icons-material/Print';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import SaveIcon from '@mui/icons-material/Save';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';

import StatCard from '../../components/common/StatCard';
import ScannerTestPanel from './hardware/ScannerTestPanel';
import InventoryScanWorkflowPanel from './hardware/InventoryScanWorkflowPanel';
import PrinterSettingsPanel from './hardware/PrinterSettingsPanel';
import LabelGeneratorPanel from './hardware/LabelGeneratorPanel';
import {
  DEFAULT_SCANNER_SETTINGS,
  loadScannerSettings,
  saveScannerSettings,
  loadPrinterSettings,
  savePrinterSettings,
  loadLocalScanLogs,
  saveLocalScanLogs,
  loadLocalPrintJobs,
  saveLocalPrintJobs,
} from './hardware/hardwareStorage';

export default function HardwareIntegrationView({
  currentUser,
  stockItems,
  setStockItems,
  stockInRecords,
  setStockInRecords,
  stockOutRecords,
  setStockOutRecords,
  triggerToast,
}) {
  const [subTab, setSubTab] = useState(0); // 0: Overview, 1: Scanner Test, 2: Inventory Scan, 3: Printer Settings, 4: Label Generator, 5: Scan History, 6: Integration Settings
  const [scannerSettings, setScannerSettings] = useState(loadScannerSettings);
  const [printerSettings, setPrinterSettings] = useState(loadPrinterSettings);
  const [scanLogs, setScanLogs] = useState(loadLocalScanLogs);
  const [printJobs, setPrintJobs] = useState(loadLocalPrintJobs);
  const [historyFilter, setHistoryFilter] = useState('');

  const handleLogScan = (entry) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newEntry = {
      id: `SCN-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      dateKey: todayStr,
      timestamp: new Date().toLocaleString(),
      user: currentUser?.name || 'Operator',
      ...entry,
    };
    setScanLogs((prev) => {
      const next = [newEntry, ...prev].slice(0, 200);
      saveLocalScanLogs(next);
      return next;
    });
  };

  const handleClearScanLogs = () => {
    setScanLogs([]);
    saveLocalScanLogs([]);
    triggerToast('Local scan history cleared', 'info');
  };

  const handleLogPrintJob = (job) => {
    const newJob = {
      id: `PRT-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleString(),
      user: currentUser?.name || 'Operator',
      ...job,
    };
    setPrintJobs((prev) => {
      const next = [newJob, ...prev].slice(0, 100);
      saveLocalPrintJobs(next);
      return next;
    });
  };

  const handleSavePrinterSettings = (next) => {
    setPrinterSettings(next);
    savePrinterSettings(next);
  };

  const handleSaveScannerSettings = (next) => {
    setScannerSettings(next);
    saveScannerSettings(next);
    triggerToast('Hardware integration settings saved locally!', 'success');
  };

  // Real metrics derived strictly from actual local logs (never fake data)
  const todayStr = new Date().toISOString().split('T')[0];
  const scansToday = useMemo(
    () => scanLogs.filter((l) => l.dateKey === todayStr).length,
    [scanLogs, todayStr]
  );
  const matchedScans = useMemo(
    () => scanLogs.filter((l) => l.success).length,
    [scanLogs]
  );
  const unmatchedScans = useMemo(
    () => scanLogs.filter((l) => !l.success).length,
    [scanLogs]
  );
  const totalLabelsPrinted = useMemo(
    () => printJobs.reduce((sum, j) => sum + (Number(j.totalLabels) || 0), 0),
    [printJobs]
  );

  const filteredLogs = useMemo(() => {
    if (!historyFilter.trim()) return scanLogs;
    const q = historyFilter.toLowerCase();
    return scanLogs.filter(
      (l) =>
        (l.barcode || '').toLowerCase().includes(q) ||
        (l.productId || '').toLowerCase().includes(q) ||
        (l.productName || '').toLowerCase().includes(q) ||
        (l.purpose || '').toLowerCase().includes(q)
    );
  }, [scanLogs, historyFilter]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {/* Header & Navigation Tabs */}
      <Card elevation={0} sx={{ p: 2.5, pb: 0, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5, mb: 1.5 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                Hardware Integration
              </Typography>
              <Chip
                size="small"
                label="Honeywell EDA51 + Citizen CL-S631II"
                sx={{ bgcolor: '#eef2ff', color: '#4f46e5', fontWeight: 700, fontSize: '0.7rem' }}
              />
            </Box>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Keyboard-wedge barcode scanning, handheld inventory workflows, and Citizen thermal label printing
            </Typography>
          </Box>
        </Box>

        <Tabs
          value={subTab}
          onChange={(e, val) => setSubTab(val)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            minHeight: 40,
            borderTop: '1px solid #f1f5f9',
            '& .MuiTab-root': {
              minHeight: 40,
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.78rem',
              color: '#64748b',
              '&.Mui-selected': { color: '#4f46e5' },
            },
            '& .MuiTabs-indicator': { backgroundColor: '#4f46e5', height: 2 },
          }}
        >
          <Tab label="Overview" />
          <Tab label="Scanner Test" />
          <Tab label="Inventory Scan" />
          <Tab label="Printer Settings" />
          <Tab label="Label Generator" />
          <Tab label={`Scan History (${scanLogs.length})`} />
          <Tab label="Integration Settings" />
        </Tabs>
      </Card>

      {/* TAB 0: OVERVIEW */}
      {subTab === 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 2,
            }}
          >
            <StatCard
              title="Total Scans Today"
              value={scansToday}
              subtext="Keyboard-wedge events"
              icon={QrCodeScannerIcon}
              iconColor="#4f46e5"
              iconBg="#eef2ff"
              onAction={() => setSubTab(1)}
            />
            <StatCard
              title="Successful Matches"
              value={matchedScans}
              subtext="Matched to Product Master"
              icon={CheckCircleIcon}
              iconColor="#059669"
              iconBg="#ecfdf5"
              onAction={() => setSubTab(5)}
            />
            <StatCard
              title="Unmatched Scans"
              value={unmatchedScans}
              subtext="Unknown / invalid codes"
              icon={ErrorIcon}
              iconColor="#e11d48"
              iconBg="#fff1f2"
              onAction={() => setSubTab(5)}
            />
            <StatCard
              title="Labels Printed (Local)"
              value={totalLabelsPrinted}
              subtext={`${printJobs.length} print job(s)`}
              icon={PrintIcon}
              iconColor="#d97706"
              iconBg="#fffbeb"
              onAction={() => setSubTab(4)}
            />
          </Box>

          {/* Status Cards */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <Card elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
                Scanner Configuration Status
              </Typography>
              <Typography variant="caption" sx={{ color: '#475569', display: 'block', mb: 1.5 }}>
                Mode: <strong>Keyboard Scanner Mode — Ready for Scan</strong> (Honeywell ScanPal EDA51) • Enter Suffix:{' '}
                <strong>{scannerSettings.enterSuffix ? 'ON' : 'OFF'}</strong>
              </Typography>
              <Button size="small" variant="outlined" onClick={() => setSubTab(1)} sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}>
                Open Scanner Test
              </Button>
            </Card>

            <Card elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
                Printer Configuration Status
              </Typography>
              <Typography variant="caption" sx={{ color: '#475569', display: 'block', mb: 1.5 }}>
                {printerSettings.printerModel} • {printerSettings.connectionType} • Size:{' '}
                <strong>{printerSettings.labelWidthMm}×{printerSettings.labelHeightMm} mm</strong>
              </Typography>
              <Button size="small" variant="outlined" onClick={() => setSubTab(3)} sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}>
                Configure Printer
              </Button>
            </Card>
          </Box>

          {/* Recent Scans & Recent Print Jobs */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <Card elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', mb: 1.5 }}>
                Recent Scans
              </Typography>
              {scanLogs.length === 0 ? (
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                  No scans recorded yet on this device.
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {scanLogs.slice(0, 5).map((s) => (
                    <Box key={s.id} sx={{ display: 'flex', justifyContent: 'space-between', p: 1, bgcolor: '#f8fafc', borderRadius: 1.5 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>{s.barcode}</Typography>
                      <Typography variant="caption" sx={{ color: '#475569' }}>{s.productName}</Typography>
                      <Chip size="small" label={s.success ? 'Matched' : 'Unmatched'} sx={{ height: 18, fontSize: '0.6rem' }} />
                    </Box>
                  ))}
                </Box>
              )}
            </Card>

            <Card elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', mb: 1.5 }}>
                Recent Print Jobs (Local)
              </Typography>
              {printJobs.length === 0 ? (
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                  No label print jobs recorded yet on this device.
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {printJobs.slice(0, 5).map((j) => (
                    <Box key={j.id} sx={{ display: 'flex', justifyContent: 'space-between', p: 1, bgcolor: '#f8fafc', borderRadius: 1.5 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>{j.jobType}</Typography>
                      <Typography variant="caption" sx={{ color: '#475569' }}>{j.labelSize}</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#4f46e5' }}>{j.totalLabels} lbl</Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Card>
          </Box>
        </Box>
      )}

      {/* TAB 1: SCANNER TEST */}
      {subTab === 1 && (
        <ScannerTestPanel
          stockItems={stockItems}
          scannerSettings={scannerSettings}
          scanLogs={scanLogs}
          onLogScan={handleLogScan}
          onClearScanLogs={handleClearScanLogs}
          triggerToast={triggerToast}
        />
      )}

      {/* TAB 2: INVENTORY SCAN WORKFLOW */}
      {subTab === 2 && (
        <InventoryScanWorkflowPanel
          stockItems={stockItems}
          setStockItems={setStockItems}
          stockInRecords={stockInRecords}
          setStockInRecords={setStockInRecords}
          stockOutRecords={stockOutRecords}
          setStockOutRecords={setStockOutRecords}
          scannerSettings={scannerSettings}
          onLogScan={handleLogScan}
          triggerToast={triggerToast}
        />
      )}

      {/* TAB 3: PRINTER SETTINGS */}
      {subTab === 3 && (
        <PrinterSettingsPanel
          printerSettings={printerSettings}
          onSavePrinterSettings={handleSavePrinterSettings}
          onLogPrintJob={handleLogPrintJob}
          triggerToast={triggerToast}
        />
      )}

      {/* TAB 4: LABEL GENERATOR */}
      {subTab === 4 && (
        <LabelGeneratorPanel
          stockItems={stockItems}
          printerSettings={printerSettings}
          onLogPrintJob={handleLogPrintJob}
          triggerToast={triggerToast}
        />
      )}

      {/* TAB 5: SCAN HISTORY */}
      {subTab === 5 && (
        <Card elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                Device Scan History Log
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                Audit log of local scan events. Scan history never modifies stock automatically.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                placeholder="Search barcode, SKU, purpose..."
                value={historyFilter}
                onChange={(e) => setHistoryFilter(e.target.value)}
              />
              <Button
                size="small"
                color="error"
                onClick={handleClearScanLogs}
                disabled={scanLogs.length === 0}
                startIcon={<DeleteSweepIcon />}
                sx={{ textTransform: 'none', fontWeight: 700 }}
              >
                Clear
              </Button>
            </Box>
          </Box>

          <TableContainer component={Paper} elevation={0}>
            <Table size="small">
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Timestamp</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Barcode</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Product ID</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Product Name</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Purpose</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Warehouse</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Tx Ref</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} sx={{ textAlign: 'center', py: 3, color: '#94a3b8', fontSize: '0.75rem' }}>
                      No scan events found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id} hover>
                      <TableCell sx={{ fontSize: '0.72rem', color: '#64748b' }}>{log.timestamp}</TableCell>
                      <TableCell sx={{ fontSize: '0.72rem', fontWeight: 700, fontFamily: 'monospace' }}>{log.barcode}</TableCell>
                      <TableCell sx={{ fontSize: '0.72rem', fontFamily: 'monospace', color: '#4f46e5' }}>{log.productId}</TableCell>
                      <TableCell sx={{ fontSize: '0.72rem', fontWeight: 600 }}>{log.productName}</TableCell>
                      <TableCell sx={{ fontSize: '0.72rem' }}>{log.purpose}</TableCell>
                      <TableCell sx={{ fontSize: '0.72rem' }}>{log.user}</TableCell>
                      <TableCell sx={{ fontSize: '0.72rem' }}>{log.warehouse}</TableCell>
                      <TableCell sx={{ fontSize: '0.72rem', fontFamily: 'monospace' }}>{log.transactionRef}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={log.success ? 'Success' : 'Failed'}
                          sx={{
                            height: 18,
                            fontSize: '0.62rem',
                            fontWeight: 700,
                            bgcolor: log.success ? '#ecfdf5' : '#fff1f2',
                            color: log.success ? '#059669' : '#e11d48',
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* TAB 6: INTEGRATION SETTINGS */}
      {subTab === 6 && (
        <Card elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
            Honeywell & Hardware Integration Settings
          </Typography>
          <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
            These settings are stored per device in browser localStorage and do not modify centralized company inventory.
          </Alert>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, maxWidth: 480 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(scannerSettings.enterSuffix)}
                  onChange={(e) => setScannerSettings({ ...scannerSettings, enterSuffix: e.target.checked })}
                />
              }
              label={<Typography variant="caption" sx={{ fontWeight: 700 }}>Auto-Submit on Enter Suffix (Honeywell Wedge)</Typography>}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(scannerSettings.autoFocusLock)}
                  onChange={(e) => setScannerSettings({ ...scannerSettings, autoFocusLock: e.target.checked })}
                />
              }
              label={<Typography variant="caption" sx={{ fontWeight: 700 }}>Keep Scan Input Focused Automatically</Typography>}
            />
            <TextField
              size="small"
              type="number"
              label="Duplicate Scan Cooldown (ms)"
              value={scannerSettings.duplicateCooldownMs}
              onChange={(e) =>
                setScannerSettings({
                  ...scannerSettings,
                  duplicateCooldownMs: Math.max(200, Math.min(5000, Number(e.target.value) || 1200)),
                })
              }
            />
            <TextField
              size="small"
              label="Default Warehouse / Location"
              value={scannerSettings.defaultWarehouse}
              onChange={(e) => setScannerSettings({ ...scannerSettings, defaultWarehouse: e.target.value })}
            />
            <Box sx={{ display: 'flex', gap: 1.5, mt: 1 }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={() => handleSaveScannerSettings(scannerSettings)}
                sx={{ bgcolor: '#4f46e5', textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
              >
                Save Settings
              </Button>
              <Button
                variant="outlined"
                onClick={() => handleSaveScannerSettings(DEFAULT_SCANNER_SETTINGS)}
                sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
              >
                Reset Defaults
              </Button>
            </Box>
          </Box>
        </Card>
      )}
    </Box>
  );
}
