import { Router } from "express";
import BookingController from "../../../controllers/booking.controller";
import { BookingValidator, throwValidationErrors } from "../validators";

const router = Router();

// Create a new booking
router.post(
	"/",
	BookingValidator.createBooking,
	throwValidationErrors,
	BookingController.createBooking
);

// Get client's bookings
router.get(
	"/",
	BookingValidator.getClientBookings,
	throwValidationErrors,
	BookingController.getClientBookings
);

// Check availability
router.post(
	"/check-availability",
	BookingValidator.checkAvailability,
	throwValidationErrors,
	BookingController.checkAvailability
);

// Get upcoming bookings
router.get(
	"/upcoming",
	BookingValidator.getUpcomingBookings,
	throwValidationErrors,
	BookingController.getUpcomingBookings
);

// Get booking by ID
router.get(
	"/:id",
	BookingValidator.getBookingById,
	throwValidationErrors,
	BookingController.getBookingById
);

// Cancel booking
router.patch(
	"/:id/cancel",
	BookingValidator.getBookingById,
	throwValidationErrors,
	BookingController.cancelBooking
);

// Complete booking
router.patch(
	"/:id/complete",
	BookingValidator.getBookingById,
	throwValidationErrors,
	BookingController.completeBooking
);

export default router;
