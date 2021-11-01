import { Router } from "express";
import UserController from "../users/users.controller";

const router = Router();
const controller = new UserController();

router.post("/", controller.signup);
router.post("/signin", controller.signin);
router.delete("/signout", controller.signout);
export default router;
