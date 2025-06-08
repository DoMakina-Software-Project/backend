import { Request, Response } from "express";
import { BookingService } from "../services";

class BookingController {
	/**
	 * Create a new booking
	 */
	async createBooking(req: Request, res: Response) {
		try {
			const { carId, startDate, endDate, paymentMethod } = req.body;
			const clientId = (req as any).user?.id;

			if (!clientId) {
				return res.status(401).json({
					message: "Unauthorized: User not found",
				});
			}

			const booking = await BookingService.createBooking({
				carId,
				clientId,
				startDate: new Date(startDate),
				endDate: new Date(endDate),
				paymentMethod,
			});

			res.status(201).json(booking);
		} catch (error: any) {
			res.status(400).json({
				message: error.message || "Failed to create booking",
			});
		}
	}

	/**
	 * Get booking by ID
	 */
	async getBookingById(req: Request, res: Response) {
		try {
			const bookingId = parseInt(req.params.id);
			const userId = (req as any).user?.id;

			const booking = await BookingService.getBookingById(bookingId);

			if (
				booking.clientId !== userId &&
				booking.Car.sellerId !== userId
			) {
				return res.status(403).json({
					message:
						"Access denied: You don't have permission to view this booking",
				});
			}

			res.status(200).json(booking);
		} catch (error: any) {
			if (error.message === "Booking not found") {
				return res.status(404).json({ message: error.message });
			}
			res.status(500).json({
				message: error.message || "Failed to retrieve booking",
			});
		}
	}

	/**
	 * Get bookings for the authenticated client
	 */
	async getClientBookings(req: Request, res: Response) {
		try {
			const clientId = (req as any).user?.id;
			const { status } = req.query;

			if (!clientId) {
				return res.status(401).json({
					message: "Unauthorized: User not found",
				});
			}

			const bookings = await BookingService.getClientBookings(
				clientId,
				status as string
			);

			res.status(200).json(bookings);
		} catch (error: any) {
			res.status(500).json({
				message: error.message || "Failed to retrieve client bookings",
			});
		}
	}

	/**
	 * Get bookings for the authenticated seller
	 */
	async getSellerBookings(req: Request, res: Response) {
		try {
			const sellerId = (req as any).user?.id;
			const { status } = req.query;

			if (!sellerId) {
				return res.status(401).json({
					message: "Unauthorized: User not found",
				});
			}

			const bookings = await BookingService.getSellerBookings(
				sellerId,
				status as string
			);

			res.status(200).json(bookings);
		} catch (error: any) {
			res.status(500).json({
				message: error.message || "Failed to retrieve seller bookings",
			});
		}
	}

	/**
	 * Update booking status
	 */
	async updateBookingStatus(req: Request, res: Response) {
		try {
			const bookingId = parseInt(req.params.id);
			const { status } = req.body;
			const updatedBy = (req as any).user?.id;

			if (!updatedBy) {
				return res.status(401).json({
					message: "Unauthorized: User not found",
				});
			}

			const updatedBooking = await BookingService.updateBookingStatus({
				bookingId,
				status,
				updatedBy,
			});

			res.status(200).json(updatedBooking);
		} catch (error: any) {
			if (error.message.includes("permission")) {
				return res.status(403).json({ message: error.message });
			}
			if (error.message.includes("not found")) {
				return res.status(404).json({ message: error.message });
			}
			res.status(400).json({
				message: error.message || "Failed to update booking status",
			});
		}
	}

	/**
	 * Update payment status
	 */
	async updatePaymentStatus(req: Request, res: Response) {
		try {
			const bookingId = parseInt(req.params.id);
			const { paymentStatus } = req.body;

			const updatedBooking = await BookingService.updatePaymentStatus({
				bookingId,
				paymentStatus,
			});

			res.status(200).json(updatedBooking);
		} catch (error: any) {
			if (error.message.includes("not found")) {
				return res.status(404).json({ message: error.message });
			}
			res.status(400).json({
				message: error.message || "Failed to update payment status",
			});
		}
	}

	/**
	 * Cancel booking
	 */
	async cancelBooking(req: Request, res: Response) {
		try {
			const bookingId = parseInt(req.params.id);
			const userId = (req as any).user?.id;

			if (!userId) {
				return res.status(401).json({
					message: "Unauthorized: User not found",
				});
			}

			const cancelledBooking = await BookingService.cancelBooking(
				bookingId,
				userId
			);

			res.status(200).json(cancelledBooking);
		} catch (error: any) {
			if (error.message.includes("permission")) {
				return res.status(403).json({ message: error.message });
			}
			if (error.message.includes("not found")) {
				return res.status(404).json({ message: error.message });
			}
			res.status(400).json({
				message: error.message || "Failed to cancel booking",
			});
		}
	}

