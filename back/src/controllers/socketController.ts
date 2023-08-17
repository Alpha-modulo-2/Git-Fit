import { Server, Socket } from 'socket.io';
import MessageService from '../services/messageService';
import retryOperation from '../helpers/retry';

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
            try {
                await retryOperation(async () => {
                    const chatHistory = await this.service.get(chatId);
                    socket.join(chatId);
                    socket.emit('chatHistory', chatHistory);
                });
            } catch (error) {
                console.error('Error occurred after max retries:', error);
                socket.emit('error', { message: 'An error occurred. Please try again later.' });
            }
        });

        socket.on('sendMessage', async (data) => {
            try {
                await retryOperation(async () => {
                    const savedMessage = await this.service.create(data);
                    this.io.to(data.chatId).emit('receiveMessage', savedMessage);
                });
            } catch (error) {
                console.error('Error occurred after max retries:', error);
                socket.emit('error', { message: 'An error occurred. Please try again later.' });
            }
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    }
}