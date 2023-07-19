import { Router } from "express";
import UserController from "./controllers/UserController";
import CardController from "./controllers/CardController";

const router: Router = Router();

const userController = new UserController();

//User Routes
router.post("/users/", userController.insert);
router.get("/users/:id", userController.getOne);
router.get("/users/", userController.get);
router.patch("/users/:id", userController.update);
router.delete("/users/:id", userController.delete);

const cardController = new CardController();

//Card Routes
router.post("/cards/:userId", cardController.insert); //Retorna um array com os 7 cards criados
router.get("/allcards/:userId", cardController.get) //Retorna um arrays com os 7 cards daquele user
router.get("/card/:cardId", cardController.getOne) //Retorna somente 1 card de acordo com o id do card
router.post("/card/:cardId/task", cardController.addTask); //Add uma task ao card indicado
router.post("/card/:cardId/meal", cardController.addMeal); //Add uma refeição ao card indicado
router.patch("/card/:cardId/task/:taskId", cardController.updateTask); //Atualiza uma task do card indicado
router.patch("/card/:cardId/meal/:mealId", cardController.updateMeal); //Atualiza uma meal do card indicado
router.delete("/card/:cardId/task/:taskId", cardController.delTask); //Deleta uma task do card indicado
router.delete("/card/:cardId/meal/:mealId", cardController.delMeal); //Deleta uma meal do card indicado

export { router };