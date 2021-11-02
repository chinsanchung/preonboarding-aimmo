import { Router } from "express";
import verifyUser from "../middlewares/verifyUser";
import BoardController from "../boards/boards.controller";

const router = Router();
const controller = new BoardController();

router.get("/", verifyUser, controller.readAll);
router.get("/:board_id", verifyUser, controller.readOne);
router.post("/", verifyUser, controller.create);
router.patch("/:board_id", verifyUser, controller.update);
router.delete("/:board_id", verifyUser, controller.delete);

export default router;
