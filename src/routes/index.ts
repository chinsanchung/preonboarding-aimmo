import { Router } from "express";
import userRouter from "./users.routers";
import boardRouter from "./boards.routers";
const router = Router();

router.use("/users", userRouter);
router.use("/boards", boardRouter);

export default router;
