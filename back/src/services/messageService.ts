import IMessage from "../interfaces/IMessage";
import IResult from "../interfaces/IResult";
import MessageRepository from "../repositories/messageRepository";

export default class MessageService {
    private repository: MessageRepository;

    constructor(repository: MessageRepository = new MessageRepository()) {
        this.repository = repository;
    }

    async create(data: IMessage): Promise<IResult> {

        try {
            const result = await this.repository.create(data);

            if (result.error) {
                const error = {
                    message: result.message,
                    code: result.statusCode
                }
                throw error
            }

            return result
        } catch (error: any) {
            return {
                error: true,
                message: error.message,
                statusCode: error.code || 500
            };
        }

    }

    async get(chatId: string): Promise<IResult> {
        try {
            const result = await this.repository.get(chatId);

            if (result.error) {
                const error = {
                    message: result.message,
                    code: result.statusCode
                }
                throw error
            }

            return result
        } catch (error: any) {
            return {
                error: true,
                message: error.message,
                statusCode: error.code || 500
            };
        }
    }

}
