import { Router } from "express";
import staffRoute from "./staff";
import publicRoute from "./public";
import sellerRoute from "./seller";
import clientRoute from "./client";
import authRoute from "./auth";
import adminRoute from "./admin";
import {
	isStaff,
	isSuperAdmin,
	isSeller,
	isClient,
	checkUserStatus,
} from "../../middlewares";

const router = Router();

router.use("/staff", checkUserStatus, isStaff, staffRoute);
router.use("/seller", checkUserStatus, isSeller, sellerRoute);
router.use("/client", checkUserStatus, isClient, clientRoute);
router.use("/auth", authRoute);
router.use("/public", publicRoute);
router.use("/admin", checkUserStatus, isSuperAdmin, adminRoute);

export default router;
