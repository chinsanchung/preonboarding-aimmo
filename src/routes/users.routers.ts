import { Router } from "express";
import UserController from "../users/users.controller";

const router = Router();
const controller = new UserController();

router.post("/", controller.signup);
router.post("/signin", controller.signin);
export default router;
