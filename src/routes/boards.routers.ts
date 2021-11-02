import { Router } from "express";
import verifyUser from "../middlewares/verifyUser";
import BoardController from "../boards/boards.controller";

const router = Router();
const controller = new BoardController();

router.get("/", verifyUser, controller.readAll);
router.get("/:id", verifyUser, controller.readOne);
router.post("/", verifyUser, controller.create);

export default router;
