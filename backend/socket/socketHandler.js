const { Server } = require("socket.io");

let io;
const rooms = {};

function setupSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("chat_message", ({ roomId, username, message }, callback) => {
        console.log(`Chat message from ${username} in room ${roomId}: ${message}`);
        socket.to(roomId).emit("chat_message", { username, message, timestamp: Date.now() });
        if (callback) callback();
        socket.emit("chat_message", { username, message, timestamp:Date.now() }); 
      });
      
      
  

  

    socket.on("join_room", ({ roomId, username }) => {
      socket.join(roomId);
      console.log(`${username} joined room ${roomId}`);

      if (!rooms[roomId]) {
        rooms[roomId] = {
          board: Array(9).fill(""),
          turn: "X",
          players: {},
          gameOver: false,
          winner: null,
        };
      }

      const room = rooms[roomId];

     
      const assignedSymbols = Object.values(room.players);
      if (!room.players[username]) {
        if (assignedSymbols.length >= 2) {
          room.players[username] = "?"; // Spectator
        } else if (!assignedSymbols.includes("X")) {
          room.players[username] = "X";
        } else {
          room.players[username] = "O";
        }
      }

      console.log(`Room ${roomId} players:`, room.players);

 
      io.to(roomId).emit("players", room.players);
      io.to(roomId).emit("game_state", {
        board: room.board,
        turn: room.turn,
        status: getStatusMessage(room),
        gameOver: room.gameOver,
      });
    });

    socket.on("make_move", ({ roomId, index, username }) => {
      const room = rooms[roomId];
      if (!room || room.gameOver || room.board[index] !== "") return;

      const playerSymbol = room.players[username];
      if (room.turn !== playerSymbol) return;

      room.board[index] = playerSymbol;
      if (checkWinner(room.board)) {
        room.gameOver = true;
        room.winner = playerSymbol;
      } else if (room.board.every((cell) => cell !== "")) {
        room.gameOver = true;
        room.winner = null; // Draw
      } else {
        room.turn = room.turn === "X" ? "O" : "X";
      }

      io.to(roomId).emit("game_state", {
        board: room.board,
        turn: room.turn,
        status: getStatusMessage(room),
        gameOver: room.gameOver,
      });
    });

    socket.on("restart_game", ({ roomId }) => {
        if (rooms[roomId]) {
          rooms[roomId].board = Array(9).fill("");
          rooms[roomId].turn = "X";
          rooms[roomId].gameOver = false;
          rooms[roomId].winner = null;
      
          io.to(roomId).emit("game_state", {
            board: rooms[roomId].board,
            turn: rooms[roomId].turn,
            status: getStatusMessage(rooms[roomId]),
            gameOver: rooms[roomId].gameOver,
          });
      
          
          io.to(roomId).emit("game_reset");
        }
      });

    socket.on("leave_room", ({ roomId, username }) => {
      socket.leave(roomId);
      if (rooms[roomId]) {
        delete rooms[roomId].players[username];
        if (Object.keys(rooms[roomId].players).length === 0) {
          delete rooms[roomId]; 
        }
      }
      console.log(`${username} left room ${roomId}`);
    });

    socket.on("send_message", ({ roomId, username, message }) => {
      io.to(roomId).emit("receive_message", { username, message });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
}

function checkWinner(board) {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const combo of winningCombinations) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return true;
    }
  }

  return false;
}

function getStatusMessage(room) {
  if (room.gameOver) {
    return room.winner
      ? `Player ${room.winner} wins!`
      : "It's a draw!";
  }
  return `Player ${room.turn}'s turn`;
}

module.exports = { setupSocket };
