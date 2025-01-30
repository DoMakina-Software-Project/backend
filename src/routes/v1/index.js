import { Router } from "express";
import adminRoute from "./admin/index.js";
import publicRoute from "./public/index.js";
import privateRoute from "./private/index.js";
import authRoute from "./auth/index.js";
import { isAuth, isAdmin } from "../../middlewares/index.js";

const router = Router();

router.use("/admin", isAdmin, adminRoute);
router.use("/private", isAuth, privateRoute);
router.use("/auth", authRoute);
router.use("/public", publicRoute);

export default router;
