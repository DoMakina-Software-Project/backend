import { Router } from "express";
import bookingRoute from "./booking.route";
import wishlistRoute from "./wishlist.route";

const router = Router();

router.use("/bookings", bookingRoute);
router.use("/wishlist", wishlistRoute);

export default router;
