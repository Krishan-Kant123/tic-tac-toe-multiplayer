import React, { useState } from 'react';
import Room from './components/Room';

function generateRoomId(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function App() {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [generatedRoomId, setGeneratedRoomId] = useState('');
  const [joined, setJoined] = useState(false);

  const handleJoin = () => {
    if (username.trim() && roomId.trim()) {
      setJoined(true);
    } else {
      alert('Please enter both username and room ID');
    }
  };

  const handleCreateRoom = () => {
    const newRoomId = generateRoomId();
    setRoomId(newRoomId);
    setGeneratedRoomId(newRoomId);  // save generated id separately
    alert(`Room created! Share this Room ID with friends: ${newRoomId}`);
  };

  if (!joined) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#121417',
          color: '#ff4081',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 400,
            backgroundColor: '#1a1e25',
            padding: 30,
            borderRadius: 16,
            boxShadow: '0 0 15px #ff4081',
            textAlign: 'center',
          }}
        >
          <h2 style={{ marginBottom: 24, fontWeight: '700' }}>
            Join or Create Tic Tac Toe Room
          </h2>
          <input
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{
              width: '100%',
              padding: 12,
              marginBottom: 16,
              borderRadius: 8,
              border: 'none',
              fontSize: 16,
              backgroundColor: '#22272e',
              color: '#eee',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <input
            placeholder="Room ID"
            value={roomId}
            onChange={e => setRoomId(e.target.value.toUpperCase())}
            style={{
              width: '100%',
              padding: 12,
              marginBottom: 8,
              borderRadius: 8,
              border: 'none',
              fontSize: 16,
              backgroundColor: '#22272e',
              color: '#eee',
              outline: 'none',
              boxSizing: 'border-box',
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          />

          
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 24,
              gap: 12,
            }}
          >
            <span
              style={{
                color: '#ddd',
                backgroundColor: '#22272e',
                padding: '8px 12px',
                borderRadius: 8,
                userSelect: 'all',
                fontWeight: '700',
                letterSpacing: 2,
                fontSize: 16,
                minWidth: 120,
                textAlign: 'center',
              }}
            >
              {generatedRoomId || '------'}
            </span>
            <button
              onClick={() => {
                if (generatedRoomId) {
                  navigator.clipboard.writeText(generatedRoomId);
                  alert('Generated Room ID copied to clipboard!');
                }
              }}
              style={{
                cursor: generatedRoomId ? 'pointer' : 'not-allowed',
                backgroundColor: '#ff4081',
                border: 'none',
                padding: '8px 20px',
                borderRadius: 8,
                color: 'white',
                fontWeight: '700',
                fontSize: 14,
                boxShadow: 'none',
                transition: 'background-color 0.3s ease',
              }}
              onMouseOver={e => (e.currentTarget.style.backgroundColor = '#ff1c68')}
              onMouseOut={e => (e.currentTarget.style.backgroundColor = '#ff4081')}
              disabled={!generatedRoomId}
            >
              Copy
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              gap: 12,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <button
              onClick={handleJoin}
              style={{
                flex: '1 1 45%',
                padding: '12px 0',
                borderRadius: 8,
                border: 'none',
                backgroundImage:
                  'linear-gradient(to right, #e52d27 0%, #b31217 51%, #e52d27 100%)',
                color: 'white',
                fontWeight: '700',
                fontSize: 16,
                cursor: 'pointer',
                transition: 'background-position 0.5s',
                backgroundSize: '200% auto',
                boxShadow: 'none',
              }}
              onMouseOver={e =>
                (e.currentTarget.style.backgroundPosition = 'right center')
              }
              onMouseOut={e =>
                (e.currentTarget.style.backgroundPosition = 'left center')
              }
            >
              Join Room
            </button>
            <button
              onClick={handleCreateRoom}
              style={{
                flex: '1 1 45%',
                padding: '12px 0',
                borderRadius: 8,
                border: 'none',
                backgroundColor: '#ff4081',
                color: 'white',
                fontWeight: '700',
                fontSize: 16,
                cursor: 'pointer',
                boxShadow: 'none',
                transition: 'background-color 0.3s ease',
              }}
              onMouseOver={e => (e.currentTarget.style.backgroundColor = '#ff1c68')}
              onMouseOut={e => (e.currentTarget.style.backgroundColor = '#ff4081')}
            >
              Create Room
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <Room username={username} roomId={roomId} />;
}

export default App;
