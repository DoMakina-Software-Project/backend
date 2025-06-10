import { body, param, query, ValidationChain } from "express-validator";

interface BookingValidator {
	createBooking: ValidationChain[];
	updateBookingStatus: ValidationChain[];
	updatePaymentStatus: ValidationChain[];
	getBookingById: ValidationChain[];
	getClientBookings: ValidationChain[];
	getSellerBookings: ValidationChain[];
	checkAvailability: ValidationChain[];
	getUpcomingBookings: ValidationChain[];
}

const BookingValidator: BookingValidator = {
	createBooking: [
		body("carId").isInt().withMessage("Car ID is required"),
		body("startDate")
			.isISO8601()
			.toDate()
			.withMessage("Start date is required"),
		body("endDate")
			.isISO8601()
			.toDate()
			.withMessage("End date is required"),
		body("paymentMethod")
			.optional()
			.isIn(["CASH"])
			.withMessage("Payment method must be CASH"),
	],

	updateBookingStatus: [
		param("id").isInt().withMessage("Booking ID is required"),
		body("status")
			.isIn([
				"PENDING",
				"CONFIRMED",
				"CANCELLED",
				"COMPLETED",
				"REJECTED",
				"EXPIRED",
			])
			.withMessage("Invalid status"),
	],

	updatePaymentStatus: [
		param("id").isInt().withMessage("Booking ID is required"),
		body("paymentStatus")
			.isIn(["PENDING", "PAID", "REFUNDED", "FAILED"])
			.withMessage("Invalid payment status"),
	],

	getBookingById: [param("id").isInt().withMessage("Booking ID is required")],

	getClientBookings: [
		query("status")
			.optional()
			.isIn([
				"PENDING",
				"CONFIRMED",
				"CANCELLED",
				"COMPLETED",
				"REJECTED",
				"EXPIRED",
			])
			.withMessage("Invalid status"),
	],

	getSellerBookings: [
		query("status")
			.optional()
			.isIn([
				"PENDING",
				"CONFIRMED",
				"CANCELLED",
				"COMPLETED",
				"REJECTED",
				"EXPIRED",
			])
			.withMessage("Invalid status"),
	],

	checkAvailability: [
		body("carId").isInt().withMessage("Car ID is required"),
		body("startDate")
			.isISO8601()
			.toDate()
			.withMessage("Start date is required"),
		body("endDate")
			.isISO8601()
			.toDate()
			.withMessage("End date is required"),
	],

	getUpcomingBookings: [
		query("userType")
			.isIn(["client", "seller"])
			.withMessage("User type must be client or seller"),
	],
};

export default BookingValidator;
