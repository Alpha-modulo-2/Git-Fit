import IResult from "../interfaces/IResult";
import CardRepository from "../repositories/CardRepository";
import ICard from "../interfaces/ICard";
import ITask from "../interfaces/ITask";
import IMeal from "../interfaces/IMeal";
import CustomError from "../helpers/CustomError";
export default class CardService {
    private repository: CardRepository;

    constructor(repository: CardRepository = new CardRepository()) {
        this.repository = repository;
    }

    async insert(userId: string): Promise<IResult> {
        try {
            const hasCards = await this.repository.hasCards(userId);
            if (hasCards) {
                throw new CustomError("Cards já existem para este usuário", 400);
            }
    
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
    
            return await this.repository.insert(cards);
        } catch (error: any) {
            if (error instanceof CustomError) {
                return {
                    error: true,
                    statusCode: error.statusCode,
                    message: error.message,
                };
            }
            return {
                error: true,
                statusCode: 500,
                message: "Erro interno do servidor.",
            };
        }
    }

    async getAllCardsByUser(userId: string): Promise<IResult> {
        try {
            const result = await this.repository.getAllCardsByUser(userId);
            return result;
        } catch (error) {
            return {
                error: true,
                statusCode: 500,
                message: "Erro interno do servidor."
            };
        }
    }

    async getOne(cardId: string): Promise<IResult> {
        try {
            const result = await this.repository.getOne(cardId);
            return result
        } catch (error) {
            return {
                error: true,
                statusCode: 500,
                message: "Erro interno do servidor."
            };
        }
    }

    async updateTrainingCardChecked(cardId: string, checked: boolean): Promise<IResult> {
        try {
            const result = await this.repository.updateTrainingCardChecked(cardId, checked);
            return result;
        } catch (error) {
            return {
                error: true,
                statusCode: 500,
                message: "Erro interno do servidor."
            };
        }
    }

    async updateMealsCardChecked(cardId: string, checked: boolean): Promise<IResult> {
        try {
            const result = await this.repository.updateMealsCardChecked(cardId, checked);
            return result;
        } catch (error) {
            return {
                error: true,
                statusCode: 500,
                message: "Erro interno do servidor."
            };
        }
    }

    async addTask(cardId: string, task: ITask): Promise<IResult> {
        try {
            const result = await this.repository.addTask(cardId, task);
            return result
        } catch (error) {
            return {
                error: true,
                statusCode: 500,
                message: "Erro interno do servidor."
            };
        }
    }

    async addMeal(cardId: string, meal: IMeal): Promise<IResult> {
        try {
            const result = await this.repository.addMeal(cardId, meal);
            return result;
        } catch (error) {
            return {
                error: true,
                statusCode: 500,
                message: "Erro interno do servidor."
            };
        }
    }

    async updateTitle(cardId: string, title: string): Promise<IResult> {
        try {
            const result =  await this.repository.updateTitle(cardId, title);
            return result;
        } catch (error) {
            return {
                error: true,
                statusCode: 500,
                message: "Erro interno do servidor."
            };
        }
    }

    async updateTask(taskId: string, description: string): Promise<IResult> {
        try {
            const result = await this.repository.updateTask(taskId, description);
            return result;
        } catch (error) {
            return {
                error: true,
                statusCode: 500,
                message: "Erro interno do servidor."
            };
        }
    }

    async updateMeal(mealId: string, description: string): Promise<IResult> {
        try {
            const result = await this.repository.updateMeal(mealId, description);
            return result
        } catch (error) {
            return {
                error: true,
                statusCode: 500,
                message: "Erro interno do servidor."
            };
        }
    }

    async delTask(taskId: string): Promise<IResult> {
        try {
            const result = await this.repository.delTask(taskId);
            return result;
        } catch (error) {
            return {
                error: true,
                statusCode: 500,
                message: "Erro interno do servidor."
            };
        }
    }

    async delMeal(mealId: string): Promise<IResult> {
        try {
            const result = await this.repository.delMeal(mealId);
            return result;
        } catch (error) {
            return {
                error: true,
                statusCode: 500,
                message: "Erro interno do servidor."
            };
        }
    }
}