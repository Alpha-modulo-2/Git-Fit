import { Router } from "express";
import UserController from "./controllers/UserController";

const router: Router = Router();

const userController = new UserController();

//Routes
router.post("/users/", userController.insert);
router.get("/users/:id", userController.getOne);
router.get("/users/", userController.get);
router.patch("/users/:id", userController.update);
router.delete("/users/:id", userController.delete);

export { router };