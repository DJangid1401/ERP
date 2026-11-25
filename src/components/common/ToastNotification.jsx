import React from 'react';
import { Snackbar, Alert } from '@mui/material';

export default function ToastNotification({ open, message, severity = 'success', onClose }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{
          borderRadius: 2,
          fontWeight: 600,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
