import { Router } from "express";
import UserController from "../controllers/UserController";
import CardController from "../controllers/CardController";
import path from "path";
import LoginController from "../controllers/loginController";
import authenticate from "../middleware/authenticate";
import { validateInsert, validateLogin, validateUpdate, validateId, validateRemoveFriend, validateQuery } from "../middleware/validators";
import FriendRequestsController from "../controllers/FriendRequestsController";
import cacheMiddleware from '../middleware/cacheMiddleware';

const router: Router = Router();

const userController = new UserController();

router.post("/users/", validateInsert, userController.insert);
router.get("/users/search", authenticate, cacheMiddleware, validateQuery, userController.getByName);
router.get("/users/:id", authenticate, cacheMiddleware, validateId, userController.getOne);
router.get("/users/", authenticate, cacheMiddleware, userController.get);
router.patch("/users/:id", authenticate, validateUpdate, validateId, userController.update);
router.delete("/users/:id", authenticate, validateId, userController.delete);
router.delete("/user/:userId/friend/:friendId", authenticate, validateRemoveFriend, userController.removeFriend)

const cardController = new CardController();

router.post("/cards/:userId", authenticate, cardController.insert);
router.get("/allcards/:userId", authenticate,cardController.getAllCardsByUser);
router.get("/card/:cardId", authenticate, cardController.getOne);
router.post("/card/:cardId/task", authenticate, cardController.addTask);
router.post("/card/:cardId/meal", authenticate, cardController.addMeal);
router.patch('/card/updateTitle', authenticate, cardController.updateTitle);
router.patch("/trainingCard/check", authenticate, cardController.updateTrainingCardChecked);
router.patch("/mealsCard/check", authenticate, cardController.updateMealsCardChecked);
router.patch("/updateTask", authenticate, cardController.updateTask);
router.patch("/updateMeal", authenticate, cardController.updateMeal);
router.delete("/task/:taskId", authenticate, cardController.delTask);
router.delete("/meal/:mealId", authenticate, cardController.delMeal);

const friendRequestsController = new FriendRequestsController();

router.post("/solicitation", authenticate, friendRequestsController.insert);
router.get("/friendRequests/:userId", authenticate, friendRequestsController.friendRequestsByUser);
router.patch("/acceptFriend", authenticate, friendRequestsController.acceptFriend);
router.delete("/rejectFriend/:requestId", authenticate, friendRequestsController.rejectFriend);


const loginController = new LoginController();

router.post("/login", validateLogin, loginController.login);
// router.delete("/logout", loginController.logout);

router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

export { router };
