import { Router } from "express";
import userRouter from "./users.routers";
import boardRouter from "./boards.routers";
import commentsRouter from "./comments.routers";
import answersRouter from "./answers.routers";

const router = Router();

router.use("/users", userRouter);
router.use("/boards", boardRouter);
router.use("/boards/:board_id/comments", commentsRouter);
router.use("/boards/:board_id/comments/:comment_id/answers", answersRouter);

export default router;
