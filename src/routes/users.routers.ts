import { Router } from "express";
import UserController from "../users/users.controller";

const router = Router();
const controller = new UserController();
console.log(`controller.signup  : ` ,controller.signup);

router.post("/", controller.signup);

export default router;