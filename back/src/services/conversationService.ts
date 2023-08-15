import IConversation from "../interfaces/IConversation";
import IResult from "../interfaces/IResult";
import ConversationRepository from "../repositories/conversationRepository";

export default class ConversationService {
    private repository: ConversationRepository;

    constructor(repository: ConversationRepository = new ConversationRepository()) {
        this.repository = repository;
    }

    async create(data: IConversation): Promise<IResult> {

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

    async get(userId: string): Promise<IResult> {
        try {
            const result = await this.repository.get(userId);

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
