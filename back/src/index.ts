require('dotenv').config()
import { App } from "./app";
import { connectToDatabase } from "./database/database";
import fs from 'fs';
import https from 'https'
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';
import SocketController from './controllers/socketController';

if (!process.env.SSL_KEY_PATH || !process.env.SSL_CERT_PATH) {
    throw new Error('As variáveis de ambiente SSL_KEY_PATH e SSL_CERT_PATH devem ser definidas.');
}

try {
    connectToDatabase()
} catch (error) {
    console.log(error);
}

const app = new App().server;

if (process.env.RENDER_PORT) {
    const server = http.createServer(app);
    const io = new Server(server, { cors: { origin: "*" } });

    new SocketController(io);

    server.listen(process.env.RENDER_PORT, () => {
        console.log(`Server is running on port ${process.env.RENDER_PORT}`);
    });
} else {
    const options = {
        key: fs.readFileSync(path.resolve(process.env.SSL_KEY_PATH)),
        cert: fs.readFileSync(path.resolve(process.env.SSL_CERT_PATH)),
    };
    const server = https.createServer(options, app)

    const io = new Server(server, { cors: { origin: "*" } });

    new SocketController(io);

    server.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
}

