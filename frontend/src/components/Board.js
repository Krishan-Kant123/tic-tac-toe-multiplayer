import React from 'react';

const boardStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 80px)',
  gridTemplateRows: 'repeat(3, 80px)',
  gap: 10,
  marginTop: 20,
  userSelect: 'none',
};

const cellBaseStyle = {
  backgroundColor: '#22272e',
  borderRadius: 16,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: 48,
  fontWeight: 'bold',
  color: '#555',
  cursor: 'pointer',
  boxShadow: '0 0 5px #000 inset',
  transition: 'all 0.3s ease',
};

const glowingColors = {
  X: '#00b0ff',  // bright blue
  O: '#ff4081',  // bright pink
};

function Board({ board, onCellClick, playerSymbol, winningLine = [] }) {
  return (
    <div style={boardStyle}>
      {board.map((cell, idx) => {
        const isWinningCell = winningLine.includes(idx);
        const glowColor = glowingColors[cell] || 'transparent';

        return (
          <div
            key={idx}
            onClick={() => onCellClick(idx)}
            style={{
              ...cellBaseStyle,
              color: cell ? glowColor : '#555',
              cursor: cell ? 'default' : 'pointer',
              boxShadow: isWinningCell
                ? `0 0 10px ${glowColor}, 0 0 10px ${glowColor}`
                : '0 0 5px #000 inset',
              transform: isWinningCell ? 'scale(1.1)' : 'scale(1)',
            }}
          >
            {cell}
          </div>
        );
      })}
    </div>
  );
}

export default Board;
