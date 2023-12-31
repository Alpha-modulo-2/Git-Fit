import { Router } from "express";
import UserController from "../controllers/UserController";
import CardController from "../controllers/CardController";
import path from "path";
import LoginController from "../controllers/loginController";
import authenticate from "../middleware/authenticate";
import { validateInsert, validateLogin, validateUpdate, validateId, validateRemoveFriend, validateQuery } from "../middleware/validators";
import FriendRequestsController from "../controllers/FriendRequestsController";
import cacheMiddleware from '../middleware/cacheMiddleware';
import ConversationController from "../controllers/conversationController";
import MessageController from "../controllers/messageController";
import { clearCache, clearCacheForCards } from "../middleware/clearCacheMiddleware";
import multer from 'multer';
import multerConfig from "../middleware/multer";
import UserSummaryController from "../controllers/userSummaryController";

const router: Router = Router();

const userController = new UserController();

const uploadMiddleware = multer(multerConfig);

router.post("/users/", uploadMiddleware.single('photo'), validateInsert, clearCache, userController.insert);
router.get("/users/search", authenticate, cacheMiddleware, validateQuery, userController.getByName);
router.get("/users/:id", authenticate, cacheMiddleware, validateId, userController.getOne);
router.get("/users/", authenticate, cacheMiddleware, userController.get);
router.patch("/users/:id", uploadMiddleware.single('photo'), authenticate, validateUpdate, validateId, clearCache, userController.update);
router.delete("/users/:id", authenticate, validateId, clearCache, userController.delete);
router.delete("/user/:userId/friend/:friendId", authenticate, validateRemoveFriend, clearCache, userController.removeFriend)

const cardController = new CardController();

router.post("/cards/:userId", authenticate, clearCacheForCards, cardController.insert);
router.get("/allcards/:userId", authenticate, cacheMiddleware, cardController.getAllCardsByUser);
router.get("/card/:cardId", authenticate, cardController.getOne);
router.post("/card/:cardId/task", authenticate, clearCacheForCards, cardController.addTask);
router.post("/card/:cardId/meal", authenticate, clearCacheForCards, cardController.addMeal);
router.patch('/card/updateTitle', authenticate, clearCacheForCards, cardController.updateTitle);
router.patch("/trainingCard/check", authenticate, clearCacheForCards, cardController.updateTrainingCardChecked);
router.patch("/mealsCard/check", authenticate, clearCacheForCards, cardController.updateMealsCardChecked);
router.patch("/updateTask", authenticate, clearCacheForCards, cardController.updateTask);
router.patch("/updateMeal", authenticate, clearCacheForCards, cardController.updateMeal);
router.delete("/task/:taskId", authenticate, clearCacheForCards, cardController.delTask);
router.delete("/meal/:mealId", authenticate, clearCacheForCards, cardController.delMeal);

const friendRequestsController = new FriendRequestsController();

router.post("/solicitation", authenticate, clearCache, friendRequestsController.insert);
router.get("/friendRequests/:userId", authenticate, friendRequestsController.friendRequestsByUser);
router.patch("/acceptFriend", authenticate, clearCache, friendRequestsController.acceptFriend);
router.delete("/rejectFriend/:requestId", authenticate, clearCache, friendRequestsController.rejectFriend);

const loginController = new LoginController();

router.post("/login", validateLogin, loginController.login);

const conversationController = new ConversationController();
const messageController = new MessageController();

router.post("/conversations", conversationController.create)
router.get("/conversations/:userId", conversationController.get)

router.post("/messages", messageController.create)
router.get("/messages/:chatId", messageController.get)
router.post("/messages/markAsRead", messageController.markAsRead);

const userSummaryController = new UserSummaryController();

router.get("/userSummary/:userId", authenticate, userSummaryController.getOne);

router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

export { router };
