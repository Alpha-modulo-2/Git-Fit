import IMessage from "../interfaces/IMessage";
import IResult from "../interfaces/IResult";
import { messageModel } from "../models/message";

export default class MessageRepository {
    async create(data: IMessage): Promise<IResult> {
        try {

            const result = await messageModel.create(data)

            if (!result) {
                const error = {
                    message: "Mensagem não Criada.",
                    code: 404
                }
                throw error
            }

            return {
                error: false,
                statusCode: 201,
                chatMessage: result
            }

        } catch (error: any) {
            return {
                error: true,
                message: error.message,
                statusCode: error.code || 500,
            }
        }
    }

    async get(conversationId: string): Promise<IResult> {
        try {

            const results = await messageModel.find({ conversationId: conversationId })

            if (!results) {
                throw new Error("Erro no servidor")
            }

            return {
                error: false,
                statusCode: 200,
                chatMessage: results
            }

        } catch (error: any) {
            return {
                error: true,
                message: error.message,
                statusCode: 500,
            }
        }
    }

}