import { Router } from "express";
import staffRoute from "./staff/index.js";
import publicRoute from "./public/index.js";
import sellerRoute from "./seller/index.js";
import clientRoute from "./client/index.js";
import authRoute from "./auth/index.js";
import { isAuth, isStaff } from "../../middlewares/index.js";

const router = Router();

router.use("/staff", isStaff, staffRoute);
router.use("/seller", isAuth, sellerRoute);
router.use("/client", isAuth, clientRoute);
router.use("/auth", authRoute);
router.use("/public", publicRoute);

export default router;
