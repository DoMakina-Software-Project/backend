import { Router } from "express";
import { StaffDashboardController } from "../../../controllers/staff";

const router = Router();

router.get("/", StaffDashboardController.getDashboard);

export default router;
