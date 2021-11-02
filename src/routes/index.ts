import { Router } from "express";
import userRouter from "./users.routers";
import boardRouter from "./boards.routers";
import commentsRouter from "./comments.routers";

const router = Router();

router.use("/users", userRouter);
router.use("/boards", boardRouter);
router.use("/boards/:boardsId/comments", commentsRouter);

export default router;
