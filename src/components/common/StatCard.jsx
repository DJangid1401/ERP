import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

export default function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  iconColor = '#4f46e5',
  iconBg = '#eef2ff',
  actionText,
  onAction,
}) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: '1px solid #e2e8f0',
        backgroundColor: '#ffffff',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: '#cbd5e1',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        },
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              color: '#64748b',
              fontSize: '0.65rem',
            }}
          >
            {title}
          </Typography>
          {Icon && (
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: 1.5,
                backgroundColor: iconBg,
                color: iconColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon style={{ width: 16, height: 16 }} />
            </Box>
          )}
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', my: 0.5 }}>
          {value}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
          {subtext && (
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem' }}>
              {subtext}
            </Typography>
          )}
          {actionText && (
            <Typography
              variant="caption"
              onClick={onAction}
              sx={{
                color: '#4f46e5',
                fontWeight: 600,
                fontSize: '0.75rem',
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              {actionText}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
