import { Router } from "express";
import verifyUser from "../middlewares/verifyUser";
import CommentsController from "../comments/comments.controller";

const router = Router({ mergeParams: true });
const controller = new CommentsController();

router.post("/", verifyUser, controller.create);

export default router;
