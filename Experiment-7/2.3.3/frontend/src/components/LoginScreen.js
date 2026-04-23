import React, { useState } from 'react';
import {
  Box, TextField, Button, Typography, Paper, Avatar
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';

export default function LoginScreen({ onJoin }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const trimmed = username.trim();
    if (!trimmed) {
      setError('Please enter a username');
      return;
    }
    if (trimmed.length < 2) {
      setError('Username must be at least 2 characters');
      return;
    }
    onJoin(trimmed);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'primary.main',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper elevation={8} sx={{ p: 5, width: '100%', maxWidth: 400, textAlign: 'center', borderRadius: 3 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64, mx: 'auto', mb: 2 }}>
          <ChatIcon sx={{ fontSize: 36 }} />
        </Avatar>
        <Typography variant="h4" fontWeight="bold" mb={1}>Chat Room</Typography>
        <Typography color="text.secondary" mb={4}>
          Real-time chat with Socket.IO
        </Typography>
        <TextField
          label="Enter your username"
          value={username}
          onChange={(e) => { setUsername(e.target.value); setError(''); }}
          onKeyDown={handleKeyDown}
          error={!!error}
          helperText={error}
          fullWidth
          autoFocus
          sx={{ mb: 3 }}
          inputProps={{ maxLength: 20 }}
        />
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={handleSubmit}
          sx={{ py: 1.5, fontSize: '1rem', fontWeight: 'bold' }}
        >
          Enter Chat →
        </Button>
        <Typography variant="caption" color="text.secondary" mt={3} display="block">
          Experiment 2.3.3 — Full Stack I
        </Typography>
      </Paper>
    </Box>
  );
}
