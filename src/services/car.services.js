import { CarModel, CarImageModel, BrandModel } from "../models/index.js";
import { Op } from "sequelize";
import { CarImageService, PromotionService } from "./index.js";

const CarService = {
	async getCarById(id) {
		try {
			const car = await CarModel.findByPk(id, {
				include: [
					{ model: CarImageModel },
					{
						model: BrandModel,
					},
				],
			});

			if (!car) return null;

			const { CarImages, Brand, ...rest } = car.toJSON();

			return {
				...rest,
				images: CarImages.map((image) => image.url),
				brand: Brand.name,
			};
		} catch (error) {
			console.error(`carModelService.getCarById() error: ${error}`);
			throw error;
		}
	},

	async createCar({
		description,
		model,
		year,
		price,
		isSold,
		userId,
		brandId,
		imagesUrls,
	}) {
		try {
			const newCarModel = await CarModel.create({
				description,
				model,
				year,
				price,
				isSold,
				userId,
				brandId,
			});
			const images = await CarImageService.createImages(
				newCarModel.id,
				imagesUrls
			);
			return newCarModel ? { ...newCarModel.toJSON(), images } : null;
		} catch (error) {
			console.error(`carModelService.createCar() error: ${error}`);
			throw error;
		}
	},

	async searchCars({ minPrice, maxPrice, brandIds = [], page = 1 }) {
		try {
			const limit = 10;
			const offset = (page - 1) * limit;

			const where = {
				isSold: false,
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
			if (brandIds) {
				where.brandId = {
					[Op.in]: brandIds,
				};
			}

			const cars = await CarModel.findAndCountAll({
				where,
				limit,
				offset,
			});

			return {
				results: cars.rows.map((car) => car.toJSON()),
				totalItems: cars.count,
				hasNextPage: limit * page < cars.count,
				totalPages: Math.ceil(cars.count / limit),
			};
		} catch (error) {
			console.error(`carModelService.searchCars() error: ${error}`);
			throw error;
		}
	},
	async updateCar(id, { price, isSold }) {
		try {
			const car = await CarModel.findByPk(id);
			if (!car) throw new Error(`Car with ID ${id} not found.`);

			car.price = price;
			car.isSold = isSold;
			car.updatedAt = new Date();
			await car.save();

			return car.toJSON();
		} catch (error) {
			console.error(`carModelService.updateCar() error: ${error}`);
			throw error;
		}
	},

	async deleteCar(id) {
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
	async getFiveLatestPromotionCars() {
		try {
			const promotions = await PromotionService.getFiveLatestPromotions();
			const carIds = promotions.map((promotion) => promotion.carId);

			const cars = await CarModel.findAll({
				where: {
					Id: {
						[Op.in]: carIds,
					},
				},
				include: [{ model: CarImageModel }],
			});
			return cars.map((car) => {
				const { CarImages, ...rest } = car.toJSON();
				const images = CarImages.map((image) => image.url);
				console.log(images);
				return { ...rest, images };
			});
		} catch (error) {
			console.error(
				`carModelService.getFiveLatestPromotionCars() error: ${error}`
			);
			throw error;
		}
	},

	async getHomePageCars() {
		try {
			const MAX_CARS = 6;

			const promotions = await PromotionService.getRandomPromotions(6);
			const carIds = promotions.map((promotion) => promotion.carId);

			const cars = await CarModel.findAll({
				where: {
					id: {
						[Op.in]: carIds,
					},
					isSold: false,
				},
				include: [
					{ model: CarImageModel },
					{
						model: BrandModel,
					},
				],
			});

			const existingIds = cars.map((car) => car.id);

			const remainingCars = await CarModel.findAll({
				where: {
					id: {
						[Op.notIn]: existingIds,
					},
					isSold: false,
				},
				limit: MAX_CARS - existingIds.length,
				include: [
					{ model: CarImageModel },
					{
						model: BrandModel,
					},
				],
			});

			const promotedCars = cars.map((car) => {
				const { CarImages, Brand, ...rest } = car.toJSON();
				const images = CarImages.map((image) => image.url);
				return { ...rest, images, brand: Brand.name, promoted: true };
			});

			const remainingCarsPromoted = remainingCars.map((car) => {
				const { CarImages, Brand, ...rest } = car.toJSON();
				const images = CarImages.map((image) => image.url);
				return { ...rest, images, brand: Brand.name };
			});

			return [...promotedCars, ...remainingCarsPromoted];
		} catch (error) {
			console.error(`carModelService.getHomePageCars() error: ${error}`);
			throw error;
		}
	},
};

export default CarService;
