import IResult from "../interfaces/IResult";
import { Types } from 'mongoose';
import ICard from "../interfaces/ICard";
import ITask from "../interfaces/ITask";
import IMeal from "../interfaces/IMeal";
import { cardModel } from "../models/card";

const TAG = "Card Repository "

export default class CardRepository {
    async insert(userId: string): Promise<IResult> {

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
    
    async getAllCardsByUser(userId: string): Promise<IResult> {
        try {
            const cards = await cardModel.find({userId: userId}).populate("userId");

            if (!cards || cards.length === 0) {
                return {
                    error: true,
                    statusCode: 404,
                    message: "Cards não encontrados"
                };
            }

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
                    statusCode: 404,
                    message: "Card não encontrado"
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

    async updateTrainingCardChecked(cardId: string, checked: boolean): Promise<IResult> {
        try {
            const card = await cardModel.findById(cardId);
    
            if (!card) {
                return {
                    error: true,
                    message: "Card não encontrado",
                    statusCode: 404,
                };
            }
    
            card.trainingCard.checked = checked;
            const updatedCard = await card.save();
    
            return {
                error: false,
                statusCode: 200,
                card: updatedCard,
            };
        } catch (error: any) {
            return {
                error: true,
                message: error.message,
                statusCode: 500,
            };
        }
    }

    async updateMealsCardChecked(cardId: string, checked: boolean): Promise<IResult> {
        try {
            const card = await cardModel.findById(cardId);
    
            if (!card) {
                return {
                    error: true,
                    message: "Card não encontrado",
                    statusCode: 404,
                };
            }
    
            card.mealsCard.checked = checked;
            const updatedCard = await card.save();
    
            return {
                error: false,
                statusCode: 200,
                card: updatedCard,
            };
        } catch (error: any) {
            return {
                error: true,
                message: error.message,
                statusCode: 500,
            };
        }
    }

    async addTask(cardId: string, task: ITask): Promise<IResult> {
        try {
            if (!task._id) {
                task._id = new Types.ObjectId();
            }
            const card = await cardModel.findByIdAndUpdate(
                cardId,
                { $push: { "trainingCard.tasks": task } },
                { new: true } 
            );
    
            if (!card) {
                return {
                    error: true,
                    statusCode: 404,
                    message: "Card não encontrado"
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
            if (!meal._id) {
                meal._id = new Types.ObjectId();
            }
            const card = await cardModel.findByIdAndUpdate(
                cardId,
                { $push: { "mealsCard.meals": meal } },
                { new: true }
            );

            if (!card) {
                return {
                    error: true,
                    message: "Card não encontrado",
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
            const card = await cardModel.findOneAndUpdate(
                { _id: cardId, "trainingCard.tasks._id": taskId },
                { $set: { "trainingCard.tasks.$": task } },
                { new: true }
            );

            if (!card) {
                return {
                    error: true,
                    message: "Card ou Task não encontrado",
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
            const card = await cardModel.findOneAndUpdate(
                { "_id": cardId, "mealsCard.meals._id": mealId },
                { $set: { "mealsCard.meals.$": meal } },
                { new: true } 
            );
    
            if (!card) {
                return {
                    error: true,
                    message: "Card ou Meal não encontrado",
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

    async delTask(cardId: string, taskId: string): Promise<IResult> {
        try {
            const card = await cardModel.findOneAndUpdate(
                { _id: cardId },
                { $pull: { 'trainingCard.tasks': { _id: taskId } } },
                { new: true }
            );

            if (!card) {
                return {
                    error: true,
                    message: "Card ou Task não encontrado",
                    statusCode: 404,
                };
            }

            return {
                error: false,
                statusCode: 200,
                card,
            };
        } catch (error: any) {
            return {
                error: true,
                message: error.message,
                statusCode: 500,
            };
        }
    }

    async delMeal(cardId: string, mealId: string): Promise<IResult> {
        try {
            const card = await cardModel.findOneAndUpdate(
                { _id: cardId },
                { $pull: { 'mealsCard.meals': { _id: mealId } } },
                { new: true }
            );

            if (!card) {
                return {
                    error: true,
                    message: "Card ou Meal não encontrado",
                    statusCode: 404,
                };
            }

            return {
                error: false,
                statusCode: 200,
                card,
            };
        } catch (error: any) {
            return {
                error: true,
                message: error.message,
                statusCode: 500,
            };
        }
    }
}