import { Server, Socket } from 'socket.io';
import MessageService from '../services/messageService';

export default class SocketController {
    private io: Server;
    private service: MessageService;

    constructor(io: Server, service?: MessageService) {
        this.service = service || new MessageService();
        this.io = io;
        this.io.on('connection', this.handleConnection.bind(this));
    }

    private handleConnection(socket: Socket) {

        console.log('A user connected');

        socket.on('joinRoom', async (chatId) => {
            socket.join(chatId);

            const chatHistory = await this.service.get(chatId);

            socket.emit('chatHistory', chatHistory);
        });

        socket.on('sendMessage', async (data) => {
            const savedMessage = await this.service.create(data);
            this.io.to(data.chatId).emit('receiveMessage', savedMessage);
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    }
}