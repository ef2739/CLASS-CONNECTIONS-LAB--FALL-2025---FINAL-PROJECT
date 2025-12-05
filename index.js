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

// POST route per controllare la password
app.post('/check-password', (req, res) => {
    let { password } = req.body;
    if (password === process.env.PASSWORD) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// Initialize HTTP server
let server = createServer(app);

// Initialize socket.io (ESM corrected)
let io = new Server(server);

//Listen for individual clients/users to connect
io.on('connection', (socket) => {
    console.log("We have a new client:", socket.id);

    socket.on('msg', (data) => {
        console.log("Received 'msg' event:", data);

        // send to everyone
        io.emit('msg', data);

    
    });

    socket.on('disconnect', () => {
        console.log("Client disconnected:", socket.id);
    });
});

// Port
let port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server listening at port: ${port}`);
});
