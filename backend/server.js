const express = require('express');
const http = require('http');
const cors = require('cors');
const { setupSocket } = require('./socket/socketHandler');
const dotenv=require('dotenv').config();




const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Tic Tac Toe backend running');
});


setupSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
