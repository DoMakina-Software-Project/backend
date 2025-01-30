import { Router } from "express";
import { DashboardController } from "../../../controllers/admin/index.js";

const router = Router();

router.get("/", DashboardController.getDashboard);

export default router;
