const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

app.use(cors()); // Remove the previous app.use(cors(...)) middleware
app.get("/", (req, res) => res.send("Express on Vercel"));
// Socket.IO events handling remains the same
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join:room', (room) => {
        socket.join(room);
        console.log(`${socket.id} joined ${room}`);
        socket.to(room).emit('user:connection', socket.id);
    });

    socket.on('call-user', (data) => {
        console.log(`Received call-user from ${socket.id} in room ${data.room}`);
        socket.to(data.room).emit('incoming-call', data);
    });

    socket.on('answer', (data) => {
        console.log(`Received answer from ${socket.id} in room ${data.room}`);
        socket.to(data.room).emit('answered', data);
    });

    socket.on('ice-candidate', (data) => {
        console.log(`Received ICE candidate from ${socket.id} in room ${data.room}`);
        socket.to(data.room).emit('ice-candidate', data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

server.listen(process.env.PORT || 3000, () => {
    console.log("Listening at port 3000");
});
