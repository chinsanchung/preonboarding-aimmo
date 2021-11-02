import { Router } from "express";
import verifyUser from "../middlewares/verifyUser";
import CommentsController from "../comments/comments.controller";

const router = Router({ mergeParams: true });
const controller = new CommentsController();

router.get("/", controller.readAll);
router.post("/", verifyUser, controller.create);
router.delete("/:coommentsId", verifyUser, controller.delete);

export default router;