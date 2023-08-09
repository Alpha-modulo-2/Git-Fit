import { Request, Response } from "express";
import CardService from "../services/CardServices";
import ITask from "../interfaces/ITask";
import IMeal from "../interfaces/IMeal";
export default class CardController {
    private service: CardService;

    constructor(service?: CardService) {
        this.service = service || new CardService();
        this.insert = this.insert.bind(this);
        this.getAllCardsByUser = this.getAllCardsByUser.bind(this);
        this.getOne = this.getOne.bind(this);
        this.addTask = this.addTask.bind(this);
        this.addMeal = this.addMeal.bind(this);
        this.updateTitle = this.updateTitle.bind(this);
        this.updateTrainingCardChecked = this.updateTrainingCardChecked.bind(this);
        this.updateMealsCardChecked = this.updateMealsCardChecked.bind(this);
        this.updateTask = this.updateTask.bind(this);
        this.updateMeal = this.updateMeal.bind(this);
        this.delTask = this.delTask.bind(this);
        this.delMeal = this.delMeal.bind(this);
    }

    async insert(req: Request, res: Response) {
        const { userId } = req.params

        if (!userId || userId.length !== 24 || !(/^[0-9a-fA-F]+$/).test(userId)) {
            return res.status(400).json({
                error: true,
                statusCode: 400,
                message: "ID do usuário inválido"
            });
        }

        try {
            const result = await this.service.insert(userId);
            
            return res.status(result.statusCode).json(result);
        } catch (error: any) {
            console.log("Erro ao inserir os cards", error.message);
            return res.status(500).json({
                error: true,
                statusCode: 500,
                message: error.message
            });
        }
    }

    async getAllCardsByUser(req: Request, res: Response) {
        try {
            const { userId } = req.params

            if (!userId || userId.length !== 24 || !(/^[0-9a-fA-F]+$/).test(userId)) {
                return res.status(400).json({
                    error: true,
                    statusCode: 400,
                    message: "ID do usuário inválido"
                });
            }

            const result = await this.service.getAllCardsByUser(userId);

            return res.status(result.statusCode).json(result);
        } catch (error: any) {
            console.log("Erro ao solicitar os cards:", error.message);
            return res.status(500).json({
                error: true,
                statusCode: 500,
                message: error.message
            });
        }
    }

    async getOne(req: Request, res: Response) {
        const { cardId } = req.params

        if (!cardId || cardId.length !== 24 || !(/^[0-9a-fA-F]+$/).test(cardId)) {
            return res.status(400).json({
                error: true,
                statusCode: 400,
                message: "ID do card inválido"
            });
        }

        try {
            const result = await this.service.getOne(cardId);

            return res.status(result.statusCode).json(result);
        } catch (error: any) {
            console.log("Erro ao solicitar o card:", error.message);
            return res.status(500).json({
                error: true,
                statusCode: 500,
                message: error.message
            });
        }
    }

    async updateTrainingCardChecked(req: Request, res: Response) {
        const { cardId, checked } = req.body;

        if (!cardId || cardId.length !== 24 || !(/^[0-9a-fA-F]+$/).test(cardId)) {
            return res.status(400).json({
                error: true,
                statusCode: 400,
                message: "ID do card inválido"
            });
        }
    
        if (typeof checked !== 'boolean') {
            return res.status(400).json({
                error: true,
                statusCode: 400,
                message: "O campo checked precisa ser booleano"
            });
        }
    
        try {
            const result = await this.service.updateTrainingCardChecked(cardId, checked);
    
            return res.status(result.statusCode).json(result);
        } catch (error: any) {
            console.log("Erro ao atualizar o campo checked da TrainingCard", error.message);
            return res.status(500).json({
                error: true,
                statusCode: 500,
                message: error.message
            });
        }
    }

    async updateMealsCardChecked(req: Request, res: Response) {
        const { cardId, checked } = req.body;

        if (!cardId || cardId.length !== 24 || !(/^[0-9a-fA-F]+$/).test(cardId)) {
            return res.status(400).json({
                error: true,
                statusCode: 400,
                message: "ID do card inválido"
            });
        }
    
        if (typeof checked !== 'boolean') {
            return res.status(400).json({
                error: true,
                statusCode: 400,
                message: "O campo checked precisa ser booleano"
            });
        }
    
        try {
            const result = await this.service.updateMealsCardChecked(cardId, checked);

            return res.status(result.statusCode).json(result);
        } catch (error: any) {
            console.log("Erro ao atualizar o campo checked da MealsCard", error.message);
            return res.status(500).json({
                error: true,
                statusCode: 500,
                message: error.message
            });
        }
    }

