import { Router } from "express";
import verifyUser from "../middlewares/verifyUser";
import BoardController from "../boards/boards.controller";

const router = Router();
const controller = new BoardController();

router.post("/", verifyUser, controller.create);

export default router;
