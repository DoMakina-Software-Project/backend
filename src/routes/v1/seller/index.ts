import { Router } from "express";
import CarsRoute from "./cars.route";
import PromotionRoute from "./promotion.route";
import ProfileRoute from "./profile.route";
import RentalAvailabilityRoute from "./rental-availability.route";
import BookingRoute from "./booking.route";

const router = Router();

router.use("/cars", CarsRoute);
router.use("/promotions", PromotionRoute);
router.use("/profile", ProfileRoute);
router.use("/rental-availability", RentalAvailabilityRoute);
router.use("/bookings", BookingRoute);

export default router;
