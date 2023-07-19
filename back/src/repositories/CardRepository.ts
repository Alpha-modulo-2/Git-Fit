import IResult from "../interfaces/IResult";
/* import IUpdateCardData from "../interfaces/IUpdateCardData"; */
import ICard from "../interfaces/ICard";
import ITask from "../interfaces/ITask";
import IMeal from "../interfaces/IMeal";
import { cardModel } from "../models/card";

const TAG = "Card Repository "

export default class CardRepository {
    async insert(userId: string): Promise<IResult> {
        console.log(TAG, "entrou");
        const existingCards = await cardModel.findOne({ userId });

        if (existingCards) {
            return {
                error: true,
                message: "Cards já existem para este usuário",
                statusCode: 400,
            }
        }

        try {
            const days = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];
            const cards: ICard[] = days.map((day) => ({
                userId,
                name: day,
                created_at: new Date(),
                updated_at: new Date(),
                trainingCard: {
                    checked: false,
                    title: `Treino de ${day}`,
                    tasks: [],
                },
                mealsCard: {
                    checked: false,
                    meals: [],
                },
            }));

            const result = await cardModel.insertMany(cards);

            return {
                error: false,
                statusCode: 201,
                card: result,
            }
        } catch (error: any) {
            return {
                error: true,
                message: error.message,
                statusCode: 500,
            }
        }
    }
    
    async get(): Promise<IResult> {
        try {
            console.log(TAG, "entrou");
            const cards = await cardModel.find().populate("userId");

            return {
                error: false,
                statusCode: 200,
                card: cards,
            }
        } catch (error: any) {
            return {
                error: true,
                message: error.message,
                statusCode: 500,
            }
        }
    }

    async getOne(cardId: string): Promise<IResult> {
        try {
            console.log(TAG, "entrou");
            const card = await cardModel.findById(cardId).populate("userId")

            if (card) {
                return {
                    error: false,
                    statusCode: 200,
                    card: card,
                }
            } else {
                return {
                    error: true,
                    statusCode: 500,
                    message: "Card not Found"
                }
            }
        } catch (error: any) {
            return {
                error: true,
                message: error.message,
                statusCode: 500,
            }
        }
    }

    async addTask(cardId: string, task: ITask): Promise<IResult> {
        try {
            console.log(TAG, "entrou");
            const card = await cardModel.findByIdAndUpdate(
                cardId,
                // O que será dado Update
                { $push: { "trainingCard.tasks": task } },
                // Opção para retorna o obejto após a atualização
                { new: true } 
            );
    
            if (!card) {
                return {
                    error: true,
                    message: "Card não encontrado",
                    statusCode: 404,
                };
            }
    
            return {
                error: false,
                statusCode: 200,
                card: card,
            };
        } catch (error: any) {
            return {
                error: true,
                message: error.message,
                statusCode: 500,
            };
        }
    }

    async addMeal(cardId: string, meal: IMeal): Promise<IResult> {
        try {
            console.log(TAG, "entrou");
            const card = await cardModel.findByIdAndUpdate(
                cardId,
                { $push: { "mealsCard.meals": meal } },
                { new: true }
            );

            if (!card) {
                return {
                    error: true,
                    message: "Card not found",
                    statusCode: 404
                }
            }

            return {
                error: false,
                statusCode: 200,
                card: card,
            }
        } catch (error: any) {
            return {
                error: true,
                message: error.message,
                statusCode: 500,
            }
        }
    }

    async updateTask(cardId: string, taskId: string, task: ITask): Promise<IResult> {
        try {
            console.log(TAG, "entrou");
            const card = await cardModel.findOneAndUpdate(
                { _id: cardId, "trainingCard.tasks._id": taskId },
                { $set: { "trainingCard.tasks.$": task } },
                { new: true }
            );

            if (!card) {
                console.log("aqui")
                return {
                    error: true,
                    message: "Card or Task not found",
                    statusCode: 404
                }
            }

            return {
                error: false,
                statusCode: 200,
                card: card,
            }
        } catch (error: any) {
            return {
                error: true,
                message: error.message,
                statusCode: 500,
            }
        }
    }

    async updateMeal(cardId: string, mealId: string, meal: IMeal): Promise<IResult> {
        try {
            console.log(TAG, "entrou");
            const card = await cardModel.findOneAndUpdate(
                { "_id": cardId, "mealsCard.meals._id": mealId },
                { $set: { "mealsCard.meals.$": meal } },
                { new: true } // Retorna o documento atualizado
            );
    
            if (!card) {
                return {
                    error: true,
                    message: "Card or Meal not found",
                    statusCode: 404
                }
            }
    
            return {
                error: false,
                statusCode: 200,
                card: card
            }
        } catch (error: any) {
            return {
                error: true,
                message: error.message,
                statusCode: 500
            }
        }
    }

/*     async delete(id: string): Promise<IResult> {

        try {

            const user = await userModel.findById(id)

            if (user) {

                user.deleteOne()

                return {
                    error: false,
                    statusCode: 204,
                }
            }

            return {
                error: true,
                statusCode: 404,
                message: "User not found"
            }

        } catch (error: any) {
            return {
                error: true,
                message: error.message,
                statusCode: 500,
            }
        }
    } */
}