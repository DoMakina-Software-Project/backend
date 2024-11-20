import { Router } from "express";
import publicRoute from "./public/index.js";
import privateRoute from "./private/index.js";
import authRoute from "./auth/index.js";

const router = Router();

router.use("/public", publicRoute);
router.use("/private", privateRoute);
router.use("/auth", authRoute);

export default router;
