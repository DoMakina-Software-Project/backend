import { Op } from "sequelize";
import { ReviewModel, UserModel, BookingModel } from "../models";
import type { InferAttributes } from "sequelize";

type Review = InferAttributes<ReviewModel>;
type User = InferAttributes<UserModel>;

interface CreateReviewData {
	userId: number;
	carId: number;
	bookingId: number;
	rating: number;
	comment: string;
}

interface GetReviewsParams {
	carId?: number;
	page?: number;
	limit?: number;
}

const ReviewService = {
	/**
	 * Create a new review
	 */
	async createReview(data: CreateReviewData): Promise<Review> {
		const { userId, carId, bookingId, rating, comment } = data;

		// Check if booking exists and is completed
		const booking = await BookingModel.findByPk(bookingId);
		if (!booking) {
			throw new Error("Booking not found");
		}

		if (booking.status !== "COMPLETED") {
			throw new Error("Can only review completed bookings");
		}

		if (booking.clientId !== userId) {
			throw new Error("You can only review your own bookings");
		}

		if (booking.carId !== carId) {
			throw new Error("Car ID does not match the booking");
		}

		// Check if review already exists for this booking
		const existingReview = await ReviewModel.findOne({
			where: { bookingId },
		});

		if (existingReview) {
			throw new Error("You have already reviewed this booking");
		}

		// Create review
		const review = await ReviewModel.create({
			userId,
			carId,
			bookingId,
			rating,
			comment,
		});

		return review.toJSON();
	},

	/**
	 * Get reviews for a car with pagination
	 */
	async getCarReviews(params: GetReviewsParams) {
		const { carId, page = 1, limit = 10 } = params;

		const offset = (page - 1) * limit;

		const { count, rows } = await ReviewModel.findAndCountAll({
			where: { carId },
			include: [
				{
					model: UserModel,
					attributes: ["id", "name"],
				},
			],
			order: [["createdAt", "DESC"]],
			limit,
			offset,
		});

		const totalPages = Math.ceil(count / limit);
		const hasNextPage = page < totalPages;

		return {
			reviews: rows.map((review) => review.toJSON()),
			totalItems: count,
			currentPage: page,
			totalPages,
			hasNextPage,
		};
	},

	/**
	 * Check if user can review a booking
	 */
	async canReviewBooking(bookingId: number, userId: number): Promise<boolean> {
		const booking = await BookingModel.findOne({
			where: {
				id: bookingId,
				clientId: userId,
				status: "COMPLETED",
			},
		});

		if (!booking) {
			return false;
		}

		const existingReview = await ReviewModel.findOne({
			where: { bookingId },
		});

		return !existingReview;
	},

	/**
	 * Get average rating for a car
	 */
	async getCarRating(carId: number): Promise<{
		averageRating: number;
		totalReviews: number;
	}> {
		const reviews = await ReviewModel.findAll({
			where: { carId },
			attributes: ["rating"],
		});

		const totalReviews = reviews.length;
		if (totalReviews === 0) {
			return { averageRating: 0, totalReviews: 0 };
		}

		const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
		const averageRating = parseFloat((sum / totalReviews).toFixed(1));

		return { averageRating, totalReviews };
	},
};

export default ReviewService; 