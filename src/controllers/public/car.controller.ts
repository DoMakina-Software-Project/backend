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
				page,
				listingType = "SALE",
				startDate,
				endDate,
			} = req.query;

			const parsedBrandIds = Array.isArray(brandIds)
				? brandIds.map((id) => Number(id))
				: [];

			const cars = await CarService.searchCars({
				minPrice: minPrice ? Number(minPrice) : undefined,
				maxPrice: maxPrice ? Number(maxPrice) : undefined,
				minYear: minYear as string,
				maxYear: maxYear as string,
				minMileage: minMileage ? Number(minMileage) : undefined,
				maxMileage: maxMileage ? Number(maxMileage) : undefined,
				brandIds:
					parsedBrandIds.length > 0 ? parsedBrandIds : undefined,
				modelSearch: modelSearch as string,
				city: city as string,
				fuelType: fuelType as
					| "PETROL"
					| "DIESEL"
					| "ELECTRIC"
					| "HYBRID"
					| "OTHER",
				transmission: transmission as
					| "MANUAL"
					| "AUTOMATIC"
					| "SEMI_AUTOMATIC",
				page: page ? Number(page) : 1,
				listingType: listingType as "SALE" | "RENT",
				startDate: startDate as string,
				endDate: endDate as string,
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
