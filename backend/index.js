const { Server } = require('socket.io');
const { createServer } = require('http');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: 'https://basic-video-calling-mern-webrtc-frontend.vercel.app',
    methods: ['GET', 'POST'],
    credentials: true
}));

const server = createServer(app);
app.get('/',(req,res)=>{res.send("hey")})
const io = new Server(server, {
    cors: {
        origin: 'https://basic-video-calling-mern-webrtc-frontend.vercel.app',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join:room', (room) => {
        socket.join(room);
        console.log(`${socket.id} joined ${room}`);
        socket.to(room).emit('user:connection', socket.id);
    });

    socket.on('call-user', (data) => {
        socket.to(data.room).emit('incoming-call', data);
    });

    socket.on('answer', (data) => {
        socket.to(data.room).emit('answered', data);
    });

    socket.on('ice-candidate', (data) => {
        socket.to(data.room).emit('ice-candidate', data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

server.listen(3000, () => {
    console.log("Listening at port 3000");
});
