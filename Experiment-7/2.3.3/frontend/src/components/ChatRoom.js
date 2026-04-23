import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box, AppBar, Toolbar, Typography, TextField, IconButton,
  Chip, Paper, Divider, Badge, Tooltip
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import MessageBubble, { SystemMessage } from './MessageBubble';

const TYPING_TIMEOUT = 1500;

export default function ChatRoom({ socket, username, onLeave }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const typingTimerRef = useRef(null);
  const isTypingRef = useRef(false);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers, scrollToBottom]);

  useEffect(() => {
    // Socket event listeners
    socket.on('message:receive', (msg) => {
      setMessages(prev => [...prev, { ...msg, type: 'user' }]);
    });

    socket.on('message:system', (msg) => {
      setMessages(prev => [...prev, { ...msg, id: Date.now(), type: 'system' }]);
    });

    socket.on('users:update', (users) => {
      setOnlineUsers(users);
    });

    socket.on('typing:update', ({ username: typingUser, isTyping }) => {
      setTypingUsers(prev =>
        isTyping
          ? [...prev.filter(u => u !== typingUser), typingUser]
          : prev.filter(u => u !== typingUser)
      );
    });

    return () => {
      socket.off('message:receive');
      socket.off('message:system');
      socket.off('users:update');
      socket.off('typing:update');
    };
  }, [socket]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    socket.emit('message:send', { text });
    setInput('');
    // Stop typing
    if (isTypingRef.current) {
      socket.emit('typing:stop');
      isTypingRef.current = false;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    // Typing indicator logic
    if (!isTypingRef.current) {
      socket.emit('typing:start');
      isTypingRef.current = true;
    }
    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      socket.emit('typing:stop');
      isTypingRef.current = false;
    }, TYPING_TIMEOUT);
  };

  const handleLeave = () => {
    socket.disconnect();
    onLeave();
  };

  const typingText = typingUsers.length === 1
    ? `${typingUsers[0]} is typing...`
    : typingUsers.length > 1
    ? `${typingUsers.join(', ')} are typing...`
    : '';

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f5f5f5' }}>
      {/* Header */}
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <Typography variant="h6" fontWeight="bold" sx={{ flexGrow: 1 }}>
            💬 Chat Room
          </Typography>
          <Tooltip title={`Online: ${onlineUsers.join(', ')}`}>
            <Chip
              icon={<PeopleIcon />}
              label={`${onlineUsers.length} online`}
              color="success"
              size="small"
              sx={{ mr: 1, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
          </Tooltip>
          <Typography variant="caption" sx={{ mr: 2, opacity: 0.8 }}>
            👤 {username}
          </Typography>
          <Tooltip title="Leave chat">
            <IconButton color="inherit" onClick={handleLeave}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Online users bar */}
      <Box sx={{ bgcolor: 'white', px: 2, py: 0.5, display: 'flex', gap: 1, flexWrap: 'wrap', borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="caption" color="text.secondary" alignSelf="center">Online:</Typography>
        {onlineUsers.map(u => (
          <Chip key={u} label={u} size="small" color={u === username ? 'primary' : 'default'} variant="outlined" />
        ))}
      </Box>

      {/* Messages area */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
        {messages.length === 0 && (
          <Box textAlign="center" mt={8}>
            <Typography variant="h4" mb={1}>👋</Typography>
            <Typography color="text.secondary">You joined the chat! Say hello.</Typography>
          </Box>
        )}
        {messages.map((msg) =>
          msg.type === 'system' ? (
            <SystemMessage key={msg.id} text={msg.text} timestamp={msg.timestamp} />
          ) : (
            <MessageBubble key={msg.id} message={msg} isOwn={msg.username === username} />
          )
        )}

        {/* Typing indicator */}
        {typingText && (
          <Box display="flex" alignItems="center" gap={1} ml={1} mb={1}>
            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              {typingText}
            </Typography>
            <Box display="flex" gap={0.3}>
              {[0, 1, 2].map(i => (
                <Box key={i} sx={{
                  width: 6, height: 6, borderRadius: '50%', bgcolor: 'grey.400',
                  animation: 'bounce 1.4s infinite',
                  animationDelay: `${i * 0.2}s`,
                  '@keyframes bounce': {
                    '0%, 80%, 100%': { transform: 'scale(0)' },
                    '40%': { transform: 'scale(1)' },
                  }
                }} />
              ))}
            </Box>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Divider />

      {/* Message input */}
      <Paper elevation={3} sx={{ p: 2 }}>
        <Box display="flex" gap={1} alignItems="flex-end">
          <TextField
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (Enter to send)"
            fullWidth
            multiline
            maxRows={4}
            size="small"
            variant="outlined"
            autoFocus
          />
          <IconButton
            color="primary"
            onClick={handleSend}
            disabled={!input.trim()}
            sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' },
              '&:disabled': { bgcolor: 'grey.300' } }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
}
