import { Router, type IRouter } from "express";
import healthRouter from "./health";
import dinosaursRouter from "./dinosaurs";

const router: IRouter = Router();

router.use(healthRouter);
router.use(dinosaursRouter);

export default router;
