import { io } from "socket.io-client";

// const SOCKET_SERVER_URL = process.env.REACT_APP_SOCKET_SERVER_URL || "http://localhost:5000";
const SOCKET_SERVER_URL ="https://tic-tac-toe-multiplayer-backend-lv94.onrender.com"

const socket = io(SOCKET_SERVER_URL, {
//   autoConnect: false,
});

export default socket;
