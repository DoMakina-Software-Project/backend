import { Router } from "express";
import bookingRoute from "./booking.route";
import wishlistRoute from "./wishlist.route";
import reviewRouter from "./review.route";

const router = Router();

router.use("/bookings", bookingRoute);
router.use("/wishlist", wishlistRoute);
router.use("/reviews", reviewRouter);

export default router;
