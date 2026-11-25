import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';

export default function VoiceButton({ isListening, onClick, title = 'Voice Input' }) {
  return (
    <Tooltip title={isListening ? 'Listening...' : title}>
      <IconButton
        size="small"
        onClick={onClick}
        sx={{
          color: isListening ? '#e11d48' : '#94a3b8',
          animation: isListening ? 'pulse 1.2s infinite' : 'none',
          '@keyframes pulse': {
            '0%': { transform: 'scale(1)', opacity: 1 },
            '50%': { transform: 'scale(1.2)', opacity: 0.7 },
            '100%': { transform: 'scale(1)', opacity: 1 },
          },
          '&:hover': {
            color: '#4f46e5',
            backgroundColor: 'rgba(79, 70, 229, 0.08)',
          },
        }}
      >
        <MicIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