	/**
	 * Confirm booking (seller action)
	 */
	async confirmBooking(req: Request, res: Response) {
		try {
			const bookingId = parseInt(req.params.id);
			const sellerId = (req as any).user?.id;

			if (!sellerId) {
				return res.status(401).json({
					message: "Unauthorized: User not found",
				});
			}

			const confirmedBooking = await BookingService.confirmBooking(
				bookingId,
				sellerId
			);

			res.status(200).json(confirmedBooking);
		} catch (error: any) {
			if (error.message.includes("permission")) {
				return res.status(403).json({ message: error.message });
			}
			if (error.message.includes("not found")) {
				return res.status(404).json({ message: error.message });
			}
			res.status(400).json({
				message: error.message || "Failed to confirm booking",
			});
		}
	}

	/**
	 * Reject booking (seller action)
	 */
	async rejectBooking(req: Request, res: Response) {
		try {
			const bookingId = parseInt(req.params.id);
			const sellerId = (req as any).user?.id;

			if (!sellerId) {
				return res.status(401).json({
					message: "Unauthorized: User not found",
				});
			}

			const rejectedBooking = await BookingService.rejectBooking(
				bookingId,
				sellerId
			);

			res.status(200).json(rejectedBooking);
		} catch (error: any) {
			if (error.message.includes("permission")) {
				return res.status(403).json({ message: error.message });
			}
			if (error.message.includes("not found")) {
				return res.status(404).json({ message: error.message });
			}
			res.status(400).json({
				message: error.message || "Failed to reject booking",
			});
		}
	}

	/**
	 * Complete booking
	 */
	async completeBooking(req: Request, res: Response) {
		try {
			const bookingId = parseInt(req.params.id);
			const userId = (req as any).user?.id;

			if (!userId) {
				return res.status(401).json({
					message: "Unauthorized: User not found",
				});
			}

			const completedBooking = await BookingService.completeBooking(
				bookingId,
				userId
			);

			res.status(200).json(completedBooking);
		} catch (error: any) {
			if (error.message.includes("permission")) {
				return res.status(403).json({ message: error.message });
			}
			if (error.message.includes("not found")) {
				return res.status(404).json({ message: error.message });
			}
			res.status(400).json({
				message: error.message || "Failed to complete booking",
			});
		}
	}

	/**
	 * Refund booking
	 */
	async refundBooking(req: Request, res: Response) {
		try {
			const bookingId = parseInt(req.params.id);
			const sellerId = (req as any).user?.id;

			if (!sellerId) {
				return res.status(401).json({
					message: "Unauthorized: User not found",
				});
			}

			const refundedBooking = await BookingService.refundBooking(
				bookingId,
				sellerId
			);

			res.status(200).json(refundedBooking);
		} catch (error: any) {
			if (error.message.includes("permission")) {
				return res.status(403).json({ message: error.message });
			}
			if (error.message.includes("not found")) {
				return res.status(404).json({ message: error.message });
			}
			res.status(400).json({
				message: error.message || "Failed to refund booking",
			});
		}
	}

	/**
	 * Check booking availability
	 */
	async checkAvailability(req: Request, res: Response) {
		try {
			const { carId, startDate, endDate } = req.body;

			const isAvailable = await BookingService.checkBookingAvailability(
				carId,
				new Date(startDate),
				new Date(endDate)
			);

			res.status(200).json({ isAvailable });
		} catch (error: any) {
			res.status(400).json({
				message: error.message || "Failed to check availability",
			});
		}
	}

	/**
	 * Get upcoming bookings
	 */
	async getUpcomingBookings(req: Request, res: Response) {
		try {
			const userId = (req as any).user?.id;
			const { userType } = req.query;

			if (!userId) {
				return res.status(401).json({
					message: "Unauthorized: User not found",
				});
			}

			const bookings = await BookingService.getUpcomingBookings(
				userId,
				userType as "client" | "seller"
			);

			res.status(200).json(bookings);
		} catch (error: any) {
			res.status(500).json({
				message:
					error.message || "Failed to retrieve upcoming bookings",
			});
		}
	}

	/**
	 * Get booking statistics for seller
	 */
	async getSellerBookingStats(req: Request, res: Response) {
		try {
			const sellerId = (req as any).user?.id;

			if (!sellerId) {
				return res.status(401).json({
					message: "Unauthorized: User not found",
				});
			}

			const stats = await BookingService.getSellerBookingStats(sellerId);

			res.status(200).json(stats);
		} catch (error: any) {
			res.status(500).json({
				message:
					error.message || "Failed to retrieve booking statistics",
			});
		}
	}
}

const bookingController = new BookingController();
export default bookingController;
