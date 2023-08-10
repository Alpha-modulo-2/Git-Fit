require('dotenv').config()
import { App } from "./app";
import { connectToDatabase } from "./database/database";
import fs from 'fs';
import https from 'https'
import path from 'path';
import { Server } from 'socket.io';

const port = process.env.PORT || 8000;

// Verificar se as variáveis de ambiente estão definidas
if (!process.env.SSL_KEY_PATH || !process.env.SSL_CERT_PATH) {
    throw new Error('As variáveis de ambiente SSL_KEY_PATH e SSL_CERT_PATH devem ser definidas.');
}

try {
    connectToDatabase()
} catch (error) {
    console.log(error);
}

const app = new App().server;

const options = {
    key: fs.readFileSync(path.resolve(process.env.SSL_KEY_PATH)),
    cert: fs.readFileSync(path.resolve(process.env.SSL_CERT_PATH)),
};
const server = https.createServer(options, app);

const io = new Server(server, { cors: { origin: "*" } });

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('joinRoom', (chatId) => {
        socket.join(chatId);
    });

    socket.on('sendMessage', (data) => {
        io.to(data.chatId).emit('receiveMessage', data);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server on the desired port
server.listen(443, () => {
    console.log(`Server is running on port 443`);
});