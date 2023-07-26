import { Router } from "express";
import UserController from "./controllers/UserController";
import CardController from "./controllers/CardController";
import path from "path";
import loginController from "./controllers/loginController";
import authenticate from "./middleware/authenticate";

const router: Router = Router();

const userController = new UserController();

//User Routes
router.post("/users/", authenticate, userController.insert);
router.get("/users/:id", authenticate, userController.getOne);
router.get("/users/", authenticate, userController.get);
router.patch("/users/:id", authenticate, userController.update);
router.delete("/users/:id", authenticate, userController.delete);

const cardController = new CardController();

//Card Routes
router.post("/cards/:userId", cardController.insert);
router.get("/allcards/:userId", cardController.get);
router.get("/card/:cardId", cardController.getOne);
router.post("/card/:cardId/task", cardController.addTask);
router.post("/card/:cardId/meal", cardController.addMeal);
router.patch("/card/:cardId/task/:taskId", cardController.updateTask);
router.patch("/card/:cardId/meal/:mealId", cardController.updateMeal);
router.delete("/card/:cardId/task/:taskId", cardController.delTask);
router.delete("/card/:cardId/meal/:mealId", cardController.delMeal);

router.post("/login", loginController.login);
// router.delete("/logout", loginController.logout);

router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

export { router };
