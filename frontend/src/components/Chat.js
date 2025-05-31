import React, { useEffect, useState, useRef } from 'react';
import socket from '../socket';

function Chat({ roomId, username: currentUser, playerSymbol }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.emit('join_chat', { roomId, username: currentUser });

    socket.on('chat_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.emit('leave_chat', { roomId, username: currentUser });
      socket.off('chat_message');
    };
  }, [roomId, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (input.trim() === '') return;
    socket.emit('chat_message', {
      roomId,
      username: currentUser,
      symbol: playerSymbol,
      message: input.trim(),
    });
    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div
      style={{
        width: 320,
        height: 460,
        backgroundColor: '#121417',
        borderRadius: 12,
       
        display: 'flex',
        flexDirection: 'column',
        padding: 16,
        color: '#ddd',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        fontSize: 14,
      }}
    >
      <h3 style={{ marginBottom: 12, color: '#ff4081', textShadow: 'none' }}>
        Chat Room
      </h3>
      <div
        style={{
          flexGrow: 1,
          overflowY: 'auto',
          marginBottom: 12,
          border: '1px solid #333',
          padding: 8,
          borderRadius: 8,
          backgroundColor: '#1a1e25',
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE 10+
        }}
    
        className="scrollbar-hide"
      >
        {messages.length === 0 && (
          <p style={{ color: '#555', fontStyle: 'italic' }}>No messages yet.</p>
        )}
        {messages.map(({ username, symbol, message }, idx) => {
  const isCurrentUser = username === currentUser;
  return (
    <div
      key={idx}
      style={{
        display: 'flex',
        justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
        marginBottom: 12,
      }}
    >
      <div
        style={{
          backgroundColor: isCurrentUser ? '#1de9b6' : '#ff4081',
          color: '#121417',
          borderRadius: 12,
          padding: '8px 12px',
          fontWeight: '600',
          fontSize: 16,
          maxWidth: '75%',
          wordBreak: 'break-word',
          textShadow: 'none',
       
          display: 'inline-block',
        }}
      >
        <strong>{symbol}</strong>{' '}
        {/* <span style={{ fontWeight: '700' }}>{username}:</span> */}
         {message}
      </div>
    </div>
  );
})}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          style={{
            flexGrow: 1,
            padding: 12,
            borderRadius: 8,
            border: 'none',
            outline: 'none',
            fontSize: 16,
            backgroundColor: '#22272e',
            color: '#eee',
            
          }}
        />
        <button
          onClick={handleSend}
          style={{
            backgroundColor: '#ff4081',
            border: 'none',
            color: '#fff',
            borderRadius: 8,
            padding: '10px 16px',
            fontWeight: '700',
            cursor: 'pointer',
          
            transition: 'background-color 0.3s ease',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#ff1c68')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#ff4081')}
        >
          Send
        </button>
      </div>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

export default Chat;
