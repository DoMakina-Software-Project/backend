import { Router } from "express";
import staffRoute from "./staff";
import publicRoute from "./public";
import sellerRoute from "./seller";
import clientRoute from "./client";
import authRoute from "./auth";
import { isAuth, isStaff } from "../../middlewares";

const router = Router();

router.use("/staff", isStaff, staffRoute);
router.use("/seller", isAuth, sellerRoute);
router.use("/client", isAuth, clientRoute);
router.use("/auth", authRoute);
router.use("/public", publicRoute);

export default router;
