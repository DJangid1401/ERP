import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  Tabs,
  Tab,
  Button,
  TextField,
  InputAdornment,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TablePagination,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  Checkbox,
  Autocomplete,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import RemoveCircleOutlinedIcon from '@mui/icons-material/RemoveCircleOutlined';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import CloseIcon from '@mui/icons-material/Close';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import ClearIcon from '@mui/icons-material/Clear';
import QRCode from 'qrcode';

import VoiceButton from '../../components/buttons/VoiceButton';
import QrPrintModal from '../../components/common/QrPrintModal';
import QrScannerModal from '../../components/common/QrScannerModal';

export default function InventoryView({
  selectedCompany,
  companies,
  stockItems,
  setStockItems,
  stockInRecords,
  setStockInRecords,
  stockOutRecords,
  setStockOutRecords,
  triggerToast,
  startVoiceInput,
  listeningField,
}) {
  const isGlobalMode = selectedCompany === 'All';
  const [currentTab, setCurrentTab] = useState(0); // 0: StockList, 1: StockIn, 2: StockOut
  const [inBarCompanyFilter, setInBarCompanyFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductFilter, setSelectedProductFilter] = useState('All');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modals state
  const [isStockOutModalOpen, setIsStockOutModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // QR Label Modal state
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [selectedQrItem, setSelectedQrItem] = useState(null);
  const [qrCopies, setQrCopies] = useState(1);
  const [recordStockInOnPrint, setRecordStockInOnPrint] = useState(true);
  const [generatedQrDataUrl, setGeneratedQrDataUrl] = useState('');

  // QR Camera Scanner state
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Form states for Stock OUT
  const [outwardCustomer, setOutwardCustomer] = useState('Shree Ganesh Traders');
  const [outwardCode, setOutwardCode] = useState('');
  const [outwardMode, setOutwardMode] = useState('PAC'); // 'PAC' or 'KGS'
  const [outwardQty, setOutwardQty] = useState(1);
  const [outwardPrice, setOutwardPrice] = useState(140);
  const [outwardDestination, setOutwardDestination] = useState('Vapi Warehouse');

  // Filtered Stock Items
  const filteredStock = useMemo(() => {
    return stockItems.filter((item) => {
      // Company scoping
      if (!isGlobalMode && item.company !== selectedCompany) return false;
      if (isGlobalMode && inBarCompanyFilter !== 'All' && item.company !== inBarCompanyFilter) return false;

      // Product category filter
      if (selectedProductFilter !== 'All' && item.name !== selectedProductFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesCode = (item.uniqueCode || item.sku || '').toLowerCase().includes(q);
        const matchesName = (item.name || '').toLowerCase().includes(q);
        const matchesSize = (item.size || '').toLowerCase().includes(q);
        const matchesColor = (item.color || '').toLowerCase().includes(q);
        return matchesCode || matchesName || matchesSize || matchesColor;
      }

      return true;
    });
  }, [stockItems, isGlobalMode, selectedCompany, inBarCompanyFilter, selectedProductFilter, searchQuery]);

  // Unique product names for filter tabs
  const productCategories = useMemo(() => {
    const set = new Set(stockItems.map((i) => i.name).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [stockItems]);

  // Selected item for Stock OUT
  const selectedOutwardItem = useMemo(() => {
    if (!outwardCode) return null;
    return stockItems.find((i) => (i.uniqueCode || i.sku) === outwardCode) || null;
  }, [stockItems, outwardCode]);

  // Open QR Print Modal
  const handleOpenQrModal = async (item) => {
    if (!item) return;
    setSelectedQrItem(item);
    setQrCopies(1);
    setRecordStockInOnPrint(true);
    await generateQrCodeData(item);
    setIsQrModalOpen(true);
  };

  const handleSelectQrItem = async (item) => {
    if (!item) return;
    setSelectedQrItem(item);
    await generateQrCodeData(item);
  };

  const generateQrCodeData = async (item) => {
    if (!item) return;
    const code = item.uniqueCode || item.sku || 'PRD-0001';
    try {
      const url = await QRCode.toDataURL(code, {
        width: 250,
        margin: 1,
        color: { dark: '#000000', light: '#ffffff' },
      });
      setGeneratedQrDataUrl(url);
    } catch (e) {
      console.error(e);
    }
  };

  // Execute QR Print & Add Stock IN
  const handleExecutePrintAndStockIn = () => {
    if (!selectedQrItem) return;
    const copies = Math.max(1, qrCopies);
    const uniqueCode = selectedQrItem.uniqueCode || selectedQrItem.sku;
    const uom = selectedQrItem.unit || selectedQrItem.uom || 'PAC';

    // 1. If checked, record Stock IN
    if (recordStockInOnPrint) {
      setStockItems((prev) =>
        prev.map((it) => {
          if ((it.uniqueCode || it.sku) === uniqueCode) {
            return {
              ...it,
              stock: (it.stock || 0) + copies,
              stockIn: (it.stockIn || 0) + copies,
            };
          }
          return it;
        })
      );

      const newRecord = {
        id: `GRN-${Date.now().toString().slice(-4)}`,
        date: new Date().toISOString().split('T')[0],
        company: selectedQrItem.company || (isGlobalMode ? 'Siona Plasto' : selectedCompany),
        code: uniqueCode,
        name: selectedQrItem.name,
        qty: copies,
        unit: uom,
        mode: 'Print & Inward',
        source: 'Automated QR Print Batch',
      };
      setStockInRecords((prev) => [newRecord, ...prev]);
    }

    triggerToast(`Stock IN (+${copies} ${uom}) recorded & printing ${copies} QR Label(s)!`);

    // 2. Open print window matching minimal sticker reference
    const printWindow = window.open('', '_blank', 'width=750,height=700');
    if (printWindow) {
      const labelText = [selectedQrItem.size, selectedQrItem.color].filter(Boolean).join(', ') || 'Standard';
      const labelsHtml = Array.from(
        { length: copies },
        () => `
        <div class="qr-sticker">
          <div class="qr-code-box">
            <img src="${generatedQrDataUrl}" alt="${uniqueCode}" class="qr-img" />
          </div>
          <div class="qr-label-text">${labelText}</div>
        </div>
      `
      ).join('');

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Print QR - ${uniqueCode}</title>
          <style>
            @page { size: auto; margin: 8mm; }
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 12px; display: flex; flex-wrap: wrap; gap: 12px; background: #fff; }
            .qr-sticker { display: inline-flex; flex-direction: column; align-items: center; justify-content: center; border: 1px dashed #64748b; border-radius: 4px; padding: 6px 8px; background: #fff; page-break-inside: avoid; }
            .qr-code-box { display: flex; align-items: center; justify-content: center; }
            .qr-img { width: 110px; height: 110px; display: block; }
            .qr-label-text { font-size: 8.5px; font-weight: 700; color: #000; margin-top: 4px; text-align: center; letter-spacing: 0.2px; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          ${labelsHtml}
          <script>
            window.onload = function() { window.print(); setTimeout(function() { window.close(); }, 700); };
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    }
    setIsQrModalOpen(false);
  };

  // Open Edit Modal
  const handleOpenEdit = (item) => {
    setEditingItem({ ...item });
    setIsEditModalOpen(true);
  };

  // Save Edit
  const handleSaveEdit = () => {
    if (!editingItem) return;
    setStockItems((prev) =>
      prev.map((it) =>
        (it.uniqueCode || it.sku) === (editingItem.uniqueCode || editingItem.sku) ? { ...editingItem } : it
      )
    );
    triggerToast(`Product ${editingItem.uniqueCode || editingItem.sku} updated successfully!`);
    setIsEditModalOpen(false);
  };

  // Delete Stock Item
  const handleDeleteItem = (code) => {
    if (window.confirm(`Are you sure you want to delete item ${code}?`)) {
      setStockItems((prev) => prev.filter((it) => (it.uniqueCode || it.sku) !== code));
      triggerToast(`Item ${code} deleted from inventory.`);
    }
  };

  // Submit Stock OUT
  const handleRecordStockOutSubmit = () => {
    if (!selectedOutwardItem) {
      alert('Please select a valid product code!');
      return;
    }

    const requestedQty = Math.max(1, outwardQty);
    if ((selectedOutwardItem.stock || 0) < requestedQty) {
      alert(`Insufficient stock! Available stock: ${selectedOutwardItem.stock || 0}`);
      return;
    }

    const price = Math.max(0, outwardPrice || 0);

    setStockItems((prev) =>
      prev.map((it) => {
        if ((it.uniqueCode || it.sku) === outwardCode) {
          return {
            ...it,
            stock: (it.stock || 0) - requestedQty,
            stockOut: (it.stockOut || 0) + requestedQty,
          };
        }
        return it;
      })
    );

    const newOutRecord = {
      id: `DIS-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      company: selectedOutwardItem.company,
      code: outwardCode,
      name: selectedOutwardItem.name,
      customer: outwardCustomer,
      qty: requestedQty,
      unit: selectedOutwardItem.unit || 'PAC',
      price: price,
      destination: outwardDestination,
    };
    setStockOutRecords((prev) => [newOutRecord, ...prev]);

    triggerToast(`Stock OUT: Dispatched -${requestedQty} PAC of ${outwardCode}`);
    setIsStockOutModalOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {/* Top Header Card */}
      <Card elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                Inventory Hub
              </Typography>
              <Chip
                size="small"
                label={isGlobalMode ? inBarCompanyFilter : selectedCompany}
                sx={{
                  bgcolor: '#eef2ff',
                  color: '#4f46e5',
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  border: '1px solid #c7d2fe',
                }}
              />
            </Box>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Live Stock List, Inward GRN (Stock In), and Outward Dispatches (Stock Out)
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                const target = filteredStock[0] || stockItems[0];
                if (target) handleOpenQrModal(target);
              }}
              startIcon={<AddCircleOutlinedIcon />}
              sx={{
                bgcolor: '#059669',
                '&:hover': { bgcolor: '#047857' },
                borderRadius: 2,
                fontWeight: 700,
                textTransform: 'none',
              }}
            >
              Record Stock IN
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => setIsStockOutModalOpen(true)}
              startIcon={<RemoveCircleOutlinedIcon />}
              sx={{
                bgcolor: '#e11d48',
                '&:hover': { bgcolor: '#be123c' },
                borderRadius: 2,
                fontWeight: 700,
                textTransform: 'none',
              }}
            >
              Record Stock OUT
            </Button>
          </Box>
        </Box>

        {/* Sub-tabs & In-bar company filter */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', mt: 2, flexWrap: 'wrap', gap: 1 }}>
          <Tabs
            value={currentTab}
            onChange={(e, val) => setCurrentTab(val)}
            sx={{
              minHeight: 40,
              '& .MuiTab-root': {
                minHeight: 40,
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.8rem',
                color: '#64748b',
                '&.Mui-selected': { color: '#4f46e5' },
              },
              '& .MuiTabs-indicator': { backgroundColor: '#4f46e5', height: 2 },
            }}
          >
            <Tab label={`Stock List (${filteredStock.length})`} />
            <Tab label={`Stock In (${stockInRecords.length})`} />
            <Tab label={`Stock Out (${stockOutRecords.length})`} />
          </Tabs>

          {isGlobalMode && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 0.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748b' }}>
                Filter Company:
              </Typography>
              <Select
                size="small"
                value={inBarCompanyFilter}
                onChange={(e) => setInBarCompanyFilter(e.target.value)}
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  height: 32,
                  bgcolor: '#f8fafc',
                  borderRadius: 1.5,
                }}
              >
                <MenuItem value="All">All Companies</MenuItem>
                {companies.filter((c) => c.id !== 'All').map((c) => (
                  <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                ))}
              </Select>
            </Box>
          )}
        </Box>
      </Card>

      {/* TAB 0: FULL STOCK LIST */}
      {currentTab === 0 && (
        <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', overflow: 'hidden', bgcolor: '#ffffff' }}>
          {/* Filter Bar: Categories & Search */}
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', flexWrap: 'wrap', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b' }}>Product:</Typography>
              {productCategories.map((cat) => (
                <Chip
                  key={cat}
                  label={cat}
                  size="small"
                  onClick={() => setSelectedProductFilter(cat)}
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    bgcolor: selectedProductFilter === cat ? '#4f46e5' : '#f1f5f9',
                    color: selectedProductFilter === cat ? '#ffffff' : '#475569',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: selectedProductFilter === cat ? '#4338ca' : '#e2e8f0' },
                  }}
                />
              ))}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                size="small"
                placeholder="Search code, name, size, color..."
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
                        isListening={listeningField === 'inventorySearch'}
                        onClick={() => startVoiceInput('inventorySearch', (val) => setSearchQuery(val))}
                      />
                    </InputAdornment>
                  ),
                  sx: { fontSize: '0.75rem', height: 36, width: { xs: 200, sm: 260 }, bgcolor: '#f8fafc', borderRadius: 2 },
                }}
              />
            </Box>
          </Box>

          {/* Table */}
          <TableContainer component={Paper} elevation={0}>
            <Table size="small">
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#64748b' }}>Code</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#64748b' }}>Product Name</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#64748b' }}>Size / Color</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#64748b' }}>Company</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#64748b' }}>Unit</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#64748b' }}>Stock IN</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#64748b' }}>Stock OUT</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#64748b' }}>Balance</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#64748b' }}>Unit Price</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#64748b' }}>Valuation</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#64748b', textAlign: 'right' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStock.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} sx={{ textAlign: 'center', py: 4, color: '#94a3b8' }}>
                      No inventory records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStock.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((it) => {
                    const code = it.uniqueCode || it.sku;
                    const price = it.price || it.unitPrice || 0;
                    const valuation = (it.stock || 0) * price;
                    return (
                      <TableRow key={code} hover>
                        <TableCell sx={{ fontWeight: 800, fontFamily: 'monospace', color: '#4f46e5', fontSize: '0.75rem' }}>
                          {code}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.75rem' }}>{it.name}</TableCell>
                        <TableCell sx={{ color: '#64748b', fontSize: '0.75rem' }}>
                          {[it.size, it.color].filter(Boolean).join(' • ') || '-'}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }}>
                          <Chip size="small" label={it.company} sx={{ height: 20, fontSize: '0.65rem', fontWeight: 600 }} />
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{it.unit || it.uom || 'PAC'}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>{it.stockIn || 0}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem', color: '#e11d48', fontWeight: 700 }}>{it.stockOut || 0}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a' }}>{it.stock || 0}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600 }}>₹{price}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669' }}>₹{valuation.toLocaleString()}</TableCell>
                        <TableCell sx={{ textAlign: 'right' }}>
                          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleOpenQrModal(it)}
                              startIcon={<QrCode2Icon sx={{ fontSize: 14 }} />}
                              sx={{
                                py: 0.2,
                                px: 1,
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                textTransform: 'none',
                                borderRadius: 1.5,
                                color: '#4f46e5',
                                borderColor: '#c7d2fe',
                              }}
                            >
                              QR
                            </Button>
                            <IconButton size="small" onClick={() => handleOpenEdit(it)} sx={{ color: '#64748b' }}>
                              <EditOutlinedIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleDeleteItem(code)} sx={{ color: '#ef4444' }}>
                              <DeleteOutlinedIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredStock.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </Card>
      )}

      {/* TAB 1: STOCK IN RECORDS */}
      {currentTab === 1 && (
        <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', p: 2, bgcolor: '#ffffff' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5 }}>
            Inward GRN (Stock In Ledger)
          </Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table size="small">
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>GRN #</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Company</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Product Code</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Product Name</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Mode</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Inward Qty</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Source</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stockInRecords.map((rec) => (
                  <TableRow key={rec.id} hover>
                    <TableCell sx={{ fontWeight: 700, fontFamily: 'monospace', color: '#4f46e5' }}>{rec.id}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{rec.date}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{rec.company}</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontFamily: 'monospace' }}>{rec.code}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{rec.name}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{rec.mode}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669' }}>
                      +{rec.qty} {rec.unit || 'PAC'}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', color: '#64748b' }}>{rec.source}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* TAB 2: STOCK OUT RECORDS */}
      {currentTab === 2 && (
        <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', p: 2, bgcolor: '#ffffff' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5 }}>
            Outward Dispatches (Stock Out Ledger)
          </Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table size="small">
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Dispatch #</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Company</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Product Code</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Product Name</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Customer / Destination</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Qty Out</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Selling Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stockOutRecords.map((rec) => (
                  <TableRow key={rec.id} hover>
                    <TableCell sx={{ fontWeight: 700, fontFamily: 'monospace', color: '#e11d48' }}>{rec.id}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{rec.date}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{rec.company}</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontFamily: 'monospace' }}>{rec.code}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{rec.name}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{rec.customer || rec.destination}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', fontWeight: 800, color: '#e11d48' }}>
                      -{rec.qty} {rec.unit || 'PAC'}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', fontWeight: 700 }}>₹{rec.price || 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* MODAL 2: RECORD STOCK OUT */}
      <Dialog open={isStockOutModalOpen} onClose={() => setIsStockOutModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <RemoveCircleOutlinedIcon sx={{ color: '#e11d48' }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Record Stock OUT (Dispatch Order)</Typography>
          </Box>
          <IconButton size="small" onClick={() => setIsStockOutModalOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Selected item card badge */}
            {selectedOutwardItem && (
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#166534' }}>
                    {selectedOutwardItem.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#15803d' }}>
                    Code: {selectedOutwardItem.uniqueCode || selectedOutwardItem.sku} • Size: {selectedOutwardItem.size}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Chip size="small" label={`Stock: ${selectedOutwardItem.stock} PAC`} sx={{ bgcolor: '#dcfce7', color: '#166534', fontWeight: 700 }} />
                  <Typography variant="caption" sx={{ display: 'block', mt: 0.3, fontWeight: 700, color: '#15803d' }}>
                    ₹{selectedOutwardItem.price || 0} / PAC
                  </Typography>
                </Box>
              </Box>
            )}

            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', display: 'block', mb: 0.5 }}>
                Customer Name *
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={outwardCustomer}
                onChange={(e) => setOutwardCustomer(e.target.value)}
              />
            </Box>

            {/* Product Code with Clear Button */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155' }}>
                  Unique Product Code *
                </Typography>
                {outwardCode && (
                  <Button
                    size="small"
                    onClick={() => {
                      setOutwardCode('');
                    }}
                    startIcon={<ClearIcon sx={{ fontSize: 12 }} />}
                    sx={{
                      py: 0.1,
                      px: 0.8,
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      color: '#e11d48',
                      textTransform: 'none',
                    }}
                  >
                    Clear
                  </Button>
                )}
              </Box>

              <Select
                fullWidth
                size="small"
                value={outwardCode}
                onChange={(e) => {
                  setOutwardCode(e.target.value);
                  const found = stockItems.find((i) => (i.uniqueCode || i.sku) === e.target.value);
                  if (found) {
                    setOutwardPrice(Math.max(0, found.price || found.unitPrice || 0));
                  }
                }}
                displayEmpty
              >
                <MenuItem value="" disabled>Search or select product code</MenuItem>
                {stockItems.map((i) => (
                  <MenuItem key={i.uniqueCode || i.sku} value={i.uniqueCode || i.sku}>
                    {(i.uniqueCode || i.sku)} — {i.name} ({i.stock} PAC available)
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', display: 'block', mb: 0.5 }}>
                  Dispatch Qty (PAC) *
                </Typography>
                <TextField
                  type="number"
                  fullWidth
                  size="small"
                  value={outwardQty}
                  onChange={(e) => setOutwardQty(Math.max(1, parseInt(e.target.value) || 1))}
                  inputProps={{ min: 1 }}
                />
              </Box>

              {/* Selling price with zero and negative fix */}
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', display: 'block', mb: 0.5 }}>
                  Selling Price (₹) *
                </Typography>
                <TextField
                  type="number"
                  fullWidth
                  size="small"
                  value={outwardPrice === 0 ? '' : outwardPrice}
                  placeholder="0"
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '') {
                      setOutwardPrice(0);
                    } else {
                      const num = parseFloat(val);
                      setOutwardPrice(isNaN(num) || num < 0 ? 0 : num);
                    }
                  }}
                  inputProps={{ min: 0 }}
                />
              </Box>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', display: 'block', mb: 0.5 }}>
                Destination / Vehicle No.
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={outwardDestination}
                onChange={(e) => setOutwardDestination(e.target.value)}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIsStockOutModalOpen(false)} color="inherit">Cancel</Button>
          <Button variant="contained" onClick={handleRecordStockOutSubmit} sx={{ bgcolor: '#e11d48', '&:hover': { bgcolor: '#be123c' } }}>
            Confirm & Dispatch Stock OUT
          </Button>
        </DialogActions>
      </Dialog>

      {/* MODAL 3: EDIT STOCK ITEM */}
      <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Edit Stock Item</Typography>
          <IconButton size="small" onClick={() => setIsEditModalOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 2 }}>
          {editingItem && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <TextField label="Product Name" size="small" fullWidth value={editingItem.name || ''} onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })} />
              <TextField label="Size" size="small" fullWidth value={editingItem.size || ''} onChange={(e) => setEditingItem({ ...editingItem, size: e.target.value })} />
              <TextField label="Color" size="small" fullWidth value={editingItem.color || ''} onChange={(e) => setEditingItem({ ...editingItem, color: e.target.value })} />
              <TextField label="Current Stock" type="number" size="small" fullWidth value={editingItem.stock || 0} onChange={(e) => setEditingItem({ ...editingItem, stock: Math.max(0, parseInt(e.target.value) || 0) })} />
              <TextField label="Selling Price (₹)" type="number" size="small" fullWidth value={editingItem.price === 0 ? '' : editingItem.price} placeholder="0" onChange={(e) => {
                const val = e.target.value;
                setEditingItem({ ...editingItem, price: val === '' ? 0 : Math.max(0, parseFloat(val) || 0) });
              }} />
              <TextField label="Location" size="small" fullWidth value={editingItem.location || ''} onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })} />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIsEditModalOpen(false)} color="inherit">Cancel</Button>
          <Button variant="contained" onClick={handleSaveEdit} sx={{ bgcolor: '#4f46e5' }}>Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Unified Stock IN & QR Label Print Modal (Second One) */}
      <QrPrintModal
        open={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        item={selectedQrItem}
        items={filteredStock.length > 0 ? filteredStock : stockItems}
        onSelectItem={handleSelectQrItem}
        copies={qrCopies}
        onCopiesChange={setQrCopies}
        recordAsStockIn={recordStockInOnPrint}
        onRecordAsStockInChange={setRecordStockInOnPrint}
        onPrint={handleExecutePrintAndStockIn}
        qrDataUrl={generatedQrDataUrl}
      />

      {/* QR Camera Scanner Modal */}
      <QrScannerModal
        open={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={(code) => {
          const found = stockItems.find((i) => (i.uniqueCode || i.sku) === code);
          if (found) {
            handleOpenQrModal(found);
          }
          setIsScannerOpen(false);
          triggerToast(`Scanned Code: ${code}`);
        }}
      />
    </Box>
  );
}
