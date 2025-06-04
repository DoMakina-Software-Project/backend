import { Router } from "express";
import staffRoute from "./staff";
import publicRoute from "./public";
import sellerRoute from "./seller";
import clientRoute from "./client";
import authRoute from "./auth";
import adminRoute from "./admin";
import { isStaff, isSuperAdmin, isSeller, isClient } from "../../middlewares";

const router = Router();

router.use("/staff", isStaff, staffRoute);
router.use("/seller", isSeller, sellerRoute);
router.use("/client", isClient, clientRoute);
router.use("/auth", authRoute);
router.use("/public", publicRoute);
router.use("/admin", isSuperAdmin, adminRoute);

export default router;
