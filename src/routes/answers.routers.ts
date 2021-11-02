import { Router } from "express";
import verifyUser from "../middlewares/verifyUser";
import AnswersController from "../answers/answers.controller";

const router = Router({ mergeParams: true });
const controller = new AnswersController();

router.get("/", controller.readAll);
router.post("/", verifyUser, controller.create);
router.delete("/:answersId", verifyUser, controller.delete);

export default router;