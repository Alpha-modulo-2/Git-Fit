import { Router } from "express";
import UserController from "./controllers/UserController";
import CardController from "./controllers/CardController";
import path from "path";
import LoginController from "./controllers/loginController";
import authenticate from "./middleware/authenticate";
import { validateInsert, validateLogin, validateUpdate, validateId, validateRemoveFriend, validateQuery } from "./middleware/validators";
import FriendRequestsController from "./controllers/FriendRequestsController";
import cacheMiddleware from './middleware/cacheMiddleware';

const router: Router = Router();

const userController = new UserController();

//User Routes
router.post("/users/", authenticate, validateInsert, userController.insert);
router.get("/users/search", authenticate, cacheMiddleware, validateQuery, userController.getByName);
router.get("/users/:id", authenticate, cacheMiddleware, validateId, userController.getOne);
router.get("/users/", authenticate, cacheMiddleware, userController.get);
router.patch("/users/:id", authenticate, validateUpdate, validateId, userController.update);
router.delete("/users/:id", authenticate, validateId, userController.delete);
router.delete("/user/:userId/friend/:friendId", authenticate, validateRemoveFriend, userController.removeFriend)

const cardController = new CardController();

//Card Routes
router.post("/cards/:userId", cardController.insert);
router.get("/allcards/:userId", cacheMiddleware, cardController.getAllCardsByUser);
router.get("/card/:cardId", cardController.getOne);
router.post("/card/:cardId/task", cardController.addTask);
router.post("/card/:cardId/meal", cardController.addMeal);
router.patch("/card/:cardId/trainingCard/check", cardController.updateTrainingCardChecked);
router.patch("/card/:cardId/mealsCard/check", cardController.updateMealsCardChecked);
router.patch("/card/:cardId/task/:taskId", cardController.updateTask);
router.patch("/card/:cardId/meal/:mealId", cardController.updateMeal);
router.delete("/card/:cardId/task/:taskId", cardController.delTask);
router.delete("/card/:cardId/meal/:mealId", cardController.delMeal);


const friendRequestsController = new FriendRequestsController();

//FriendRequests Routes
router.post("/solicitation", friendRequestsController.insert);
router.get("/friendRequests/:userId", friendRequestsController.friendRequestsByUser);
router.patch("/acceptFriend", friendRequestsController.acceptFriend);
router.delete("/rejectFriend/:requestId", friendRequestsController.rejectFriend);


const loginController = new LoginController();

//Login Routes
router.post("/login", validateLogin, loginController.login);
// router.delete("/logout", loginController.logout);

router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

export { router };
