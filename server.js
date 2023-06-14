const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let scrollingSpeed = 1; // Default scrolling speed

io.on('connection', (socket) => {
  socket.on('startScroll', () => {
    startScrolling(socket);
  });

  socket.on('stopScroll', () => {
    stopScrolling(socket);
  });

  socket.on('updateSpeed', (speed) => {
    scrollingSpeed = speed;
  });

  socket.on('updateText', (text) => {
    io.emit('textUpdate', text);
  });
});

let intervalId;

function startScrolling(socket) {
  clearInterval(intervalId);
  intervalId = setInterval(() => {
    socket.emit('scroll');
  }, 1000 / scrollingSpeed);
}

function stopScrolling() {
  clearInterval(intervalId);
}

const port = 3000; // Change this to your desired port number

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
