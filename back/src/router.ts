import { Router } from "express";
import UserController from "./controllers/UserController";
import CardController from "./controllers/CardController";
import path from "path";

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
router.post("/cards/:userId", cardController.insert);
router.get("/allcards/:userId", cardController.get);
router.get("/card/:cardId", cardController.getOne);
router.post("/card/:cardId/task", cardController.addTask); 
router.post("/card/:cardId/meal", cardController.addMeal);
router.patch("/card/:cardId/trainingCard/check", cardController.updateTrainingCardChecked);
router.patch("/card/:cardId/mealsCard/check", cardController.updateMealsCardChecked);
router.patch("/card/:cardId/task/:taskId", cardController.updateTask);
router.patch("/card/:cardId/meal/:mealId", cardController.updateMeal);
router.delete("/card/:cardId/task/:taskId", cardController.delTask);
router.delete("/card/:cardId/meal/:mealId", cardController.delMeal);

router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

export { router };