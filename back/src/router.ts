import { Router } from "express";
import UserController from "./controllers/UserController";
import CardController from "./controllers/CardController";
import path from "path";
import LoginController from "./controllers/loginController";
import authenticate from "./middleware/authenticate";
import FriendRequestsController from "./controllers/FriendRequestsController";

const router: Router = Router();

const userController = new UserController();

//User Routes
router.post("/users/", authenticate, userController.insert);
router.get("/users/search", authenticate, userController.getByName);
router.get("/users/:id", authenticate, userController.getOne);
router.get("/users/", authenticate, userController.get);
router.patch("/users/:id", authenticate, userController.update);
router.delete("/users/:id", authenticate, userController.delete);
router.delete("/user/:userId/friend/:friendId", authenticate, userController.removeFriend)


const cardController = new CardController();

//Card Routes
router.post("/cards/:userId", authenticate, cardController.insert);
router.get("/allcards/:userId", authenticate, cardController.getAllCardsByUser);
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

//FriendRequests Routes
router.post("/solicitation", friendRequestsController.insert);
router.get("/friendRequests/:userId", friendRequestsController.friendRequestsByUser);
router.patch("/acceptFriend", friendRequestsController.acceptFriend);
router.delete("/rejectFriend/:requestId", friendRequestsController.rejectFriend);


const loginController = new LoginController();

//Login Routes
router.post("/login", loginController.login);
// router.delete("/logout", loginController.logout);

router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

export { router };
