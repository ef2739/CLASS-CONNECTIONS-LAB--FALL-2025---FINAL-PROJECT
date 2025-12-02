import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

// __dirname in ES Modules
let __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);

let app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// POST route to check and verify password
app.post('/check-password', (req, res) => {
    let { password } = req.body;
    if(password === process.env.PASSWORD){
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// Initialize HTTP server
let server = createServer(app);

// Initialize Socket.io
let io = new Server(server);

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Access port 
let port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log('Server listening at port:', port);
});
