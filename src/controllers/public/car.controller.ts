import { Request, Response } from "express";
import { CarService } from "../../services";

const CarController = {
	async getCarById(req: Request, res: Response): Promise<void> {
		try {
			const { id } = req.params;
			const car = await CarService.getCarById(Number(id));
			if (!car) {
				res.status(404).json({ message: "Car not found" });
				return;
			}

			res.status(200).json(car);
		} catch (error: any) {
			console.error(`CarController.getCarById error: ${error}`);
			res.status(500).json({ message: error.message });
		}
	},

	async searchCars(req: Request, res: Response): Promise<void> {
		try {
			const {
				minPrice = "0",
				maxPrice = "1000000",
				brandIds = [],
				page,
			} = req.query;

			const parsedBrandIds = Array.isArray(brandIds)
				? brandIds.map((id) => Number(id))
				: [];

			const cars = await CarService.searchCars({
				minPrice: Number(minPrice),
				maxPrice: Number(maxPrice),
				brandIds: parsedBrandIds,
				page: page ? Number(page) : undefined,
			});
			res.status(200).json(cars);
		} catch (error: any) {
			console.error(`CarController.searchCars error: ${error}`);
			res.status(500).json({ message: error.message });
		}
	},

	async getFiveLatestPromotionCars(_: Request, res: Response): Promise<void> {
		try {
			const cars = await CarService.getFiveLatestPromotionCars();
			res.status(200).json(cars);
		} catch (error: any) {
			console.error(
				`CarController.getFiveLatestPromotionCars error: ${error}`
			);
			res.status(500).json({ message: error.message });
		}
	},

	async getHomePageCars(_: Request, res: Response): Promise<void> {
		try {
			const cars = await CarService.getHomePageCars();
			res.status(200).json(cars);
		} catch (error: any) {
			console.error(`CarController.getHomePageCars error: ${error}`);
			res.status(500).json({ message: error.message });
		}
	},

	async getCarsByIds(req: Request, res: Response): Promise<void> {
		try {
			const { ids = [] } = req.query;
			const parsedIds = Array.isArray(ids)
				? ids.map((id) => Number(id))
				: [];

			const cars = await CarService.getCarsByIds(parsedIds);
			res.status(200).json(cars);
		} catch (error: any) {
			console.error(`CarController.getCarsByIds error: ${error}`);
			res.status(500).json({ message: error.message });
		}
	},
};

export default CarController;
