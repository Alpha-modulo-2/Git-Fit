import { Request, Response } from "express";
import CardService from "../services/CardServices";
import ICard from "../interfaces/ICard";
import ITask from "../interfaces/ITask";
import IMeal from "../interfaces/IMeal";

const TAG = "Card Controller "

export default class CardController {
    private service: CardService;

    constructor() {
        this.service = new CardService();
        this.insert = this.insert.bind(this);
        this.get = this.get.bind(this);
        this.getOne = this.getOne.bind(this);
        this.addTask = this.addTask.bind(this);
        this.addMeal = this.addMeal.bind(this);
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
            console.log(TAG, result);
            
            return res.status(result.statusCode || 500).json(result.card || result.message);
        } catch (error: any) {
            console.log("Erro ao inserir os cards", error.message);
            return res.status(500).json({
                error: true,
                statusCode: 500,
                message: error.message
            });
        }
    }

    async get(req: Request, res: Response) {
        try {
            const result = await this.service.get();

            return res.status(result.statusCode || 500).json(result.card || result.message);
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

            return res.status(result.statusCode || 500).json(result.card || result.message);
        } catch (error: any) {
            console.log("Erro ao solicitar o card:", error.message);
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

            return res.status(result.statusCode || 500).json(result.card || result.message);
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

            return res.status(result.statusCode || 500).json(result.card || result.message);
        } catch (error: any) {
            console.log("Erro ao adicionar a refeição ao card:", error.message);
            return res.status(500).json({
                error: true,
                statusCode: 500,
                message: error.message
            });
        }
    }

    async updateTask(req: Request, res: Response) {
        const { cardId, taskId } = req.params;
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
            const result = await this.service.updateTask(cardId, taskId, task);
            console.log(TAG, result);

            return res.status(result.statusCode || 500).json(result.card || result.message);
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
        const { cardId, mealId } = req.params;
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
            const result = await this.service.updateMeal(cardId, mealId, meal);
            console.log(TAG, result);
    
            return res.status(result.statusCode || 500).json(result.card || result.message);
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
        const { cardId, taskId } = req.params;

        try {
            const result = await this.service.delTask(cardId, taskId);

            return res.status(result.statusCode).json(result.card || result.message);
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
        const { cardId, mealId } = req.params;

        try {
            const result = await this.service.delMeal(cardId, mealId);
            
            return res.status(result.statusCode).json(result.card || result.message);
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