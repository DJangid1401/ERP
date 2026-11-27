import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import QRCode from 'qrcode';
import { generateBarcodeSvg } from './barcodeRenderer';

const LABEL_SIZES = [
  { id: 'printer', label: 'Use Printer Settings' },
  { id: '50x25', label: '50 × 25 mm (Small Tag)', w: 50, h: 25 },
  { id: '75x50', label: '75 × 50 mm (Carton Label)', w: 75, h: 50 },
  { id: '100x50', label: '100 × 50 mm (Warehouse)', w: 100, h: 50 },
];

export default function LabelGeneratorPanel({
  stockItems,
  printerSettings,
  onLogPrintJob,
  triggerToast,
}) {
  const [search, setSearch] = useState('');
  const [selectedCodes, setSelectedCodes] = useState(() =>
    stockItems[0] ? [stockItems[0].uniqueCode || stockItems[0].sku] : []
  );
  const [copiesPerProduct, setCopiesPerProduct] = useState(1);
  const [sizeOption, setSizeOption] = useState('printer');
  const [batchNo, setBatchNo] = useState('');
  const [mfgDate, setMfgDate] = useState('');
  const [customText, setCustomText] = useState('');
  const [qrMap, setQrMap] = useState({});
  const [printError, setPrintError] = useState('');

  const [fields, setFields] = useState({
    company: true,
    productName: true,
    productId: true,
    sku: false,
    barcode: true,
    qr: true,
    color: true,
    category: false,
    batch: false,
    quantity: false,
    mfgDate: false,
    customText: false,
  });

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return stockItems;
    const q = search.toLowerCase();
    return stockItems.filter(
      (i) =>
        (i.uniqueCode || i.sku || '').toLowerCase().includes(q) ||
        (i.name || '').toLowerCase().includes(q) ||
        (i.company || '').toLowerCase().includes(q)
    );
  }, [stockItems, search]);

  const selectedItems = useMemo(
    () => stockItems.filter((i) => selectedCodes.includes(i.uniqueCode || i.sku)),
    [stockItems, selectedCodes]
  );

  // Generate safe QR codes containing only stable product identifier (no sensitive data)
  useEffect(() => {
    let active = true;
    async function buildQrs() {
      const next = {};
      for (const item of selectedItems.slice(0, 30)) {
        const code = item.uniqueCode || item.sku || 'PRD-0001';
        try {
          next[code] = await QRCode.toDataURL(code, { width: 140, margin: 1 });
        } catch {
          // ignore
        }
      }
      if (active) setQrMap(next);
    }
    if (fields.qr && selectedItems.length > 0) {
      buildQrs();
    }
    return () => {
      active = false;
    };
  }, [selectedItems, fields.qr]);

  const activeDimensions = useMemo(() => {
    if (sizeOption === 'printer') {
      return {
        w: Number(printerSettings.labelWidthMm) || 50,
        h: Number(printerSettings.labelHeightMm) || 25,
      };
    }
    const found = LABEL_SIZES.find((s) => s.id === sizeOption);
    return { w: found?.w || 50, h: found?.h || 25 };
  }, [sizeOption, printerSettings]);

  const toggleProduct = (code) => {
    setSelectedCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleBulkPrint = async () => {
    setPrintError('');
    if (selectedItems.length === 0) {
      triggerToast('Please select at least one product to generate labels', 'error');
      return;
    }

    const copies = Math.max(1, parseInt(copiesPerProduct, 10) || 1);
    const { w, h } = activeDimensions;
    const win = window.open('', '_blank', 'width=760,height=640');
    if (!win) {
      const msg = 'Print window was blocked by the browser. Please allow popups to print labels.';
      setPrintError(msg);
      triggerToast(msg, 'error');
      return;
    }

    const labelBlocks = [];
    for (const item of selectedItems) {
      const code = item.uniqueCode || item.sku || 'PRD-0001';
      const qrSrc = fields.qr ? qrMap[code] || (await QRCode.toDataURL(code, { width: 140, margin: 1 })) : '';
      const barcodeSvg = fields.barcode ? generateBarcodeSvg(code, printerSettings.barcodeType, 32) : '';

      for (let c = 0; c < copies; c++) {
        labelBlocks.push(`
          <div class="label-card">
            <div class="top-row">
              ${fields.company ? `<span class="comp">${item.company || ''}</span>` : '<span></span>'}
              ${fields.category ? `<span class="cat">${item.category || ''}</span>` : ''}
            </div>
            ${fields.productName ? `<div class="pname">${item.name || ''}</div>` : ''}
            <div class="meta">
              ${fields.productId ? `<span>ID: <b>${code}</b></span>` : ''}
              ${fields.sku && item.sku ? `<span>SKU: ${item.sku}</span>` : ''}
              ${fields.color && item.color ? `<span>${item.color}</span>` : ''}
              ${fields.quantity ? `<span>Qty: ${item.stock || 0} ${item.unit || 'PAC'}</span>` : ''}
              ${fields.batch && batchNo ? `<span>Lot: ${batchNo}</span>` : ''}
              ${fields.mfgDate && mfgDate ? `<span>Mfg: ${mfgDate}</span>` : ''}
            </div>
            <div class="codes">
              ${fields.barcode ? `<div class="bcode">${barcodeSvg}</div>` : ''}
              ${fields.qr && qrSrc ? `<img class="qr" src="${qrSrc}" alt="${code}" />` : ''}
            </div>
            ${fields.customText && customText ? `<div class="custom">${customText}</div>` : ''}
          </div>
        `);
      }
    }

    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Siona ERP Labels (${selectedItems.length} SKUs)</title>
          <style>
            @page { size: ${w}mm ${h}mm; margin: 0; }
            body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
            .label-card {
              width: ${w}mm;
              height: ${h}mm;
              box-sizing: border-box;
              padding: 1.8mm;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              page-break-after: always;
              overflow: hidden;
            }
            .top-row { display: flex; justify-content: space-between; font-size: 6.5pt; color: #334155; font-weight: 700; }
            .pname { font-size: 8pt; font-weight: 800; color: #000; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .meta { display: flex; flex-wrap: wrap; gap: 4px; font-size: 6pt; color: #1e293b; }
            .codes { display: flex; align-items: center; gap: 4px; }
            .bcode { flex: 1; }
            .qr { width: 11mm; height: 11mm; }
            .custom { font-size: 6pt; text-align: center; color: #334155; }
          </style>
        </head>
        <body>
          ${labelBlocks.join('')}
          <script>
            window.onload = function() { window.focus(); window.print(); };
          </script>
        </body>
      </html>
    `);
    win.document.close();

    const totalLabels = selectedItems.length * copies;
    if (onLogPrintJob) {
      onLogPrintJob({
        jobType: selectedItems.length > 1 ? 'Bulk Product Labels' : 'Product Label',
        printer: printerSettings.printerName,
        labelSize: `${w}x${h} mm`,
        totalLabels,
        status: 'Print Dialog Opened',
      });
    }
    triggerToast(`Prepared ${totalLabels} label(s) for printing!`, 'success');
  };

  const previewItem = selectedItems[0] || stockItems[0];
  const previewCode = previewItem ? previewItem.uniqueCode || previewItem.sku : 'PRD-0001';
  const previewBarcodeSvg = generateBarcodeSvg(previewCode, printerSettings.barcodeType, 34);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {printError && <Alert severity="error" sx={{ borderRadius: 2 }}>{printError}</Alert>}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.2fr 1fr' }, gap: 2.5 }}>
        {/* Product Selection from Existing ERP Product Master */}
        <Card elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                Select Products (ERP Product Master)
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                Reuses existing SKUs & unique product codes
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                onClick={() => setSelectedCodes(filteredProducts.map((i) => i.uniqueCode || i.sku))}
                sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.7rem' }}
              >
                Select All
              </Button>
              <Button
                size="small"
                color="inherit"
                onClick={() => setSelectedCodes([])}
                sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.7rem' }}
              >
                Clear ({selectedCodes.length})
              </Button>
            </Box>
          </Box>

          <TextField
            fullWidth
            size="small"
            placeholder="Filter existing products by code, name, or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ mb: 1.5 }}
          />

          <Box sx={{ maxHeight: 320, overflowY: 'auto', border: '1px solid #f1f5f9', borderRadius: 2 }}>
            {filteredProducts.map((item) => {
              const code = item.uniqueCode || item.sku;
              const checked = selectedCodes.includes(code);
              return (
                <Box
                  key={code}
                  onClick={() => toggleProduct(code)}
                  sx={{
                    px: 1.5,
                    py: 0.9,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    borderBottom: '1px solid #f8fafc',
                    bgcolor: checked ? '#f5f3ff' : '#ffffff',
                    '&:hover': { bgcolor: '#f8fafc' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Checkbox size="small" checked={checked} sx={{ p: 0.25 }} />
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#0f172a', display: 'block' }}>
                        {item.name}
                      </Typography>
                      <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#4f46e5', fontSize: '0.68rem' }}>
                        {code} • {item.color || 'Std'} • {item.company}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip size="small" label={`${item.stock || 0} ${item.unit || 'PAC'}`} sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }} />
                </Box>
              );
            })}
          </Box>
        </Card>

        {/* Label Fields, Size & Live Preview */}
        <Card elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', mb: 1.5 }}>
            Label Fields & Print Options
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.25, mb: 1.5 }}>
            {[
              ['company', 'Company Name'],
              ['productName', 'Product Name'],
              ['productId', 'Product ID'],
              ['sku', 'SKU'],
              ['barcode', '1D Barcode'],
              ['qr', 'QR Code'],
              ['color', 'Colour'],
              ['category', 'Category'],
              ['batch', 'Batch / Lot #'],
              ['quantity', 'Quantity'],
              ['mfgDate', 'Mfg Date'],
              ['customText', 'Custom Text'],
            ].map(([key, label]) => (
              <FormControlLabel
                key={key}
                control={
                  <Checkbox
                    size="small"
                    checked={Boolean(fields[key])}
                    onChange={(e) => setFields({ ...fields, [key]: e.target.checked })}
                  />
                }
                label={<Typography variant="caption" sx={{ fontWeight: 600 }}>{label}</Typography>}
              />
            ))}
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 1.5 }}>
            <Select
              size="small"
              value={sizeOption}
              onChange={(e) => setSizeOption(e.target.value)}
            >
              {LABEL_SIZES.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.id === 'printer'
                    ? `Printer (${printerSettings.labelWidthMm}×${printerSettings.labelHeightMm} mm)`
                    : s.label}
                </MenuItem>
              ))}
            </Select>
            <TextField
              size="small"
              type="number"
              label="Copies / Product"
              value={copiesPerProduct}
              onChange={(e) => setCopiesPerProduct(Math.max(1, parseInt(e.target.value, 10) || 1))}
              inputProps={{ min: 1 }}
            />
          </Box>

          {(fields.batch || fields.mfgDate || fields.customText) && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1.5 }}>
              {fields.batch && (
                <TextField size="small" label="Batch / Lot Number" value={batchNo} onChange={(e) => setBatchNo(e.target.value)} />
              )}
              {fields.mfgDate && (
                <TextField size="small" type="date" label="Manufacturing Date" InputLabelProps={{ shrink: true }} value={mfgDate} onChange={(e) => setMfgDate(e.target.value)} />
              )}
              {fields.customText && (
                <TextField size="small" label="Custom Label Text" value={customText} onChange={(e) => setCustomText(e.target.value)} />
              )}
            </Box>
          )}

          {/* Live Label Preview */}
          {previewItem && (
            <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px dashed #cbd5e1', mb: 2, display: 'flex', justifyContent: 'center' }}>
              <Box
                sx={{
                  width: 240,
                  minHeight: 110,
                  bgcolor: '#ffffff',
                  border: '1px solid #0f172a',
                  borderRadius: 1,
                  p: 1.2,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', fontWeight: 700, color: '#334155' }}>
                  <span>{fields.company ? previewItem.company : ''}</span>
                  <span>{fields.category ? previewItem.category : ''}</span>
                </Box>
                {fields.productName && (
                  <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: '#000' }}>
                    {previewItem.name}
                  </Typography>
                )}
                <Typography sx={{ fontSize: '0.6rem', color: '#475569' }}>
                  {[
                    fields.productId ? `ID: ${previewCode}` : '',
                    fields.color && previewItem.color ? previewItem.color : '',
                    fields.quantity ? `Qty: ${previewItem.stock}` : '',
                  ]
                    .filter(Boolean)
                    .join(' • ')}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 0.5 }}>
                  {fields.barcode && (
                    <Box sx={{ flex: 1 }} dangerouslySetInnerHTML={{ __html: previewBarcodeSvg }} />
                  )}
                  {fields.qr && qrMap[previewCode] && (
                    <Box component="img" src={qrMap[previewCode]} alt={previewCode} sx={{ width: 40, height: 40 }} />
                  )}
                </Box>
                {fields.customText && customText && (
                  <Typography sx={{ fontSize: '0.58rem', textAlign: 'center', color: '#334155' }}>
                    {customText}
                  </Typography>
                )}
              </Box>
            </Box>
          )}

          <Button
            fullWidth
            variant="contained"
            onClick={handleBulkPrint}
            disabled={selectedItems.length === 0}
            startIcon={<PrintIcon />}
            sx={{
              py: 1.2,
              bgcolor: '#0f172a',
              '&:hover': { bgcolor: '#1e293b' },
              fontWeight: 800,
              borderRadius: 2,
              textTransform: 'none',
            }}
          >
            Print {selectedItems.length * Math.max(1, copiesPerProduct || 1)} Label(s) ({activeDimensions.w}×{activeDimensions.h} mm)
          </Button>
        </Card>
      </Box>
    </Box>
  );
}
