import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Link,
  Select,
  MenuItem,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';

export default function QrPrintModal({
  open,
  onClose,
  item,
  items,
  onSelectItem,
  copies,
  onCopiesChange,
  recordAsStockIn,
  onRecordAsStockInChange,
  onPrint,
  qrDataUrl,
}) {
  if (!item) return null;

  const uniqueCode = item.uniqueCode || item.sku || 'PRD-0001';
  const labelText = [item.size, item.color].filter(Boolean).join(', ') || 'Standard';
  const uom = item.unit || item.uom || 'PAC';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, p: 1 },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a' }}>
            QR Label — {uniqueCode}
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.2 }}>
            Product details are embedded inside each QR code — only Size & Color are printed below.
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ color: '#94a3b8' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 2, py: 1 }}>
        {/* Product Dropdown Selector */}
        {items && items.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', display: 'block', mb: 0.5 }}>
              Product Code / Description:
            </Typography>
            <Select
              fullWidth
              size="small"
              value={uniqueCode}
              onChange={(e) => {
                const found = items.find((i) => (i.uniqueCode || i.sku) === e.target.value);
                if (found && onSelectItem) onSelectItem(found);
              }}
              sx={{
                fontSize: '0.75rem',
                fontWeight: 600,
                bgcolor: '#f8fafc',
                borderRadius: 2,
              }}
            >
              {items.map((i) => {
                const c = i.uniqueCode || i.sku;
                return (
                  <MenuItem key={c} value={c}>
                    {c} — {i.name} ({[i.size, i.color].filter(Boolean).join(' • ')})
                  </MenuItem>
                );
              })}
            </Select>
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#334155' }}>
            Copies per product:
          </Typography>
          <TextField
            type="number"
            size="small"
            value={copies}
            onChange={(e) => onCopiesChange(Math.max(1, parseInt(e.target.value) || 1))}
            inputProps={{ min: 1, style: { padding: '4px 8px', width: 60, textAlign: 'center', fontSize: 13, fontWeight: 700 } }}
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={recordAsStockIn}
                  onChange={(e) => onRecordAsStockInChange(e.target.checked)}
                  size="small"
                  sx={{ color: '#10b981', '&.Mui-checked': { color: '#059669' } }}
                />
              }
              label={
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  Record as Stock IN (+{copies} {uom} on print)
                </Typography>
              }
              sx={{ m: 0 }}
            />
          </Box>

          <Button
            variant="contained"
            onClick={onPrint}
            startIcon={<PrintIcon />}
            sx={{
              py: 1.2,
              borderRadius: 2,
              fontWeight: 700,
              textTransform: 'none',
              backgroundColor: recordAsStockIn ? '#059669' : '#0f172a',
              '&:hover': {
                backgroundColor: recordAsStockIn ? '#047857' : '#1e293b',
              },
            }}
          >
            {recordAsStockIn ? `Print & Add to Stock IN (+${copies})` : `Print`}
          </Button>
        </Box>

        {/* Minimal Sticker Format matching user reference image */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
            border: '1px dashed #64748b',
            borderRadius: 2,
            backgroundColor: '#ffffff',
            my: 1,
          }}
        >
          {qrDataUrl ? (
            <Box
              component="img"
              src={qrDataUrl}
              alt={uniqueCode}
              sx={{ width: 120, height: 120, display: 'block' }}
            />
          ) : (
            <Box sx={{ width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>Loading QR...</Typography>
            </Box>
          )}
          <Typography
            variant="caption"
            sx={{
              fontWeight: 800,
              fontSize: '0.75rem',
              color: '#0f172a',
              mt: 1,
              textAlign: 'center',
            }}
          >
            {labelText}
          </Typography>

          {qrDataUrl && (
            <Link
              href={qrDataUrl}
              download={`${uniqueCode}_qr.png`}
              underline="hover"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                mt: 1.5,
                fontSize: '0.75rem',
                color: '#4f46e5',
                fontWeight: 600,
              }}
            >
              <DownloadIcon sx={{ fontSize: 14 }} /> Download PNG
            </Link>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
