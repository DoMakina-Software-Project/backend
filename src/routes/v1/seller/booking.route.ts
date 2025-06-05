import { Router } from "express";
import BookingController from "../../../controllers/booking.controller";
import { BookingValidator, throwValidationErrors } from "../validators";

const router = Router();

// Get seller's bookings
router.get(
	"/",
	BookingValidator.getSellerBookings,
	throwValidationErrors,
	BookingController.getSellerBookings
);

// Get booking statistics
router.get("/stats", BookingController.getSellerBookingStats);

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

// Confirm booking
router.patch(
	"/:id/confirm",
	BookingValidator.getBookingById,
	throwValidationErrors,
	BookingController.confirmBooking
);

// Reject booking
router.patch(
	"/:id/reject",
	BookingValidator.getBookingById,
	throwValidationErrors,
	BookingController.rejectBooking
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

// Update booking status
router.patch(
	"/:id/status",
	BookingValidator.updateBookingStatus,
	throwValidationErrors,
	BookingController.updateBookingStatus
);

// Update payment status
router.patch(
	"/:id/payment",
	BookingValidator.updatePaymentStatus,
	throwValidationErrors,
	BookingController.updatePaymentStatus
);

export default router;
