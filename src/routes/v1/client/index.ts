import { Router } from "express";
import bookingRoute from "./booking.route";

const router = Router();

router.use("/bookings", bookingRoute);

export default router;
