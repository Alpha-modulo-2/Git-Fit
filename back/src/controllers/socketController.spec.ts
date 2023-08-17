import { Server, Socket } from 'socket.io';
import MessageService from '../services/messageService';
import SocketController from './socketController';
import retryOperation from '../helpers/retry';

interface MockMessageService extends MessageService {
    create: jest.Mock;
    get: jest.Mock;
}

describe('SocketController', () => {
    let io: Server;
    let socket: Socket;
    let messageService: MockMessageService;

    const mockChatId = 'mockChatId';
    const mockMessage = {
        chatId: mockChatId,
        sender: 'mockSenderId',
        text: 'Hello World'
    };

    const mockChatHistory = [mockMessage];

    beforeEach(() => {
        socket = {
            on: jest.fn(),
            join: jest.fn(),
            emit: jest.fn(),
            to: jest.fn(() => socket)
        } as any;

        io = {
            on: jest.fn(),
            to: jest.fn(() => socket)
        } as any;

        messageService = {
            create: jest.fn(),
            get: jest.fn()
        } as MockMessageService;

        new SocketController(io, messageService);
    });

    it('should handle a user connection', () => {
        (io.on as jest.Mock).mock.calls[0][1](socket);

        expect(socket.on).toHaveBeenCalledTimes(3);
    });

    it('should handle joinRoom and emit chatHistory', async () => {
        messageService.get.mockResolvedValue(mockChatHistory);

        (io.on as jest.Mock).mock.calls[0][1](socket);

        await (socket.on as jest.Mock).mock.calls[0][1](mockChatId);

        expect(socket.join).toHaveBeenCalledWith(mockChatId);
        expect(socket.emit).toHaveBeenCalledWith('chatHistory', mockChatHistory);
    });

    it('should handle sendMessage and broadcast the message', async () => {
        messageService.create.mockResolvedValue(mockMessage);

        (io.on as jest.Mock).mock.calls[0][1](socket);

        await (socket.on as jest.Mock).mock.calls[1][1](mockMessage);

        expect(io.to).toHaveBeenCalledWith(mockChatId);
        expect(socket.emit).toHaveBeenCalledWith('receiveMessage', mockMessage);
    });

    it('should handle joinRoom error gracefully', async () => {
        const mockError = new Error('Fetching chat history failed');
        messageService.get.mockRejectedValue(mockError);

        (io.on as jest.Mock).mock.calls[0][1](socket);

        await (socket.on as jest.Mock).mock.calls[0][1](mockChatId);

        expect(socket.join).not.toHaveBeenCalled();
        expect(socket.emit).toHaveBeenCalledWith('error', {
            message: 'An error occurred. Please try again later.'
        });
    });

    it('should handle sendMessage error gracefully', async () => {
        const mockError = new Error('Message creation failed');
        messageService.create.mockRejectedValue(mockError);

        (io.on as jest.Mock).mock.calls[0][1](socket);

        await (socket.on as jest.Mock).mock.calls[1][1](mockMessage);

        expect(socket.emit).toHaveBeenCalledWith('error', {
            message: 'An error occurred. Please try again later.'
        });
    });

    it('should log when a user disconnects', () => {
        const logSpy = jest.spyOn(console, 'log').mockImplementation();

        (io.on as jest.Mock).mock.calls[0][1](socket);

        (socket.on as jest.Mock).mock.calls.forEach((call: any) => {
            if (call[0] === 'disconnect') {
                call[1]();
            }
        });

        expect(logSpy).toHaveBeenCalledWith('A user disconnected');
    });

    it('should handle retry logic for joinRoom', async () => {
        const mockError = new Error('Temporary fetch failure');
        messageService.get
            .mockRejectedValueOnce(mockError) // Fail the first attempt
            .mockResolvedValue(mockChatHistory); // Succeed the second

        (io.on as jest.Mock).mock.calls[0][1](socket);

        await (socket.on as jest.Mock).mock.calls[0][1](mockChatId);

        expect(socket.join).toHaveBeenCalledWith(mockChatId);
        expect(socket.emit).toHaveBeenCalledWith('chatHistory', mockChatHistory);
    });
});