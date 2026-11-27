import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Alert,
  FormControlLabel,
  Switch,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import SaveIcon from '@mui/icons-material/Save';
import QRCode from 'qrcode';
import { generateBarcodeSvg } from './barcodeRenderer';

export default function PrinterSettingsPanel({
  printerSettings,
  onSavePrinterSettings,
  onLogPrintJob,
  triggerToast,
}) {
  const [form, setForm] = useState(printerSettings);
  const [sampleQrUrl, setSampleQrUrl] = useState('');
  const [printError, setPrintError] = useState('');

  useEffect(() => {
    setForm(printerSettings);
  }, [printerSettings]);

  useEffect(() => {
    QRCode.toDataURL('PRD-0001', { width: 120, margin: 1 })
      .then(setSampleQrUrl)
      .catch(() => {});
  }, []);

  const validateDimensions = (w, h) => {
    const width = Number(w);
    const height = Number(h);
    if (!Number.isFinite(width) || width < 15 || width > 200) {
      return 'Label Width must be between 15 mm and 200 mm.';
    }
    if (!Number.isFinite(height) || height < 15 || height > 200) {
      return 'Label Height must be between 15 mm and 200 mm.';
    }
    return '';
  };

  const dimensionError = validateDimensions(form.labelWidthMm, form.labelHeightMm);

  const handleSave = () => {
    if (dimensionError) {
      triggerToast(dimensionError, 'error');
      return;
    }
    onSavePrinterSettings({
      ...form,
      labelWidthMm: Number(form.labelWidthMm),
      labelHeightMm: Number(form.labelHeightMm),
    });
    triggerToast('Citizen CL-S631II printer settings saved locally!', 'success');
  };

  const handleTestPrint = () => {
    setPrintError('');
    if (dimensionError) {
      setPrintError(dimensionError);
      triggerToast(dimensionError, 'error');
      return;
    }

    const w = Number(form.labelWidthMm);
    const h = Number(form.labelHeightMm);
    const barcodeSvg = generateBarcodeSvg('PRD-0001', form.barcodeType, 34);

    const win = window.open('', '_blank', 'width=600,height=500');
    if (!win) {
      const msg = 'Print popup was blocked by the browser. Please allow popups for this site and try again.';
      setPrintError(msg);
      triggerToast(msg, 'error');
      return;
    }

    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Citizen CL-S631II Test Label</title>
          <style>
            @page { size: ${w}mm ${h}mm; margin: 0; }
            body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
            .label {
              width: ${w}mm;
              height: ${h}mm;
              box-sizing: border-box;
              padding: 2mm;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              border: 1px dashed #cbd5e1;
            }
            @media print {
              .label { border: none; }
            }
          </style>
        </head>
        <body>
          <div class="label">
            <div style="display:flex;justify-content:space-between;align-items:center;font-size:8pt;font-weight:bold;">
              <span>SIONA ERP TEST</span>
              <span>${w}x${h}mm</span>
            </div>
            <div style="display:flex;align-items:center;gap:4px;">
              <div style="flex:1;">${barcodeSvg}</div>
              ${form.includeQr && sampleQrUrl ? `<img src="${sampleQrUrl}" style="width:12mm;height:12mm;" />` : ''}
            </div>
            <div style="font-size:7pt;text-align:center;font-family:monospace;font-weight:bold;">
              PRD-0001 • ${form.printerModel}
            </div>
          </div>
          <script>
            window.onload = function() { window.focus(); window.print(); };
          </script>
        </body>
      </html>
    `);
    win.document.close();

    if (onLogPrintJob) {
      onLogPrintJob({
        jobType: 'Test Print',
        printer: form.printerName,
        labelSize: `${w}x${h} mm`,
        totalLabels: 1,
        status: 'Print Dialog Opened',
      });
    }
    triggerToast('Test label sent to browser print dialog!', 'success');
  };

  const sampleBarcodeSvg = generateBarcodeSvg('PRD-0001', form.barcodeType, 36);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Alert severity="info" sx={{ borderRadius: 2.5, border: '1px solid #bfdbfe', bgcolor: '#eff6ff' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e3a8a', fontSize: '0.82rem' }}>
          Citizen CL-S631II Printing Mode: Browser Print via Official OS Driver
        </Typography>
        <Typography variant="caption" sx={{ color: '#1e40af', display: 'block' }}>
          Browsers cannot directly detect USB thermal printers without a native driver. Select your installed Citizen CL-S631II printer in the browser print dialog and disable headers/footers for exact {form.labelWidthMm}×{form.labelHeightMm} mm thermal output.
        </Typography>
      </Alert>

      {printError && (
        <Alert severity="error" sx={{ borderRadius: 2.5 }}>
          {printError}
        </Alert>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.3fr 1fr' }, gap: 2.5 }}>
        {/* Configuration Form */}
        <Card elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', mb: 2 }}>
            Citizen CL-S631II Configuration
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <TextField
              size="small"
              label="Printer Name"
              value={form.printerName}
              onChange={(e) => setForm({ ...form, printerName: e.target.value })}
            />
            <TextField
              size="small"
              label="Printer Model"
              value={form.printerModel}
              onChange={(e) => setForm({ ...form, printerModel: e.target.value })}
            />

            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', display: 'block', mb: 0.5 }}>
                Connection Type
              </Typography>
              <Select
                fullWidth
                size="small"
                value={form.connectionType}
                onChange={(e) => setForm({ ...form, connectionType: e.target.value })}
              >
                <MenuItem value="Browser Print (Citizen Driver)">Browser Print (Citizen Driver)</MenuItem>
                <MenuItem value="USB (via OS Print Dialog)">USB (via OS Print Dialog)</MenuItem>
                <MenuItem value="Network (via OS Print Queue)">Network (via OS Print Queue)</MenuItem>
              </Select>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', display: 'block', mb: 0.5 }}>
                Barcode Type
              </Typography>
              <Select
                fullWidth
                size="small"
                value={form.barcodeType}
                onChange={(e) => setForm({ ...form, barcodeType: e.target.value })}
              >
                <MenuItem value="CODE128">Code 128 (Recommended)</MenuItem>
                <MenuItem value="CODE39">Code 39</MenuItem>
              </Select>
            </Box>

            <TextField
              size="small"
              type="number"
              label="Label Width (mm)"
              value={form.labelWidthMm}
              onChange={(e) => setForm({ ...form, labelWidthMm: e.target.value })}
              error={Boolean(dimensionError)}
              inputProps={{ min: 15, max: 200 }}
            />
            <TextField
              size="small"
              type="number"
              label="Label Height (mm)"
              value={form.labelHeightMm}
              onChange={(e) => setForm({ ...form, labelHeightMm: e.target.value })}
              error={Boolean(dimensionError)}
              inputProps={{ min: 15, max: 200 }}
            />

            <TextField
              size="small"
              type="number"
              label="Print Density (1-15, Driver Ref)"
              value={form.printDensity}
              onChange={(e) => setForm({ ...form, printDensity: Math.min(15, Math.max(1, Number(e.target.value) || 10)) })}
              inputProps={{ min: 1, max: 15 }}
            />
            <TextField
              size="small"
              type="number"
              label="Print Speed (2-6 ips, Driver Ref)"
              value={form.printSpeed}
              onChange={(e) => setForm({ ...form, printSpeed: Math.min(6, Math.max(2, Number(e.target.value) || 4)) })}
              inputProps={{ min: 2, max: 6 }}
            />
          </Box>

          <Box sx={{ mt: 1.5 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(form.includeQr)}
                  onChange={(e) => setForm({ ...form, includeQr: e.target.checked })}
                />
              }
              label={<Typography variant="caption" sx={{ fontWeight: 700 }}>Include QR Code on Labels</Typography>}
            />
          </Box>

          {dimensionError && (
            <Alert severity="error" sx={{ mt: 1.5, borderRadius: 2 }}>
              {dimensionError}
            </Alert>
          )}

          <Box sx={{ mt: 2.5, display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              onClick={handleSave}
              startIcon={<SaveIcon />}
              sx={{ bgcolor: '#4f46e5', textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
            >
              Save Printer Settings
            </Button>
            <Button
              variant="outlined"
              onClick={handleTestPrint}
              startIcon={<PrintIcon />}
              sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
            >
              Test Print Label
            </Button>
          </Box>
        </Card>

        {/* Live Sample Label Preview */}
        <Card elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
              Sample Label Preview
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 2 }}>
              Scaled preview for {form.labelWidthMm || 50} mm × {form.labelHeightMm || 25} mm ({form.barcodeType})
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 3, bgcolor: '#f8fafc', borderRadius: 2.5, border: '1px dashed #cbd5e1' }}>
            <Box
              sx={{
                width: Math.min(300, Math.max(160, Number(form.labelWidthMm || 50) * 4)),
                minHeight: Math.min(180, Math.max(90, Number(form.labelHeightMm || 25) * 4)),
                bgcolor: '#ffffff',
                border: '1px solid #0f172a',
                borderRadius: 1,
                p: 1.25,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontSize: '0.68rem', fontWeight: 800 }}>SIONA PLASTO</Typography>
                <Typography sx={{ fontSize: '0.6rem', color: '#64748b' }}>TYRE • T-1</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 0.5 }}>
                <Box sx={{ flex: 1 }} dangerouslySetInnerHTML={{ __html: sampleBarcodeSvg }} />
                {form.includeQr && sampleQrUrl && (
                  <Box component="img" src={sampleQrUrl} alt="Sample QR" sx={{ width: 42, height: 42 }} />
                )}
              </Box>

              <Typography sx={{ fontSize: '0.68rem', fontWeight: 800, fontFamily: 'monospace', textAlign: 'center' }}>
                PRD-0001
              </Typography>
            </Box>
          </Box>

          <Typography variant="caption" sx={{ color: '#64748b', mt: 2, display: 'block' }}>
            Status: <strong>Configured ({form.connectionType})</strong>
          </Typography>
        </Card>
      </Box>
    </Box>
  );
}
