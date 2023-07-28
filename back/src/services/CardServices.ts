import IResult from "../interfaces/IResult";
import CardRepository from "../repositories/CardRepository";
import ITask from "../interfaces/ITask";
import IMeal from "../interfaces/IMeal";

const TAG = "Card Service "

export default class CardService {
    private repository: CardRepository;

    constructor() {
        this.repository = new CardRepository();
    }

    async insert(userId: string): Promise<IResult> {

        try {
            const result = await this.repository.insert(userId);

            if (result.error) {
                throw new Error(result.message)
            }

            return result
        } catch (error: any) {
            return error.message;
        }
    }

    async get(): Promise<IResult> {
        try {
            const result = await this.repository.get();

            if (result.error) {
                throw new Error(result.message)
            }

            return result
        } catch (error: any) {
            return error.message;
        }
    }

    async getOne(cardId: string): Promise<IResult> {
        try {
            const result = await this.repository.getOne(cardId);

            if (result.error) {
                throw new Error(result.message)
            }

            return result
        } catch (error: any) {
            return error.message;
        }
    }

    async updateTrainingCardChecked(cardId: string, checked: boolean): Promise<IResult> {
        try {
            const result = await this.repository.updateTrainingCardChecked(cardId, checked);
    
            if (result.error) {
                throw new Error(result.message);
            }
    
            return result;
        } catch (error: any) {
            return {
                error: true,
                statusCode: 500,
                message: error.message
            };
        }
    }

    async updateMealsCardChecked(cardId: string, checked: boolean): Promise<IResult> {
        try {
            const result = await this.repository.updateMealsCardChecked(cardId, checked);
    
            if (result.error) {
                throw new Error(result.message);
            }
    
            return result;
        } catch (error: any) {
            return {
                error: true,
                statusCode: 500,
                message: error.message
            };
        }
    }

    async addTask(cardId: string, task: ITask): Promise<IResult> {
        try {
            const result = await this.repository.addTask(cardId, task);

            if (result.error) {
                throw new Error(result.message)
            }

            return result
        } catch (error: any) {
            return error.message;
        }
    }

    async addMeal(cardId: string, meal: IMeal): Promise<IResult> {
        try {
            const result = await this.repository.addMeal(cardId, meal);

            if (result.error) {
                throw new Error(result.message);
            }

            return result;
        } catch (error: any) {
            return {
                error: true,
                statusCode: 500,
                message: error.message
            }
        }
    }

    async updateTask(cardId: string, taskId: string, task: ITask): Promise<IResult> {
        try {
            const result = await this.repository.updateTask(cardId, taskId, task);

            if (result.error) {
                throw new Error(result.message);
            }

            return result;
        } catch (error: any) {
            return {
                error: true,
                statusCode: 500,
                message: error.message
            }
        }
    }

    async updateMeal(cardId: string, mealId: string, meal: IMeal): Promise<IResult> {
        try {
            const result = await this.repository.updateMeal(cardId, mealId, meal);

            if (result.error) {
                throw new Error(result.message)
            }
    
            return result
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
            const result = await this.repository.delTask(cardId, taskId);

            if (result.error) {
                throw new Error(result.message);
            }

            return result;
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
            const result = await this.repository.delMeal(cardId, mealId);

            if (result.error) {
                throw new Error(result.message);
            }

            return result;
        } catch (error: any) {
            return {
                error: true,
                message: error.message,
                statusCode: 500,
            };
        }
    }
}