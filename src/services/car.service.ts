import {
	CarModel,
	CarImageModel,
	BrandModel,
	PromotionModel,
	RentalAvailabilityModel,
	BookingModel,
	UserModel,
	SellerProfileModel,
} from "../models";
import { Op, InferAttributes, Sequelize } from "sequelize";
import { CarImageService, PromotionService } from ".";

type Car = InferAttributes<CarModel>;
type CarImage = InferAttributes<CarImageModel>;
type Brand = InferAttributes<BrandModel>;
type Promotion = InferAttributes<PromotionModel>;
type User = InferAttributes<UserModel>;

type CarWithRelations = Car & {
	CarImages?: CarImage[];
	Brand?: Brand;
	User?: Pick<User, "id" | "name" | "email">;
};

type CarResponse = Omit<Car, "CarImages" | "Brand"> & {
	images: string[];
	imageIds?: number[];
	brand: string;
	promoted?: boolean;
	rejectionReason?: string;
};

type CarVerificationResponse = Car & {
	images: string[];
	brand: string;
	seller: Pick<User, "id" | "name" | "email">;
	rejectionReason?: string;
};

type SearchCarsParams = {
	minPrice?: number;
	maxPrice?: number;
	minYear?: string;
	maxYear?: string;
	minMileage?: number;
	maxMileage?: number;
	brandIds?: number[];
	modelSearch?: string;
	city?: string;
	fuelType?: "PETROL" | "DIESEL" | "ELECTRIC" | "HYBRID" | "OTHER";
	transmission?: "MANUAL" | "AUTOMATIC" | "SEMI_AUTOMATIC";
	page?: number;
	listingType?: "SALE" | "RENT";
	startDate?: string;
	endDate?: string;
};

type CreateCarParams = {
	sellerId: number;
	brandId: number;
	model: string;
	year: string;
	price: number;
	description: string;
	mileage: number;
	fuelType: "PETROL" | "DIESEL" | "ELECTRIC" | "HYBRID" | "OTHER";
	transmission: "MANUAL" | "AUTOMATIC" | "SEMI_AUTOMATIC";
	listingType: "SALE" | "RENT";
	imagesUrls: string[];
};

type UpdateCarParams = {
	brandId?: number;
	model?: string;
	year?: string;
	price?: number;
	description?: string;
	mileage?: number;
	fuelType?: "PETROL" | "DIESEL" | "ELECTRIC" | "HYBRID" | "OTHER";
	transmission?: "MANUAL" | "AUTOMATIC" | "SEMI_AUTOMATIC";
	listingType?: "SALE" | "RENT";
	status?: "ACTIVE" | "HIDDEN" | "SOLD";
	newImagesUrls?: string[];
	removedImageIds?: number[];
};

type GetUnverifiedCarsParams = {
	page: number;
	limit: number;
	status: "PENDING" | "APPROVED" | "REJECTED";
};

type UpdateVerificationStatusParams = {
	carId: number;
	status: "APPROVED" | "REJECTED";
	verifiedBy: number;
	rejectionReason?: string;
};

