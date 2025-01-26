import { Router } from "express";
import adminRoute from "./admin/index.js";
import publicRoute from "./public/index.js";
import privateRoute from "./private/index.js";
import authRoute from "./auth/index.js";

const router = Router();
router.use("/admin", adminRoute);
router.use("/public", publicRoute);
router.use("/private", privateRoute);
router.use("/auth", authRoute);

export default router;
