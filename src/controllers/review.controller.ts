import { Request, Response } from "express";
import { ReviewService } from "../services";

class ReviewController {
	/**
	 * Create a new review
	 */
	async createReview(req: Request, res: Response) {
		try {
			const { carId, bookingId, rating, comment } = req.body;
			const userId = (req as any).user?.id;

			if (!userId) {
				return res.status(401).json({
					message: "Unauthorized: User not found",
				});
			}

			const review = await ReviewService.createReview({
				userId,
				carId,
				bookingId,
				rating,
				comment,
			});

			res.status(201).json(review);
		} catch (error: any) {
			res.status(400).json({
				message: error.message || "Failed to create review",
			});
		}
	}

	/**
	 * Get reviews for a car
	 */
	async getCarReviews(req: Request, res: Response) {
		try {
			const carId = parseInt(req.params.carId);
			const page = parseInt(req.query.page as string) || 1;
			const limit = parseInt(req.query.limit as string) || 10;

			const reviews = await ReviewService.getCarReviews({
				carId,
				page,
				limit,
			});

			res.status(200).json(reviews);
		} catch (error: any) {
			res.status(500).json({
				message: error.message || "Failed to retrieve reviews",
			});
		}
	}

	/**
	 * Check if user can review a booking
	 */
	async canReviewBooking(req: Request, res: Response) {
		try {
			const bookingId = parseInt(req.params.bookingId);
			const userId = (req as any).user?.id;

			if (!userId) {
				return res.status(401).json({
					message: "Unauthorized: User not found",
				});
			}

			const canReview = await ReviewService.canReviewBooking(
				bookingId,
				userId
			);

			res.status(200).json({ canReview });
		} catch (error: any) {
			res.status(500).json({
				message: error.message || "Failed to check review status",
			});
		}
	}

	/**
	 * Get car rating
	 */
	async getCarRating(req: Request, res: Response) {
		try {
			const carId = parseInt(req.params.carId);
			const rating = await ReviewService.getCarRating(carId);
			res.status(200).json(rating);
		} catch (error: any) {
			res.status(500).json({
				message: error.message || "Failed to get car rating",
			});
		}
	}
}

const reviewController = new ReviewController();
export default reviewController; 