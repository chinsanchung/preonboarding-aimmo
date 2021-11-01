import { Router } from "express";
import userRouter from "./users.routers";
const router = Router();

router.use("/users", userRouter);

export default router;
