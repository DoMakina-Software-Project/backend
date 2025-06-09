import { Router } from "express";
import CarsRoute from "./cars.route";
import BrandsRoute from "./brands.route";
import PromotionPriceRoute from "./promotion-price.route";
import reviewRouter from "./review.route";
import BookingRoute from "./booking.route";

const router = Router();

router.use("/cars", CarsRoute);
router.use("/brands", BrandsRoute);
router.use("/promotion-price", PromotionPriceRoute);
router.use("/reviews", reviewRouter);
router.use("/bookings", BookingRoute);

export default router;
