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
        //this.update = this.update.bind(this);
        //this.delete = this.delete.bind(this);
    }

    async insert(req: Request, res: Response) {
        const { userId } = req.params

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
            console.log(TAG, result);

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

        try {
            const result = await this.service.getOne(cardId);
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

    async addTask(req: Request, res: Response) {
        const { cardId } = req.params
        const task: ITask = {
            description: req.body.description
        }

        try {
            const result = await this.service.addTask(cardId, task);
            console.log(TAG, result);

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

        try {
            const result = await this.service.addMeal(cardId, meal);
            console.log(TAG, result);

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
}