import React, { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  Button,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { Html5Qrcode } from 'html5-qrcode';

export default function QrScannerModal({ open, onClose, onScanSuccess }) {
  const [errorMsg, setErrorMsg] = useState('');
  const scannerRef = useRef(null);
  const containerId = 'qr-camera-stream-box';

  useEffect(() => {
    let isMounted = true;
    if (open) {
      setErrorMsg('');
      const timer = setTimeout(() => {
        try {
          const scanner = new Html5Qrcode(containerId);
          scannerRef.current = scanner;

          scanner
            .start(
              { facingMode: 'environment' },
              {
                fps: 10,
                qrbox: { width: 220, height: 220 },
              },
              (decodedText) => {
                if (isMounted) {
                  stopScanner();
                  onScanSuccess(decodedText);
                }
              },
              () => {
                // Ignore transient frame errors
              }
            )
            .catch((err) => {
              if (isMounted) {
                console.warn('Camera start error:', err);
                setErrorMsg('Camera access failed. Please ensure camera permissions are allowed.');
              }
            });
        } catch (err) {
          if (isMounted) {
            console.warn('Html5Qrcode init error:', err);
            setErrorMsg('Unable to initialize camera scanner.');
          }
        }
      }, 300);

      return () => {
        isMounted = false;
        clearTimeout(timer);
        stopScanner();
      };
    } else {
      stopScanner();
    }
  }, [open]);

  const stopScanner = () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          scannerRef.current.stop().catch(() => {});
        }
      } catch (e) {
        // Safe catch
      }
      scannerRef.current = null;
    }
  };

  const handleCancel = () => {
    stopScanner();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, p: 1 },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CameraAltIcon sx={{ color: '#4f46e5' }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a' }}>
            Scan Product QR / Barcode
          </Typography>
        </Box>
        <IconButton size="small" onClick={handleCancel} sx={{ color: '#94a3b8' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 2, py: 1 }}>
        <Typography variant="caption" sx={{ color: '#64748b', mb: 2, display: 'block' }}>
          Position QR code or Barcode inside the camera frame to automatically populate product code.
        </Typography>

        {errorMsg && (
          <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
            {errorMsg}
          </Alert>
        )}

        <Box
          id={containerId}
          sx={{
            width: '100%',
            minHeight: 260,
            borderRadius: 2,
            overflow: 'hidden',
            backgroundColor: '#0f172a',
            border: '2px solid #e2e8f0',
          }}
        />
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          color="inherit"
          onClick={handleCancel}
          sx={{
            borderRadius: 2,
            fontWeight: 700,
            py: 1,
            textTransform: 'none',
            borderColor: '#cbd5e1',
            color: '#475569',
            '&:hover': {
              backgroundColor: '#f1f5f9',
            },
          }}
        >
          Cancel & Close Camera
        </Button>
      </DialogActions>
    </Dialog>
  );
}
