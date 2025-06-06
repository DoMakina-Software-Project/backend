import { CarModel, CarImageModel, BrandModel, PromotionModel } from "../models";
import { Op, InferAttributes } from "sequelize";
import { CarImageService, PromotionService } from ".";

type Car = InferAttributes<CarModel>;
type CarImage = InferAttributes<CarImageModel>;
type Brand = InferAttributes<BrandModel>;
type Promotion = InferAttributes<PromotionModel>;

type CarWithRelations = Car & {
	CarImages?: CarImage[];
	Brand?: Brand;
};

type CarResponse = Omit<Car, "CarImages" | "Brand"> & {
	images: string[];
	brand: string;
	promoted?: boolean;
};

type SearchCarsParams = {
	minPrice?: number;
	maxPrice?: number;
	brandIds?: number[];
	page?: number;
	listingType?: "SALE" | "RENT";
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
	price?: number;
	status?: "ACTIVE" | "HIDDEN" | "SOLD";
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
		brandIds = [],
		page = 1,
		listingType = "SALE",
	}: SearchCarsParams) {
		try {
			const limit = 10;
			const offset = (page - 1) * limit;

			const where: any = {
				status: "ACTIVE",
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

			if (brandIds && brandIds.length > 0) {
				where.brandId = {
					[Op.in]: brandIds,
				};
			}

			const cars = await CarModel.findAndCountAll({
				where,
				limit,
				offset,
				include: [{ model: CarImageModel }, { model: BrandModel }],
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

	async updateCar(
		id: number,
		{ price, status }: UpdateCarParams
	): Promise<Car> {
		try {
			const car = await CarModel.findByPk(id);
			if (!car) throw new Error(`Car with ID ${id} not found.`);

			if (price !== undefined) car.price = price;
			if (status !== undefined) car.status = status;
			car.updatedAt = new Date();

			await car.save();

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

			if (carIds.length === 0) return [];

			const cars = await CarModel.findAll({
				where: {
					id: {
						[Op.in]: carIds,
					},
					status: "ACTIVE",
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
				return { ...rest, images, brand: Brand?.name || "" };
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
			return await CarModel.count();
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
				},
			});
		} catch (error) {
			console.error(
				`carModelService.getCountOfSoldCars() error: ${error}`
			);
			throw error;
		}
	},
};

export default CarService;
