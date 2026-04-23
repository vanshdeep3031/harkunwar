import React from 'react';
import { Box, Avatar, Typography, Paper } from '@mui/material';

const COLORS = [
  '#1976d2','#388e3c','#d32f2f','#7b1fa2','#f57c00','#0288d1','#00796b'
];

const getColor = (name) => {
  let hash = 0;
  for (let c of name) hash = (hash * 31 + c.charCodeAt(0)) % COLORS.length;
  return COLORS[hash];
};

const formatTime = (iso) => {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export function SystemMessage({ text, timestamp }) {
  return (
    <Box textAlign="center" my={1}>
      <Typography variant="caption" color="text.secondary"
        sx={{ bgcolor: '#f0f0f0', px: 2, py: 0.5, borderRadius: 10, display: 'inline-block' }}>
        {text} · {formatTime(timestamp)}
      </Typography>
    </Box>
  );
}

export default function MessageBubble({ message, isOwn }) {
  const color = getColor(message.username);
  const initials = message.username.slice(0, 2).toUpperCase();

  return (
    <Box
      display="flex"
      flexDirection={isOwn ? 'row-reverse' : 'row'}
      alignItems="flex-end"
      gap={1}
      mb={1.5}
    >
      <Avatar sx={{ bgcolor: color, width: 36, height: 36, fontSize: '0.8rem', flexShrink: 0 }}>
        {initials}
      </Avatar>
      <Box maxWidth="70%" minWidth={80}>
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          textAlign={isOwn ? 'right' : 'left'}
          mb={0.3}
        >
          {isOwn ? 'You' : message.username} · {formatTime(message.timestamp)}
        </Typography>
        <Paper
          elevation={1}
          sx={{
            px: 2, py: 1,
            bgcolor: isOwn ? 'primary.main' : 'white',
            color: isOwn ? 'white' : 'text.primary',
            borderRadius: isOwn ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          }}
        >
          <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
            {message.text}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}
