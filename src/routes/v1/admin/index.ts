import { Router } from "express";
import staffRoutes from "./staff.route";

const router = Router();

router.use("/staff", staffRoutes);

export default router;
