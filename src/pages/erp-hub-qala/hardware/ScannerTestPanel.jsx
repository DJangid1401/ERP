import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Chip,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Alert,
  InputAdornment,
} from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useWedgeScanner } from './useWedgeScanner';
import { findProductByBarcode } from './hardwareStorage';

export default function ScannerTestPanel({
  stockItems,
  scannerSettings,
  scanLogs,
  onLogScan,
  onClearScanLogs,
  triggerToast,
}) {
  const [lastResult, setLastResult] = useState(null);

  const handleScan = (code) => {
    const matched = findProductByBarcode(stockItems, code);
    const timestamp = new Date().toLocaleString();
    const result = {
      barcode: code,
      matched: Boolean(matched),
      product: matched,
      timestamp,
    };
    setLastResult(result);

    if (onLogScan) {
      onLogScan({
        barcode: code,
        productId: matched ? matched.uniqueCode || matched.sku : '-',
        productName: matched ? matched.name : 'Unmatched Barcode',
        purpose: 'Scanner Test',
        warehouse: matched ? matched.location || scannerSettings.defaultWarehouse : '-',
        success: Boolean(matched),
        transactionRef: '-',
      });
    }

    if (matched) {
      triggerToast(`Matched: ${matched.name} (${matched.uniqueCode || matched.sku})`, 'success');
    } else {
      triggerToast(`Unmatched barcode: ${code}`, 'warning');
    }
  };

  const wedge = useWedgeScanner({
    enabled: true,
    enterSuffix: scannerSettings.enterSuffix,
    duplicateCooldownMs: scannerSettings.duplicateCooldownMs,
    autoFocus: scannerSettings.autoFocusLock,
    onScan: handleScan,
    onDuplicateBlocked: (code) => {
      triggerToast(`Duplicate scan ignored (${code})`, 'info');
    },
  });

  const sampleCode = stockItems[0]?.uniqueCode || stockItems[0]?.sku || 'PRD-0001';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {/* Accurate Connection Status Banner */}
      <Alert
        severity="info"
        icon={<KeyboardIcon />}
        sx={{ borderRadius: 2.5, border: '1px solid #bfdbfe', bgcolor: '#eff6ff' }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e3a8a', fontSize: '0.82rem' }}>
          Scanner Status: Keyboard Scanner Mode — Ready for Scan (Honeywell ScanPal EDA51)
        </Typography>
        <Typography variant="caption" sx={{ color: '#1e40af', display: 'block' }}>
          In keyboard-wedge mode, the browser cannot directly detect physical USB/HID attachment. Focus the scan box below and pull the Honeywell trigger (Enter suffix: {scannerSettings.enterSuffix ? 'Enabled' : 'Disabled'}).
        </Typography>
      </Alert>

      {/* Large Handheld-Friendly Scan Input */}
      <Card elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
          Scanner Test Input
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5 }}>
          <TextField
            fullWidth
            inputRef={wedge.inputRef}
            value={wedge.inputValue}
            onChange={(e) => wedge.setInputValue(e.target.value)}
            onKeyDown={wedge.handleKeyDown}
            placeholder="Scan barcode / QR with Honeywell EDA51 or type & press Enter..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <QrCodeScannerIcon sx={{ color: '#4f46e5', fontSize: 24 }} />
                </InputAdornment>
              ),
              sx: {
                height: 54,
                fontSize: '1rem',
                fontWeight: 700,
                fontFamily: 'monospace',
                bgcolor: '#f8fafc',
                borderRadius: 2.5,
              },
            }}
          />
          <Button
            variant="contained"
            onClick={() => wedge.submitCode(wedge.inputValue)}
            sx={{
              height: 54,
              px: 3,
              borderRadius: 2.5,
              fontWeight: 800,
              textTransform: 'none',
              bgcolor: '#4f46e5',
              '&:hover': { bgcolor: '#4338ca' },
              flexShrink: 0,
            }}
          >
            Submit Scan
          </Button>
          <Button
            variant="outlined"
            onClick={() => wedge.submitCode(sampleCode)}
            startIcon={<PlayArrowIcon />}
            sx={{
              height: 54,
              px: 2.5,
              borderRadius: 2.5,
              fontWeight: 700,
              textTransform: 'none',
              borderColor: '#cbd5e1',
              color: '#334155',
              flexShrink: 0,
            }}
          >
            Simulate ({sampleCode})
          </Button>
        </Box>

        <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            Duplicate Guard: <strong>{scannerSettings.duplicateCooldownMs} ms</strong> • Auto-Focus Lock: <strong>{scannerSettings.autoFocusLock ? 'ON' : 'OFF'}</strong>
          </Typography>
          <Button size="small" onClick={wedge.focusInput} sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.72rem' }}>
            Refocus Scan Input
          </Button>
        </Box>
      </Card>

      {/* Last Scanned Result Card */}
      <Card elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', mb: 1.5 }}>
          Last Scanned Result
        </Typography>

        {!lastResult ? (
          <Box sx={{ py: 3, textAlign: 'center', color: '#94a3b8', bgcolor: '#f8fafc', borderRadius: 2 }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              No scan recorded in this test session yet. Scan a barcode above to inspect output.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              p: 2,
              borderRadius: 2.5,
              border: '1px solid',
              borderColor: lastResult.matched ? '#a7f3d0' : '#fecdd3',
              bgcolor: lastResult.matched ? '#ecfdf5' : '#fff1f2',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {lastResult.matched ? (
                  <CheckCircleIcon sx={{ color: '#059669' }} />
                ) : (
                  <ErrorIcon sx={{ color: '#e11d48' }} />
                )}
                <Typography variant="subtitle2" sx={{ fontWeight: 800, fontFamily: 'monospace', color: '#0f172a' }}>
                  {lastResult.barcode}
                </Typography>
              </Box>
              <Chip
                size="small"
                label={lastResult.matched ? 'Product Matched' : 'Unmatched Barcode'}
                sx={{
                  fontWeight: 800,
                  fontSize: '0.7rem',
                  bgcolor: lastResult.matched ? '#059669' : '#e11d48',
                  color: '#ffffff',
                }}
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' }, gap: 1.5 }}>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>Product Name</Typography>
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#0f172a' }}>
                  {lastResult.product?.name || 'Not Found in Product Master'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>SKU / Product ID</Typography>
                <Typography variant="caption" sx={{ fontWeight: 800, fontFamily: 'monospace', color: '#4f46e5' }}>
                  {lastResult.product ? (lastResult.product.uniqueCode || lastResult.product.sku) : '-'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>Colour</Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  {lastResult.product?.color || 'N/A'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>Scan Timestamp</Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  {lastResult.timestamp}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Card>

      {/* Scan Test History */}
      <Card elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
            Scan History (Device Local Log)
          </Typography>
          <Button
            size="small"
            color="error"
            onClick={onClearScanLogs}
            disabled={scanLogs.length === 0}
            startIcon={<DeleteSweepIcon />}
            sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.75rem' }}
          >
            Clear Scan History
          </Button>
        </Box>

        <TableContainer component={Paper} elevation={0}>
          <Table size="small">
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Timestamp</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Barcode</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>SKU / ID</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Product Name</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Purpose</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scanLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 3, color: '#94a3b8', fontSize: '0.75rem' }}>
                    No scan events logged yet.
                  </TableCell>
                </TableRow>
              ) : (
                scanLogs.slice(0, 15).map((log) => (
                  <TableRow key={log.id} hover>
                    <TableCell sx={{ fontSize: '0.72rem', color: '#64748b' }}>{log.timestamp}</TableCell>
                    <TableCell sx={{ fontSize: '0.72rem', fontWeight: 700, fontFamily: 'monospace' }}>{log.barcode}</TableCell>
                    <TableCell sx={{ fontSize: '0.72rem', fontFamily: 'monospace', color: '#4f46e5' }}>{log.productId}</TableCell>
                    <TableCell sx={{ fontSize: '0.72rem', fontWeight: 600 }}>{log.productName}</TableCell>
                    <TableCell sx={{ fontSize: '0.72rem' }}>{log.purpose}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={log.success ? 'Matched' : 'Unmatched'}
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
    </Box>
  );
}
