import React from 'react';
import { Button } from '@mui/material';

export default function ActionButton({
  children,
  variant = 'contained',
  color = 'primary',
  startIcon,
  endIcon,
  onClick,
  disabled = false,
  size = 'small',
  sx = {},
  ...props
}) {
  return (
    <Button
      variant={variant}
      color={color}
      startIcon={startIcon}
      endIcon={endIcon}
      onClick={onClick}
      disabled={disabled}
      size={size}
      sx={{
        textTransform: 'none',
        borderRadius: 2,
        fontWeight: 600,
        boxShadow: 'none',
        '&:hover': {
          boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
