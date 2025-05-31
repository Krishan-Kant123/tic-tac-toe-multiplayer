import React, { useEffect, useState } from 'react';
import socket from '../socket';
import Board from './Board';
import Chat from './Chat';

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  gap: 30,
  padding: 20,
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  background: 'linear-gradient(135deg, #060a0f, #16181c, #222426)',
// backgroundImage:'url("https://img.freepik.com/free-vector/black-background-with-focus-spot-light_1017-27230.jpg?t=st=1748689157~exp=1748692757~hmac=962e3812a625485051862a5fd523f15f3e4651ee9f7907b0f9595ffbf1532e7c&w=996")',
  minHeight: '100svh',
  color: '#eee',
  flexWrap: 'wrap',
};

const gameAreaStyle = {
  backgroundColor: '#121417',
  padding: 20,
  borderRadius: 12,
  boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset',
  width: 320,
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const statusStyle = {
  marginBottom: 15,
  fontSize: 20,
  fontWeight: '700',
  minHeight: 36,
  color: '#fff',
//   textShadow: '0 0 10px #00e0ff',
  letterSpacing: 1.2,
};

const buttonGroupStyle = {
  marginTop: 24,
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  gap: 12,
};

const buttonStyle = {
  padding: '10px 22px',
  borderRadius: 8,
  border: 'none',
  cursor: 'pointer',
  fontWeight: '700',
  fontSize: 15,
//   boxShadow: '0 0 10px #00e0ff',
  transition: 'all 0.3s ease',
  color: '#121417',
};

const restartBtnStyle = {
  ...buttonStyle,
  backgroundColor: '#1de9b6',
//   boxShadow: '0 0 15px #1de9b6',
};

const exitBtnStyle = {
  ...buttonStyle,
  backgroundColor: '#ff4081',
//   boxShadow: '0 0 15px #ff4081',
};


function Room({ username, roomId }) {
  const [board, setBoard] = useState(Array(9).fill(''));
  const [turn, setTurn] = useState('X');
  const [status, setStatus] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [players, setPlayers] = useState({});

  useEffect(() => {
    socket.emit('join_room', { roomId, username });

    socket.on('game_state', ({ board, turn, status, gameOver }) => {
      setBoard(board);
      setTurn(turn);
      setStatus(status);
      setGameOver(gameOver);
    });

    socket.on('players', (playersData) => {
      setPlayers(playersData);
    });

    socket.on('game_reset', () => {
      setBoard(Array(9).fill(''));
      setTurn('X');
      setStatus('');
      setGameOver(false);
    });

    return () => {
      socket.emit('leave_room', { roomId, username });
      socket.off('game_state');
      socket.off('players');
      socket.off('game_reset');
    };
  }, [roomId, username]);

  const handleCellClick = (index) => {
    if (board[index] || gameOver) return;
    socket.emit('make_move', { roomId, username, index });
  };

  const handleRestart = () => {
    socket.emit('restart_game', { roomId });
  };

  const handleExit = () => {
    socket.emit('leave_room', { roomId, username });
    window.location.reload();
  };

  const playerSymbol = players[username];


  const winnerUsername = (() => {
    if (!gameOver) return null;

    if (!status) return null;
    if (status.toLowerCase().includes('draw')) return 'Draw';


    if (status.includes('X')) {
  
      return Object.entries(players).find(([, symbol]) => symbol === 'X')?.[0];
    } else if (status.includes('O')) {
      return Object.entries(players).find(([, symbol]) => symbol === 'O')?.[0];
    }
    return null;
  })();

  return (
    <div style={containerStyle}>
      <div style={gameAreaStyle}>
        <h2 style={{ marginBottom: 15, color: '#1de9b6' }}>
          Room: {roomId}
        </h2>

        <div style={statusStyle}>
          {gameOver ? (
            winnerUsername === 'Draw' ? (
              'It\'s a Draw!'
            ) : winnerUsername ? (
              <>
                Winner: <span style={{ color: '#ff4081', textShadow: '0 0 12px #ff4081' }}>
                  {winnerUsername}
                </span>
              </>
            ) : (
              status
            )
          ) : playerSymbol ? (
            <>
              Your Symbol:{' '}
              <span
                style={{
                  fontWeight: '900',
                  fontSize: 24,
                  color: playerSymbol === 'X' ? '#00b0ff' : '#ff4081',
                //   textShadow: `0 0 10px ${
                //     playerSymbol === 'X' ? '#00b0ff' : '#ff4081'
                //   }, 0 0 20px ${
                //     playerSymbol === 'X' ? '#00b0ff' : '#ff4081'
                //   }`,
                }}
              >
                {playerSymbol}
              </span>{' '}
              | Turn:{' '}
              <span
                style={{
                  fontWeight: '900',
                  fontSize: 24,
                  color: turn === 'X' ? '#00b0ff' : '#ff4081',
                //   textShadow: `0 0 10px ${turn === 'X' ? '#00b0ff' : '#ff4081'}, 0 0 20px ${
                //     turn === 'X' ? '#00b0ff' : '#ff4081'
                //   }`,
                }}
              >
                {turn}
              </span>
            </>
          ) : (
            'Waiting for players...'
          )}
        </div>

        <Board board={board} onCellClick={handleCellClick} playerSymbol={playerSymbol} winningLine={gameOver ? findWinningLine(board) : []} />

        <div style={buttonGroupStyle}>
          <button
            onClick={handleRestart}
            disabled={!gameOver}
            style={{
              ...restartBtnStyle,
              opacity: gameOver ? 1 : 0.5,
              cursor: gameOver ? 'pointer' : 'default',
            }}
            title={gameOver ? 'Restart Game' : 'Restart available after game ends'}
          >
            Restart Game
          </button>
          <button onClick={handleExit} style={exitBtnStyle} title="Exit Room">
            Exit Room
          </button>
        </div>
      </div>

      {playerSymbol !== '?' && (
        <Chat roomId={roomId} username={username} playerSymbol={playerSymbol} />
      )}
    </div>
  );
}


function findWinningLine(board) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6],         // diagonals
  ];
  for (const [a,b,c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return [a,b,c];
    }
  }
  return [];
}

export default Room;
