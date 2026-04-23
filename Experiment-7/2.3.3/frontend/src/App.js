import React, { useState } from 'react';
import { useSocket } from './hooks/useSocket';
import LoginScreen from './components/LoginScreen';
import ChatRoom from './components/ChatRoom';

export default function App() {
  const [username, setUsername] = useState(null);
  const socket = useSocket();

  const handleJoin = (name) => {
    socket.connect();
    socket.emit('user:join', name);
    setUsername(name);
  };

  const handleLeave = () => {
    setUsername(null);
  };

  if (!username) {
    return <LoginScreen onJoin={handleJoin} />;
  }

  return <ChatRoom socket={socket} username={username} onLeave={handleLeave} />;
}
