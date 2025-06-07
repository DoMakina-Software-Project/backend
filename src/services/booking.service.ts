import { Op } from "sequelize";
import {
	CarModel,
	UserModel,
	BrandModel,
	BookingModel,
	CarImageModel,
} from "../models";
import { RentalAvailabilityService } from ".";
import type { InferAttributes } from "sequelize";

type Booking = InferAttributes<BookingModel>;
type User = InferAttributes<UserModel>;
type UserWithoutSensitiveData = Pick<User, "id" | "name" | "email">;
type CarImage = InferAttributes<CarImageModel>;
type Car = InferAttributes<CarModel>;
type Brand = InferAttributes<BrandModel>;

type CarWithBrand = Car & {
	Brand: Brand;
};

type BookingWithCarAndClient = Booking & {
	Car: CarWithBrand;
	User: UserWithoutSensitiveData;
};

type BookingWithCarAndSeller = Booking & {
	Car: CarWithBrand & {
		User: UserWithoutSensitiveData;
		CarImages: CarImage[];
	};
};

type BookingWithClientAndCarSeller = BookingWithCarAndSeller & {
	User: UserWithoutSensitiveData;
};

type CreateBookingData = {
	carId: number;
	clientId: number;
	startDate: Date;
	endDate: Date;
	paymentMethod?: "PAYPAL" | "CASH";
};

interface UpdateBookingStatusData {
	bookingId: number;
	status:
		| "PENDING"
		| "CONFIRMED"
		| "CANCELLED"
		| "COMPLETED"
		| "REJECTED"
		| "EXPIRED";
	updatedBy: number;
}

interface UpdatePaymentStatusData {
	bookingId: number;
	paymentStatus: "PENDING" | "PAID" | "REFUNDED" | "FAILED";
	paymentMethod?: "PAYPAL" | "CASH";
}

