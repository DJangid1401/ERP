import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Chip,
  Tabs,
  Tab,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
  Alert,
  Divider,
} from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import RemoveCircleOutlinedIcon from '@mui/icons-material/RemoveCircleOutlined';
import SearchIcon from '@mui/icons-material/Search';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useWedgeScanner } from './useWedgeScanner';
import { findProductByBarcode } from './hardwareStorage';

/**
 * Handheld-optimized Inventory Scan Workflow (Product Lookup, Stock In, Stock Out + Multi-Scan Batch).
 * Uses ONLY the existing ERP stockItems, stockInRecords, and stockOutRecords state (no parallel inventory store).
 */
export default function InventoryScanWorkflowPanel({
  stockItems,
  setStockItems,
  stockInRecords,
  setStockInRecords,
  stockOutRecords,
  setStockOutRecords,
  scannerSettings,
  onLogScan,
  triggerToast,
}) {
  const [mode, setMode] = useState('lookup'); // 'lookup' | 'in' | 'out'
  const [lookupItem, setLookupItem] = useState(null);
  const [batchItems, setBatchItems] = useState([]); // [{ code, item, qty }]
  const [warehouse, setWarehouse] = useState(scannerSettings.defaultWarehouse || 'Warehouse');
  const [partyName, setPartyName] = useState('Honeywell Handheld Scan');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const locationOptions = useMemo(() => {
    const set = new Set(['Warehouse', ...stockItems.map((i) => i.location).filter(Boolean)]);
    return Array.from(set);
  }, [stockItems]);

  const handleBarcodeScanned = (code) => {
    const product = findProductByBarcode(stockItems, code);
    if (!product) {
      if (onLogScan) {
        onLogScan({
          barcode: code,
          productId: '-',
          productName: 'Unmatched Product',
          purpose: mode === 'lookup' ? 'Lookup' : mode === 'in' ? 'Stock IN' : 'Stock OUT',
          warehouse,
          success: false,
          transactionRef: '-',
        });
      }
      triggerToast(`Product not found for barcode "${code}"`, 'error');
      return;
    }

    const pCode = product.uniqueCode || product.sku;

    if (mode === 'lookup') {
      setLookupItem(product);
      if (onLogScan) {
        onLogScan({
          barcode: code,
          productId: pCode,
          productName: product.name,
          purpose: 'Product Lookup',
          warehouse: product.location || warehouse,
          success: true,
          transactionRef: '-',
        });
      }
      triggerToast(`Found ${product.name} (${pCode})`, 'success');
      return;
    }

    // Stock IN / Stock OUT batch mode: consecutive scan increments qty or adds row
    setBatchItems((prev) => {
      const existing = prev.find((row) => row.code === pCode);
      if (existing) {
        const nextQty = existing.qty + 1;
        if (mode === 'out' && nextQty > (product.stock || 0)) {
          triggerToast(`Insufficient stock for ${pCode} (Available: ${product.stock || 0})`, 'error');
          return prev;
        }
        return prev.map((row) => (row.code === pCode ? { ...row, qty: nextQty } : row));
      }
      if (mode === 'out' && (product.stock || 0) <= 0) {
        triggerToast(`${pCode} is out of stock (0 available)!`, 'error');
        return prev;
      }
      return [{ code: pCode, item: product, qty: 1 }, ...prev];
    });

    if (onLogScan) {
      onLogScan({
        barcode: code,
        productId: pCode,
        productName: product.name,
        purpose: mode === 'in' ? 'Stock IN (Queued)' : 'Stock OUT (Queued)',
        warehouse: product.location || warehouse,
        success: true,
        transactionRef: 'Pending Confirm',
      });
    }
    triggerToast(`Added ${pCode} (${product.name}) to ${mode === 'in' ? 'Stock IN' : 'Stock OUT'} list`, 'success');
  };

  const wedge = useWedgeScanner({
    enabled: true,
    enterSuffix: scannerSettings.enterSuffix,
    duplicateCooldownMs: scannerSettings.duplicateCooldownMs,
    autoFocus: scannerSettings.autoFocusLock,
    onScan: handleBarcodeScanned,
    onDuplicateBlocked: (code) => {
      triggerToast(`Duplicate scan ignored (${code})`, 'info');
    },
  });

  const handleUpdateQty = (code, newQty) => {
    const parsed = Math.max(1, parseInt(newQty, 10) || 1);
    setBatchItems((prev) =>
      prev.map((row) => {
        if (row.code !== code) return row;
        if (mode === 'out' && parsed > (row.item.stock || 0)) {
          triggerToast(`Max available stock for ${code} is ${row.item.stock || 0}`, 'warning');
          return { ...row, qty: row.item.stock || 1 };
        }
        return { ...row, qty: parsed };
      })
    );
  };

  const handleRemoveRow = (code) => {
    setBatchItems((prev) => prev.filter((row) => row.code !== code));
  };

  const handleConfirmTransaction = () => {
    if (isSubmitting || batchItems.length === 0) return;

    // Validate all rows against current ERP rules before mutating state
    for (const row of batchItems) {
      const liveItem = stockItems.find((i) => (i.uniqueCode || i.sku) === row.code);
      if (!liveItem) {
        triggerToast(`Product ${row.code} no longer exists in inventory.`, 'error');
        return;
      }
      if (!Number.isFinite(row.qty) || row.qty <= 0) {
        triggerToast(`Invalid quantity for ${row.code}`, 'error');
        return;
      }
      if (mode === 'out' && row.qty > (liveItem.stock || 0)) {
        triggerToast(`Insufficient stock for ${row.code}. Available: ${liveItem.stock || 0}`, 'error');
        return;
      }
    }

    setIsSubmitting(true);
    const today = new Date().toISOString().split('T')[0];
    const batchTs = Date.now().toString().slice(-4);

    if (mode === 'in') {
      const qtyByCode = new Map(batchItems.map((b) => [b.code, b.qty]));
      setStockItems((prev) =>
        prev.map((it) => {
          const c = it.uniqueCode || it.sku;
          const addQty = qtyByCode.get(c);
          if (!addQty) return it;
          return {
            ...it,
            stock: (it.stock || 0) + addQty,
            stockIn: (it.stockIn || 0) + addQty,
            location: warehouse || it.location,
          };
        })
      );

      const newRecords = batchItems.map((b, idx) => ({
        id: `GRN-${batchTs}${idx}`,
        date: today,
        company: b.item.company,
        code: b.code,
        name: b.item.name,
        qty: b.qty,
        unit: b.item.unit || b.item.uom || 'PAC',
        mode: 'Honeywell Scan',
        source: `${partyName || 'Scanner Inward'} (${warehouse})`,
      }));
      setStockInRecords((prev) => [...newRecords, ...prev]);

      batchItems.forEach((b, idx) => {
        if (onLogScan) {
          onLogScan({
            barcode: b.code,
            productId: b.code,
            productName: b.item.name,
            purpose: 'Stock IN Confirmed',
            warehouse,
            success: true,
            transactionRef: `GRN-${batchTs}${idx}`,
          });
        }
      });

      triggerToast(`Stock IN confirmed for ${batchItems.length} item(s)!`, 'success');
    } else if (mode === 'out') {
      const qtyByCode = new Map(batchItems.map((b) => [b.code, b.qty]));
      setStockItems((prev) =>
        prev.map((it) => {
          const c = it.uniqueCode || it.sku;
          const subQty = qtyByCode.get(c);
          if (!subQty) return it;
          return {
            ...it,
            stock: Math.max(0, (it.stock || 0) - subQty),
            stockOut: (it.stockOut || 0) + subQty,
          };
        })
      );

      const newOutRecords = batchItems.map((b, idx) => ({
        id: `DIS-${batchTs}${idx}`,
        date: today,
        company: b.item.company,
        code: b.code,
        name: b.item.name,
        customer: partyName || 'Handheld Dispatch',
        qty: b.qty,
        unit: b.item.unit || b.item.uom || 'PAC',
        price: b.item.price || b.item.unitPrice || 0,
        destination: warehouse,
      }));
      setStockOutRecords((prev) => [...newOutRecords, ...prev]);

      batchItems.forEach((b, idx) => {
        if (onLogScan) {
          onLogScan({
            barcode: b.code,
            productId: b.code,
            productName: b.item.name,
            purpose: 'Stock OUT Confirmed',
            warehouse,
            success: true,
            transactionRef: `DIS-${batchTs}${idx}`,
          });
        }
      });

      triggerToast(`Stock OUT confirmed for ${batchItems.length} item(s)!`, 'success');
    }

    setBatchItems([]);
    setIsSubmitting(false);
    wedge.focusInput();
  };

  // Recent transactions for lookup item
  const recentTx = useMemo(() => {
    if (!lookupItem) return [];
    const code = lookupItem.uniqueCode || lookupItem.sku;
    const ins = stockInRecords
      .filter((r) => r.code === code)
      .map((r) => ({ id: r.id, type: 'IN', qty: `+${r.qty}`, date: r.date, note: r.source }));
    const outs = stockOutRecords
      .filter((r) => r.code === code)
      .map((r) => ({ id: r.id, type: 'OUT', qty: `-${r.qty}`, date: r.date, note: r.customer || r.destination }));
    return [...ins, ...outs].slice(0, 5);
  }, [lookupItem, stockInRecords, stockOutRecords]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Handheld Mode Tabs */}
      <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#ffffff', overflow: 'hidden' }}>
        <Tabs
          value={mode}
          onChange={(e, val) => {
            setMode(val);
            setBatchItems([]);
          }}
          variant="fullWidth"
          sx={{
            borderBottom: '1px solid #e2e8f0',
            '& .MuiTab-root': { py: 1.5, fontWeight: 800, fontSize: '0.82rem', textTransform: 'none' },
          }}
        >
          <Tab value="lookup" icon={<SearchIcon />} iconPosition="start" label="Product Lookup" />
          <Tab value="in" icon={<AddCircleOutlinedIcon sx={{ color: '#059669' }} />} iconPosition="start" label="Scan Stock IN" />
          <Tab value="out" icon={<RemoveCircleOutlinedIcon sx={{ color: '#e11d48' }} />} iconPosition="start" label="Scan Stock OUT" />
        </Tabs>

        <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5 }}>
            <TextField
              fullWidth
              inputRef={wedge.inputRef}
              value={wedge.inputValue}
              onChange={(e) => wedge.setInputValue(e.target.value)}
              onKeyDown={wedge.handleKeyDown}
              placeholder={
                mode === 'lookup'
                  ? 'Scan barcode for instant product lookup...'
                  : mode === 'in'
                  ? 'Scan barcode to add to Stock IN batch...'
                  : 'Scan barcode to add to Stock OUT batch...'
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <QrCodeScannerIcon sx={{ color: '#4f46e5', fontSize: 24 }} />
                  </InputAdornment>
                ),
                sx: {
                  height: 54,
                  fontSize: '0.95rem',
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
                bgcolor: mode === 'in' ? '#059669' : mode === 'out' ? '#e11d48' : '#4f46e5',
                flexShrink: 0,
              }}
            >
              Scan / Add
            </Button>
          </Box>
        </Box>
      </Card>

      {/* Product Lookup Result */}
      {mode === 'lookup' && lookupItem && (
        <Card elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a' }}>
                {lookupItem.name}
              </Typography>
              <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 700, color: '#4f46e5' }}>
                {lookupItem.uniqueCode || lookupItem.sku} • {lookupItem.company}
              </Typography>
            </Box>
            <Chip
              label={`${lookupItem.stock || 0} ${lookupItem.unit || lookupItem.uom || 'PAC'} Available`}
              sx={{
                fontWeight: 800,
                bgcolor: (lookupItem.stock || 0) <= (lookupItem.minStock || 0) ? '#fff1f2' : '#ecfdf5',
                color: (lookupItem.stock || 0) <= (lookupItem.minStock || 0) ? '#e11d48' : '#059669',
              }}
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' }, gap: 1.5, p: 1.5, bgcolor: '#f8fafc', borderRadius: 2 }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>Colour / Size</Typography>
              <Typography variant="caption" sx={{ fontWeight: 700 }}>{[lookupItem.color, lookupItem.size].filter(Boolean).join(' • ') || '-'}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>Category</Typography>
              <Typography variant="caption" sx={{ fontWeight: 700 }}>{lookupItem.category || 'General'}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>Warehouse / Location</Typography>
              <Typography variant="caption" sx={{ fontWeight: 700 }}>{lookupItem.location || 'Warehouse'}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>Unit Price</Typography>
              <Typography variant="caption" sx={{ fontWeight: 700 }}>₹{lookupItem.price || lookupItem.unitPrice || 0}</Typography>
            </Box>
          </Box>

          <Typography variant="caption" sx={{ fontWeight: 800, color: '#334155', display: 'block', mt: 2, mb: 1 }}>
            Recent Transactions
          </Typography>
          {recentTx.length === 0 ? (
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>No recent inward/outward transactions for this SKU.</Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              {recentTx.map((tx) => (
                <Box key={tx.id} sx={{ display: 'flex', justifyContent: 'space-between', p: 1, borderRadius: 1.5, bgcolor: '#f8fafc' }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>{tx.id} • {tx.date}</Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>{tx.note}</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: tx.type === 'IN' ? '#059669' : '#e11d48' }}>{tx.qty}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </Card>
      )}

      {/* Stock IN / Stock OUT Multi-Scan Batch List */}
      {(mode === 'in' || mode === 'out') && (
        <Card elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 2, alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', flex: 1 }}>
              <Select
                size="small"
                value={warehouse}
                onChange={(e) => setWarehouse(e.target.value)}
                sx={{ minWidth: 160, height: 42, fontWeight: 700, bgcolor: '#f8fafc', borderRadius: 2 }}
              >
                {locationOptions.map((loc) => (
                  <MenuItem key={loc} value={loc}>{loc}</MenuItem>
                ))}
              </Select>
              <TextField
                size="small"
                label={mode === 'in' ? 'Source / GRN Note' : 'Customer / Destination'}
                value={partyName}
                onChange={(e) => setPartyName(e.target.value)}
                sx={{ minWidth: 200, '& .MuiOutlinedInput-root': { height: 42, borderRadius: 2 } }}
              />
            </Box>

            <Button
              variant="contained"
              size="large"
              disabled={batchItems.length === 0 || isSubmitting}
              onClick={handleConfirmTransaction}
              startIcon={<CheckCircleIcon />}
              sx={{
                height: 46,
                px: 3,
                borderRadius: 2.5,
                fontWeight: 800,
                textTransform: 'none',
                bgcolor: mode === 'in' ? '#059669' : '#e11d48',
              }}
            >
              Confirm {mode === 'in' ? 'Stock IN' : 'Stock OUT'} ({batchItems.length})
            </Button>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {batchItems.length === 0 ? (
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              Scan one or more product barcodes above. Repeated scans of the same barcode automatically increment quantity.
            </Alert>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {batchItems.map((row) => (
                <Box
                  key={row.code}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    border: '1px solid #e2e8f0',
                    bgcolor: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 1.5,
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                      {row.item.name}
                    </Typography>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#4f46e5', fontWeight: 700 }}>
                      {row.code} • Available: {row.item.stock || 0} {row.item.unit || 'PAC'}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                      type="number"
                      size="small"
                      label="Qty"
                      value={row.qty}
                      onChange={(e) => handleUpdateQty(row.code, e.target.value)}
                      inputProps={{ min: 1, style: { width: 70, fontWeight: 800, textAlign: 'center' } }}
                    />
                    <IconButton color="error" onClick={() => handleRemoveRow(row.code)}>
                      <DeleteOutlinedIcon />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Card>
      )}
    </Box>
  );
}