const CarService = {
	async getCarById(id: number): Promise<CarResponse | null> {
		try {
			const car = await CarModel.findByPk(id, {
				include: [{ model: CarImageModel }, { model: BrandModel }],
			});

			if (!car) return null;

			const { CarImages, Brand, ...rest } =
				car.toJSON() as CarWithRelations;

			return {
				...rest,
				images: CarImages?.map((image) => image.url) || [],
				imageIds: CarImages?.map((image) => image.id) || [],
				brand: Brand?.name || "",
			};
		} catch (error) {
			console.error(`carModelService.getCarById() error: ${error}`);
			throw error;
		}
	},

	async createCar(params: CreateCarParams): Promise<CarResponse | null> {
		try {
			const newCarModel = await CarModel.create({
				sellerId: params.sellerId,
				brandId: params.brandId,
				model: params.model,
				year: params.year,
				price: params.price,
				description: params.description,
				mileage: params.mileage,
				fuelType: params.fuelType,
				transmission: params.transmission,
				listingType: params.listingType,
				status: "ACTIVE",
				verificationStatus: "PENDING",
			});

			const images = await CarImageService.createImages(
				newCarModel.id,
				params.imagesUrls
			);

			const brand = await BrandModel.findByPk(params.brandId);
			return newCarModel
				? {
						...newCarModel.toJSON(),
						images: images.map((img: CarImage) => img.url),
						brand: brand?.name || "",
				  }
				: null;
		} catch (error) {
			console.error(`carModelService.createCar() error: ${error}`);
			throw error;
		}
	},

	async searchCars({
		minPrice,
		maxPrice,
		minYear,
		maxYear,
		minMileage,
		maxMileage,
		brandIds = [],
		modelSearch,
		city,
		fuelType,
		transmission,
		page = 1,
		listingType = "SALE",
		startDate,
		endDate,
	}: SearchCarsParams) {
		try {
			const limit = 10;
			const offset = (page - 1) * limit;

			const where: any = {
				status: "ACTIVE",
				verificationStatus: "APPROVED", // Only show approved cars to clients
				listingType,
			};

			if (minPrice && maxPrice) {
				where.price = {
					[Op.between]: [minPrice, maxPrice],
				};
			} else if (minPrice) {
				where.price = {
					[Op.gte]: minPrice,
				};
			} else if (maxPrice) {
				where.price = {
					[Op.lte]: maxPrice,
				};
			}

			if (minYear && maxYear) {
				where.year = {
					[Op.between]: [minYear, maxYear],
				};
			} else if (minYear) {
				where.year = {
					[Op.gte]: minYear,
				};
			} else if (maxYear) {
				where.year = {
					[Op.lte]: maxYear,
				};
			}

			if (minMileage && maxMileage) {
				where.mileage = {
					[Op.between]: [minMileage, maxMileage],
				};
			} else if (minMileage) {
				where.mileage = {
					[Op.gte]: minMileage,
				};
			} else if (maxMileage) {
				where.mileage = {
					[Op.lte]: maxMileage,
				};
			}

			if (brandIds && brandIds.length > 0) {
				where.brandId = {
					[Op.in]: brandIds,
				};
			}

			if (modelSearch) {
				where[Op.and] = [
					...(where[Op.and] || []),
					Sequelize.where(
						Sequelize.fn("LOWER", Sequelize.col("model")),
						"LIKE",
						`%${modelSearch.toLowerCase()}%`
					),
				];
			}

			// City filtering will be handled through include

			if (fuelType) {
				where.fuelType = fuelType;
			}

			if (transmission) {
				where.transmission = transmission;
			}

			// For rental cars with date range, we need to filter by availability
			if (listingType === "RENT" && startDate && endDate) {
				// Get cars that have availability for the requested date range
				const availableCars = await RentalAvailabilityModel.findAll({
					where: {
						startDate: { [Op.lte]: startDate },
						endDate: { [Op.gte]: endDate },
					},
					attributes: ["carId"],
				});

				const availableCarIds = availableCars.map(
					(availability) => availability.carId
				);

				if (availableCarIds.length === 0) {
					return {
						results: [],
						totalItems: 0,
						hasNextPage: false,
						totalPages: 0,
					};
				}

				// Get cars that don't have conflicting bookings
				const conflictingBookings = await BookingModel.findAll({
					where: {
						carId: { [Op.in]: availableCarIds },
						status: { [Op.in]: ["PENDING", "CONFIRMED"] },
						[Op.or]: [
							{
								startDate: {
									[Op.between]: [startDate, endDate],
								},
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
					attributes: ["carId"],
				});

				const conflictingCarIds = conflictingBookings.map(
					(booking) => booking.carId
				);

				const finalAvailableCarIds = availableCarIds.filter(
					(carId) => !conflictingCarIds.includes(carId)
				);

				if (finalAvailableCarIds.length === 0) {
					return {
						results: [],
						totalItems: 0,
						hasNextPage: false,
						totalPages: 0,
					};
				}

				where.id = { [Op.in]: finalAvailableCarIds };
			}

			// Prepare include array
			const include: any[] = [
				{ model: CarImageModel },
				{ model: BrandModel },
			];

			// Add seller profile include for city filtering
			if (city) {
				include.push({
					model: UserModel,
					include: [
						{
							model: SellerProfileModel,
							where: { city },
							required: true,
						},
					],
					required: true,
					attributes: [], // We don't need User data in response
				});
			}

			const cars = await CarModel.findAndCountAll({
				where,
				limit,
				offset,
				include,
			});

			return {
				results: cars.rows.map((car) => {
					const { CarImages, Brand, ...rest } =
						car.toJSON() as CarWithRelations;
					const images = CarImages?.map((image) => image.url) || [];
					return { ...rest, images, brand: Brand?.name || "" };
				}),
				totalItems: cars.count,
				hasNextPage: limit * page < cars.count,
				totalPages: Math.ceil(cars.count / limit),
			};
		} catch (error) {
			console.error(`carModelService.searchCars() error: ${error}`);
			throw error;
		}
	},

	async updateCar(id: number, params: UpdateCarParams): Promise<Car> {
		try {
			const car = await CarModel.findByPk(id);
			if (!car) throw new Error(`Car with ID ${id} not found.`);

			// Update basic car fields
			if (params.brandId !== undefined) car.brandId = params.brandId;
			if (params.model !== undefined) car.model = params.model;
			if (params.year !== undefined) car.year = params.year;
			if (params.price !== undefined) car.price = params.price;
			if (params.description !== undefined)
				car.description = params.description;
			if (params.mileage !== undefined) car.mileage = params.mileage;
			if (params.fuelType !== undefined) car.fuelType = params.fuelType;
			if (params.transmission !== undefined)
				car.transmission = params.transmission;
			if (params.listingType !== undefined)
				car.listingType = params.listingType;
			if (params.status !== undefined) car.status = params.status;

			// Reset verification status to PENDING when car details are updated (except for status-only updates)
			const isContentUpdate =
				params.brandId !== undefined ||
				params.model !== undefined ||
				params.year !== undefined ||
				params.price !== undefined ||
				params.description !== undefined ||
				params.mileage !== undefined ||
				params.fuelType !== undefined ||
				params.transmission !== undefined ||
				params.listingType !== undefined ||
				params.newImagesUrls !== undefined ||
				params.removedImageIds !== undefined;

			if (isContentUpdate) {
				car.verificationStatus = "PENDING";
				car.rejectionReason = null; // Clear any previous rejection reason
			}

			car.updatedAt = new Date();
			await car.save();

			// Handle image updates
			// Remove specific images by ID if provided
			if (params.removedImageIds && params.removedImageIds.length > 0) {
				await CarImageModel.destroy({
					where: {
						id: { [Op.in]: params.removedImageIds },
						carId: id, // Ensure we only delete images belonging to this car
					},
				});
			}

			// Add new images if provided
			if (params.newImagesUrls && params.newImagesUrls.length > 0) {
				await CarImageService.createImages(id, params.newImagesUrls);
			}

			return car.toJSON();
		} catch (error) {
			console.error(`carModelService.updateCar() error: ${error}`);
			throw error;
		}
	},

	async deleteCar(id: number): Promise<boolean> {
		try {
			const result = await CarModel.destroy({
				where: { id },
			});

			return result > 0;
		} catch (err) {
			console.error("Error deleting car:", err);
			throw new Error(
				"Unable to delete the car. Please try again later."
			);
		}
	},

	async getFiveLatestPromotionCars(): Promise<CarResponse[]> {
		try {
			const promotions = await PromotionService.getFiveLatestPromotions();
			const carIds = promotions.map(
				(promotion: Promotion) => promotion.carId
			);

			const cars = await CarModel.findAll({
				where: {
					id: {
						[Op.in]: carIds,
					},
					status: "ACTIVE",
					verificationStatus: "APPROVED", // Only show approved cars
				},
				include: [{ model: CarImageModel }, { model: BrandModel }],
			});

			return cars.map((car) => {
				const { CarImages, Brand, ...rest } =
					car.toJSON() as CarWithRelations;
				const images = CarImages?.map((image) => image.url) || [];
				return { ...rest, images, brand: Brand?.name || "" };
			});
		} catch (error) {
			console.error(
				`carModelService.getFiveLatestPromotionCars() error: ${error}`
			);
			throw error;
		}
	},

	async getHomePageCars(): Promise<CarResponse[]> {
		try {
			const MAX_CARS = 6;

			const promotions = await PromotionService.getRandomPromotions(6);
			const carIds = promotions.map(
				(promotion: Promotion) => promotion.carId
			);

			const cars = await CarModel.findAll({
				where: {
					id: {
						[Op.in]: carIds,
					},
					status: "ACTIVE",
					verificationStatus: "APPROVED", // Only show approved cars
				},
				include: [{ model: CarImageModel }, { model: BrandModel }],
			});

			const existingIds = cars.map((car) => car.id);

			const remainingCars = await CarModel.findAll({
				where: {
					id: {
						[Op.notIn]: existingIds,
					},
					status: "ACTIVE",
					verificationStatus: "APPROVED", // Only show approved cars
				},
				limit: MAX_CARS - existingIds.length,
				include: [{ model: CarImageModel }, { model: BrandModel }],
			});

			const promotedCars = cars.map((car) => {
				const { CarImages, Brand, ...rest } =
					car.toJSON() as CarWithRelations;
				const images = CarImages?.map((image) => image.url) || [];
				return {
					...rest,
					images,
					brand: Brand?.name || "",
					promoted: true,
				};
			});

			const remainingCarsPromoted = remainingCars.map((car) => {
				const { CarImages, Brand, ...rest } =
					car.toJSON() as CarWithRelations;
				const images = CarImages?.map((image) => image.url) || [];
				return {
					...rest,
					images,
					brand: Brand?.name || "",
					promoted: false,
				};
			});

			return [...promotedCars, ...remainingCarsPromoted];
		} catch (error) {
			console.error(`carModelService.getHomePageCars() error: ${error}`);
			throw error;
		}
	},

	async getCarsByIds(ids: number[]): Promise<CarResponse[]> {
		try {
			const cars = await CarModel.findAll({
				where: {
					id: {
						[Op.in]: ids,
					},
					verificationStatus: "APPROVED", // Only show approved cars
				},
				include: [{ model: CarImageModel }, { model: BrandModel }],
			});

			return cars.map((car) => {
				const { CarImages, Brand, ...rest } =
					car.toJSON() as CarWithRelations;
				const images = CarImages?.map((image) => image.url) || [];
				return { ...rest, images, brand: Brand?.name || "" };
			});
		} catch (error) {
			console.error(`carModelService.getCarsByIds() error: ${error}`);
			throw error;
		}
	},

	async getUserCars(userId: number): Promise<CarResponse[]> {
		try {
			const cars = await CarModel.findAll({
				where: {
					sellerId: userId,
				},
				include: [{ model: CarImageModel }, { model: BrandModel }],
			});

			return cars.map((car) => {
				const { CarImages, Brand, ...rest } =
					car.toJSON() as CarWithRelations;
				const images = CarImages?.map((image) => image.url) || [];
				const imageIds = CarImages?.map((image) => image.id) || [];
				return { ...rest, images, imageIds, brand: Brand?.name || "" };
			});
		} catch (error) {
			console.error(`carModelService.getUserCars() error: ${error}`);
			throw error;
		}
	},

	async deletePromotion(id: number): Promise<boolean> {
		try {
			const result = await PromotionModel.destroy({
				where: { id },
			});

			return result > 0;
		} catch (error) {
			console.error(`carModelService.deletePromotion() error: ${error}`);
			throw error;
		}
	},

	async getCountOfCars(): Promise<number> {
		try {
			return await CarModel.count({
				where: {
					verificationStatus: "APPROVED", // Only count approved cars
				},
			});
		} catch (error) {
			console.error(`carModelService.getCountOfCars() error: ${error}`);
			throw error;
		}
	},

	async getCountOfSoldCars(): Promise<number> {
		try {
			return await CarModel.count({
				where: {
					status: "SOLD",
					verificationStatus: "APPROVED", // Only count approved cars
				},
			});
		} catch (error) {
			console.error(
				`carModelService.getCountOfSoldCars() error: ${error}`
			);
			throw error;
		}
	},

	// New verification methods
	async getUnverifiedCars({
		page,
		limit,
		status,
	}: GetUnverifiedCarsParams): Promise<{
		results: CarVerificationResponse[];
		totalItems: number;
		hasNextPage: boolean;
		totalPages: number;
	}> {
		try {
			const offset = (page - 1) * limit;

			const cars = await CarModel.findAndCountAll({
				where: {
					verificationStatus: status,
				},
				limit,
				offset,
				include: [
					{ model: CarImageModel },
					{ model: BrandModel },
					{
						model: UserModel,
						attributes: ["id", "name", "email"],
					},
				],
				order: [["createdAt", "DESC"]],
			});

			const results = cars.rows.map((car) => {
				const { CarImages, Brand, User, ...rest } =
					car.toJSON() as CarWithRelations;
				return {
					...rest,
					images: CarImages?.map((image) => image.url) || [],
					brand: Brand?.name || "",
					seller: User || { id: 0, name: "", email: "" },
				};
			});

			return {
				results,
				totalItems: cars.count,
				hasNextPage: limit * page < cars.count,
				totalPages: Math.ceil(cars.count / limit),
			};
		} catch (error) {
			console.error(
				`carModelService.getUnverifiedCars() error: ${error}`
			);
			throw error;
		}
	},

	async getCarForVerification(
		carId: number
	): Promise<CarVerificationResponse | null> {
		try {
			const car = await CarModel.findByPk(carId, {
				include: [
					{ model: CarImageModel },
					{ model: BrandModel },
					{
						model: UserModel,
						attributes: ["id", "name", "email"],
					},
				],
			});

			if (!car) return null;

			const { CarImages, Brand, User, ...rest } =
				car.toJSON() as CarWithRelations;

			return {
				...rest,
				images: CarImages?.map((image) => image.url) || [],
				brand: Brand?.name || "",
				seller: User || { id: 0, name: "", email: "" },
			};
		} catch (error) {
			console.error(
				`carModelService.getCarForVerification() error: ${error}`
			);
			throw error;
		}
	},

	async updateVerificationStatus({
		carId,
		status,
		verifiedBy,
		rejectionReason,
	}: UpdateVerificationStatusParams): Promise<Car> {
		try {
			const car = await CarModel.findByPk(carId);
			if (!car) throw new Error(`Car with ID ${carId} not found.`);

			car.verificationStatus = status;
			car.updatedAt = new Date();

			// Store rejection reason if the car is being rejected
			if (status === "REJECTED" && rejectionReason) {
				car.rejectionReason = rejectionReason;
			} else if (status === "APPROVED") {
				// Clear rejection reason if car is approved
				car.rejectionReason = null;
			}

			await car.save();

			return car.toJSON();
		} catch (error) {
			console.error(
				`carModelService.updateVerificationStatus() error: ${error}`
			);
			throw error;
		}
	},

	async getVerificationStats(): Promise<{
		pending: number;
		approved: number;
		rejected: number;
		total: number;
	}> {
		try {
			const [pending, approved, rejected, total] = await Promise.all([
				CarModel.count({ where: { verificationStatus: "PENDING" } }),
				CarModel.count({ where: { verificationStatus: "APPROVED" } }),
				CarModel.count({ where: { verificationStatus: "REJECTED" } }),
				CarModel.count(),
			]);

			return {
				pending,
				approved,
				rejected,
				total,
			};
		} catch (error) {
			console.error(
				`carModelService.getVerificationStats() error: ${error}`
			);
			throw error;
		}
	},

	async getSellerVerificationStats(sellerId: number): Promise<{
		pending: number;
		approved: number;
		rejected: number;
		total: number;
	}> {
		try {
			const [pending, approved, rejected, total] = await Promise.all([
				CarModel.count({
					where: {
						sellerId,
						verificationStatus: "PENDING",
					},
				}),
				CarModel.count({
					where: {
						sellerId,
						verificationStatus: "APPROVED",
					},
				}),
				CarModel.count({
					where: {
						sellerId,
						verificationStatus: "REJECTED",
					},
				}),
				CarModel.count({ where: { sellerId } }),
			]);

			return {
				pending,
				approved,
				rejected,
				total,
			};
		} catch (error) {
			console.error(
				`carModelService.getSellerVerificationStats() error: ${error}`
			);
			throw error;
		}
	},
};

export default CarService;