    async addTask(req: Request, res: Response) {
        const { cardId } = req.params
        const task: ITask = {
            description: req.body.description
        }

        if (!cardId || cardId.length !== 24 || !(/^[0-9a-fA-F]+$/).test(cardId)) {
            return res.status(400).json({
                error: true,
                statusCode: 400,
                message: "ID do card inválido"
            });
        }

        if (!task.description || task.description.trim().length === 0) {
            return res.status(400).json({
                error: true,
                statusCode: 400,
                message: "Descrição da tarefa inválida"
            });
        }

        try {
            const result = await this.service.addTask(cardId, task);

            return res.status(result.statusCode).json(result);
        } catch (error: any) {
            console.log("Erro ao adicionar a tarefa ao card:", error.message);
            return res.status(500).json({
                error: true,
                statusCode: 500,
                message: error.message
            });
        }
    }

    async addMeal(req: Request, res: Response) {
        const { cardId } = req.params;
        const meal: IMeal = {
            description: req.body.description
        }

        if (!cardId || cardId.length !== 24 || !(/^[0-9a-fA-F]+$/).test(cardId)) {
            return res.status(400).json({
                error: true,
                statusCode: 400,
                message: "ID do card inválido"
            });
        }

        if (!meal.description || meal.description.trim().length === 0) {
            return res.status(400).json({
                error: true,
                statusCode: 400,
                message: "Descrição de refeição inválida"
            });
        }

        try {
            const result = await this.service.addMeal(cardId, meal);

            return res.status(result.statusCode).json(result);
        } catch (error: any) {
            console.log("Erro ao adicionar a refeição ao card:", error.message);
            return res.status(500).json({
                error: true,
                statusCode: 500,
                message: error.message
            });
        }
    }

    async updateTitle(req: Request, res: Response) {
        const { cardId, title } = req.body;

        if (!cardId || cardId.length !== 24 || !(/^[0-9a-fA-F]+$/).test(cardId)) {
            return res.status(400).json({
                error: true,
                statusCode: 400,
                message: "ID do card inválido"
            });
        }

        if (!title || title.trim().length === 0) {
            return res.status(400).json({
                error: true,
                statusCode: 400,
                message: "Título inválido"
            });
        }
    
        try {
            const result = await this.service.updateTitle(cardId, title);
    
            return res.status(result.statusCode).json(result);
        } catch (error: any) {
            console.log("Erro ao atualizar o título do cartão", error.message);
            return res.status(500).json({
                error: true,
                statusCode: 500,
                message: error.message
            });
        }
    }

    async updateTask(req: Request, res: Response) {
        const { taskId ,description } = req.body;

        if (!taskId || taskId.length !== 24 || !(/^[0-9a-fA-F]+$/).test(taskId)) {
            return res.status(400).json({
                error: true,
                statusCode: 400,
                message: "ID da tarefa inválido"
            });
        }

        if (!description || description.trim().length === 0) {
            return res.status(400).json({
                error: true,
                statusCode: 400,
                message: "Descrição da tarefa inválida"
            });
        }

        try {
            const result = await this.service.updateTask(taskId, description);
        
            return res.status(result.statusCode || 500).json(result);
        } catch (error: any) {
            console.log("Erro ao solicitar o card:", error.message);
            return res.status(500).json({
                error: true,
                statusCode: 500,
                message: error.message
            });
        }
    }

    async updateMeal(req: Request, res: Response) {
        const { mealId, description } = req.body;

        if (!mealId || mealId.length !== 24 || !(/^[0-9a-fA-F]+$/).test(mealId)) {
            return res.status(400).json({
                error: true,
                statusCode: 400,
                message: "ID da tarefa inválido"
            });
        }

        if (!description || description.trim().length === 0) {
            return res.status(400).json({
                error: true,
                statusCode: 400,
                message: "Descrição da tarefa inválida"
            });
        }
    
        try {
            const result = await this.service.updateMeal(mealId, description);
    
            return res.status(result.statusCode).json(result);
        } catch (error: any) {
            console.log("Erro ao atualizar a refeição:", error.message);
            return res.status(500).json({
                error: true,
                statusCode: 500,
                message: error.message
            });
        }
    }

    async delTask(req: Request, res: Response) {
        const { taskId } = req.params;

        try {
            const result = await this.service.delTask(taskId);

            return res.status(result.statusCode).json(result);
        } catch (error: any) {
            console.log("Erro ao deletar a task:", error.message);
            return res.status(500).json({
                error: true,
                statusCode: 500,
                message: error.message
            });
        }
    }

    async delMeal(req: Request, res: Response) {
        const { mealId } = req.params;

        try {
            const result = await this.service.delMeal(mealId);
            
            return res.status(result.statusCode).json(result);
        } catch (error: any) {
            console.log("Erro ao deletar a refeição:", error.message);
            return res.status(500).json({
                error: true,
                statusCode: 500,
                message: error.message
            });
        }
    }
}