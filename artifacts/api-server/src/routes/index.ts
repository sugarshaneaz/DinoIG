import { Router, type IRouter } from "express";
import healthRouter from "./health";
import dinosaursRouter from "./dinosaurs";
import chatRouter from "./chat";

const router: IRouter = Router();

router.use(healthRouter);
router.use(dinosaursRouter);
router.use(chatRouter);

export default router;