const BookingService = {
	/**
	 * Create a new booking
	 */
	async createBooking(data: CreateBookingData): Promise<Booking> {
		const { carId, clientId, startDate, endDate, paymentMethod } = data;

		// Check if car exists and is available for rent
		const car = await CarModel.findByPk(carId);

		if (!car) {
			throw new Error("Car not found");
		}

		if (car.listingType !== "RENT") {
			throw new Error("Car is not available for rent");
		}

		if (car.sellerId === clientId) {
			throw new Error("You cannot book your own car");
		}

		// Check if dates are available
		const isAvailable = await RentalAvailabilityService.isAvailable(
			carId,
			startDate,
			endDate
		);

		if (!isAvailable) {
			throw new Error("Car is not available for the selected dates");
		}

		// Check for conflicting bookings
		const conflictingBookings = await BookingModel.findAll({
			where: {
				carId,
				status: {
					[Op.in]: ["PENDING", "CONFIRMED"],
				},
				[Op.or]: [
					{
						startDate: { [Op.between]: [startDate, endDate] },
					},
					{
						endDate: { [Op.between]: [startDate, endDate] },
					},
					{
						startDate: { [Op.lte]: startDate },
						endDate: { [Op.gte]: endDate },
					},
				],
			},
		});

		if (conflictingBookings.length > 0) {
			throw new Error("Car is already booked for the selected dates");
		}

		// Calculate total price
		const totalPrice = BookingService.calculateTotalPrice(
			car.price,
			startDate,
			endDate
		);

		// Create booking
		const booking = await BookingModel.create({
			carId,
			clientId,
			startDate,
			endDate,
			totalPrice,
			paymentMethod: paymentMethod || "CASH",
			status: "PENDING",
			paymentStatus: "PENDING",
		});

		return booking.toJSON();
	},

	/**
	 * Get booking by ID with all related data
	 */
	async getBookingById(
		bookingId: number
	): Promise<BookingWithClientAndCarSeller> {
		const booking = await BookingModel.findByPk(bookingId, {
			include: [
				{
					model: CarModel,
					include: [
						{ model: BrandModel },
						{
							model: UserModel,
							attributes: ["id", "name", "email"],
						},
						{
							model: CarImageModel,
						},
					],
				},
				{
					model: UserModel,
					attributes: ["id", "name", "email"],
				},
			],
		});

		if (!booking) {
			throw new Error("Booking not found");
		}

		return booking.toJSON() as BookingWithClientAndCarSeller;
	},

	/**
	 * Get bookings for a client (user who made bookings)
	 */
	async getClientBookings(
		clientId: number,
		status?: string
	): Promise<
		(Booking & {
			Car: CarWithBrand & {
				User: UserWithoutSensitiveData;
				images: string[];
			};
		})[]
	> {
		const whereClause: any = { clientId };

		if (status) {
			whereClause.status = status;
		}

		const bookings = await BookingModel.findAll({
			where: whereClause,
			include: [
				{
					model: CarModel,
					include: [
						{ model: BrandModel },
						{
							model: UserModel,
							attributes: ["id", "name", "email"],
						},
						{
							model: CarImageModel,
						},
					],
				},
			],
			order: [["createdAt", "DESC"]],
		});

		const bookingsWithImages = bookings.map((booking) => {
			const bookingData: BookingWithCarAndSeller = booking.toJSON();
			const images: string[] = [];
			bookingData.Car.CarImages.forEach((image) => {
				images.push(image.url);
			});

			const { CarImages, ...car } = bookingData.Car;

			return {
				...bookingData,
				Car: {
					...car,
					images,
				},
			};
		});

		return bookingsWithImages;
	},

	/**
	 * Get bookings for a seller (car owner)
	 */
	async getSellerBookings(
		sellerId: number,
		status?: string
	): Promise<BookingWithCarAndClient[]> {
		const whereClause: any = {};

		if (status) {
			whereClause.status = status;
		}

		const bookings = await BookingModel.findAll({
			where: whereClause,
			include: [
				{
					model: CarModel,
					where: { sellerId },
					include: [{ model: BrandModel }],
				},
				{
					model: UserModel,
					attributes: ["id", "name", "email"],
				},
			],
			order: [["createdAt", "DESC"]],
		});

		return bookings.map((booking) => booking.toJSON());
	},

	/**
	 * Update booking status
	 */
	async updateBookingStatus(
		data: UpdateBookingStatusData
	): Promise<BookingWithClientAndCarSeller> {
		const { bookingId, status, updatedBy } = data;

		const booking = await BookingService.getBookingById(bookingId);

		// Check permissions - only client or car owner can update
		const car = booking.Car;
		if (booking.clientId !== updatedBy && car.sellerId !== updatedBy) {
			throw new Error("You don't have permission to update this booking");
		}

		// Validate status transitions
		BookingService.validateStatusTransition(
			booking.status,
			status,
			updatedBy,
			booking.clientId,
			car.sellerId
		);

		await BookingModel.update({ status }, { where: { id: bookingId } });

		return BookingService.getBookingById(bookingId);
	},

	/**
	 * Update payment status
	 */
	async updatePaymentStatus(
		data: UpdatePaymentStatusData
	): Promise<BookingWithClientAndCarSeller> {
		const { bookingId, paymentStatus, paymentMethod } = data;

		const updateData: any = { paymentStatus };

		if (paymentMethod) {
			updateData.paymentMethod = paymentMethod;
		}

		await BookingModel.update(updateData, { where: { id: bookingId } });

		return BookingService.getBookingById(bookingId);
	},

	/**
	 * Cancel booking
	 */
	async cancelBooking(
		bookingId: number,
		userId: number
	): Promise<BookingWithClientAndCarSeller> {
		return BookingService.updateBookingStatus({
			bookingId,
			status: "CANCELLED",
			updatedBy: userId,
		});
	},

	/**
	 * Confirm booking (seller action)
	 */
	async confirmBooking(
		bookingId: number,
		sellerId: number
	): Promise<BookingWithClientAndCarSeller> {
		return BookingService.updateBookingStatus({
			bookingId,
			status: "CONFIRMED",
			updatedBy: sellerId,
		});
	},

	/**
	 * Reject booking (seller action)
	 */
	async rejectBooking(
		bookingId: number,
		sellerId: number
	): Promise<BookingWithClientAndCarSeller> {
		return BookingService.updateBookingStatus({
			bookingId,
			status: "REJECTED",
			updatedBy: sellerId,
		});
	},

	/**
	 * Complete booking
	 */
	async completeBooking(
		bookingId: number,
		userId: number
	): Promise<BookingWithClientAndCarSeller> {
		return BookingService.updateBookingStatus({
			bookingId,
			status: "COMPLETED",
			updatedBy: userId,
		});
	},

	/**
	 * Get bookings for a specific car
	 */
	async getCarBookings(
		carId: number,
		status?: string
	): Promise<(Booking & { User: UserWithoutSensitiveData })[]> {
		const whereClause: any = { carId };

		if (status) {
			whereClause.status = status;
		}

		const bookings = await BookingModel.findAll({
			where: whereClause,
			include: [
				{
					model: UserModel,
					attributes: ["id", "name", "email"],
				},
			],
			order: [["startDate", "ASC"]],
		});

		return bookings.map((booking) => booking.toJSON());
	},

	/**
	 * Get upcoming bookings
	 */
	async getUpcomingBookings(
		userId: number,
		userType: "client" | "seller"
	): Promise<any[]> {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		let whereClause: any = {
			startDate: { [Op.gte]: today },
			status: { [Op.in]: ["PENDING", "CONFIRMED"] },
		};

		let includeClause: any[] = [];

		if (userType === "client") {
			whereClause.clientId = userId;
			includeClause = [
				{
					model: CarModel,
					include: [
						{ model: BrandModel },
						{
							model: UserModel,
							attributes: ["id", "name", "email"],
						},
					],
				},
			];
		} else {
			includeClause = [
				{
					model: CarModel,
					where: { sellerId: userId },
					include: [{ model: BrandModel }],
				},
				{
					model: UserModel,
					attributes: ["id", "name", "email"],
				},
			];
		}

		const bookings = await BookingModel.findAll({
			where: whereClause,
			include: includeClause,
			order: [["startDate", "ASC"]],
		});

		return bookings.map((booking) => booking.toJSON());
	},

	/**
	 * Expire old pending bookings
	 */
	async expirePendingBookings(): Promise<[number]> {
		const expireDate = new Date();
		expireDate.setHours(expireDate.getHours() - 24); // Expire after 24 hours

		const expiredBookings = await BookingModel.update(
			{ status: "EXPIRED" },
			{
				where: {
					status: "PENDING",
					createdAt: { [Op.lt]: expireDate },
				},
			}
		);

		return expiredBookings;
	},

	/**
	 * Get booking statistics for a seller
	 */
	async getSellerBookingStats(sellerId: number): Promise<{
		totalBookings: number;
		confirmedBookings: number;
		completedBookings: number;
		totalRevenue: number;
	}> {
		const totalBookings = await BookingModel.count({
			include: [
				{
					model: CarModel,
					where: { sellerId },
					attributes: [],
				},
			],
		});

		const confirmedBookings = await BookingModel.count({
			where: { status: "CONFIRMED" },
			include: [
				{
					model: CarModel,
					where: { sellerId },
					attributes: [],
				},
			],
		});

		const completedBookings = await BookingModel.count({
			where: { status: "COMPLETED" },
			include: [
				{
					model: CarModel,
					where: { sellerId },
					attributes: [],
				},
			],
		});

		const revenueBookings = await BookingModel.findAll({
			where: {
				status: { [Op.in]: ["COMPLETED", "CONFIRMED"] },
				paymentStatus: "PAID",
			},
			include: [
				{
					model: CarModel,
					where: { sellerId },
					attributes: [],
				},
			],
			attributes: ["totalPrice"],
		});

		const totalRevenue = revenueBookings.reduce(
			(sum, booking) => sum + parseFloat(booking.totalPrice.toString()),
			0
		);

		return {
			totalBookings,
			confirmedBookings,
			completedBookings,
			totalRevenue: totalRevenue || 0,
		};
	},

	/**
	 * Check if dates are available for booking
	 */
	async checkBookingAvailability(
		carId: number,
		startDate: Date,
		endDate: Date,
		excludeBookingId?: number
	): Promise<boolean> {
		// Check rental availability
		const isAvailable = await RentalAvailabilityService.isAvailable(
			carId,
			startDate,
			endDate
		);

		if (!isAvailable) {
			return false;
		}

		// Check for conflicting bookings
		const whereClause: any = {
			carId,
			status: { [Op.in]: ["PENDING", "CONFIRMED"] },
			[Op.or]: [
				{
					startDate: { [Op.between]: [startDate, endDate] },
				},
				{
					endDate: { [Op.between]: [startDate, endDate] },
				},
				{
					startDate: { [Op.lte]: startDate },
					endDate: { [Op.gte]: endDate },
				},
			],
		};

		if (excludeBookingId) {
			whereClause.id = { [Op.ne]: excludeBookingId };
		}

		const conflictingBookings = await BookingModel.findAll({
			where: whereClause,
		});

		return conflictingBookings.length === 0;
	},

	/**
	 * Calculate total price for booking
	 */
	calculateTotalPrice(
		dailyPrice: number,
		startDate: Date,
		endDate: Date
	): number {
		const start = new Date(startDate);
		const end = new Date(endDate);
		const diffTime = Math.abs(end.getTime() - start.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include both start and end dates

		return parseFloat((dailyPrice * diffDays).toFixed(2));
	},

	/**
	 * Validate status transitions
	 */
	validateStatusTransition(
		currentStatus: string,
		newStatus: string,
		updatedBy: number,
		clientId: number,
		sellerId: number
	) {
		const allowedTransitions: Record<string, string[]> = {
			PENDING: ["CONFIRMED", "REJECTED", "CANCELLED", "EXPIRED"],
			CONFIRMED: ["COMPLETED", "CANCELLED"],
			CANCELLED: [], // No transitions from cancelled
			COMPLETED: [], // No transitions from completed
			REJECTED: [], // No transitions from rejected
			EXPIRED: [], // No transitions from expired
		};

		if (!allowedTransitions[currentStatus]?.includes(newStatus)) {
			throw new Error(
				`Cannot change status from ${currentStatus} to ${newStatus}`
			);
		}

		// Check user permissions for specific transitions
		if (
			(newStatus === "CONFIRMED" || newStatus === "REJECTED") &&
			updatedBy !== sellerId
		) {
			throw new Error(
				"Only the car owner can confirm or reject bookings"
			);
		}

		if (
			newStatus === "CANCELLED" &&
			updatedBy !== clientId &&
			updatedBy !== sellerId
		) {
			throw new Error("Only the client or car owner can cancel bookings");
		}
	},
};

export default BookingService;
