import { CarService } from "../../services/index.js";
export default {
	async getCarById(req, res) {
		try {
			const { id } = req.params;
			const car = await CarService.getCarById(id);
			if (!car) {
				return res.status(404).json({ message: "Car not found" });
			}

			return res.status(200).json(car);
		} catch (error) {
			console.error(`CarController.getCarById error: ${error}`);
			res.status(500).json({ message: error.message });
		}
	},

	async searchCars(req, res) {
		try {
			const {
				minPrice = 0,
				maxPrice = 1000000,
				brandIds = [],
				page,
			} = req.query;
			const parsedBrandIds = brandIds.map((id) => Number(id));
			const cars = await CarService.searchCars({
				minPrice,
				maxPrice,
				brandIds: parsedBrandIds,
				page,
			});
			return res.status(200).json(cars);
		} catch (error) {
			console.error(`CarController.searchCarss error: ${error}`);
			res.status(500).json({ message: error.message });
		}
	},

	async getFiveLatestPromotionCars(_, res) {
		try {
			const cars = await CarService.getFiveLatestPromotionCars();
			return res.status(200).json(cars);
		} catch (error) {
			console.error(
				`CarController.getFiveLatestPromotionCars error: ${error}`
			);
			res.status(500).json({ message: error.message });
		}
	},

	async getHomePageCars(_, res) {
		try {
			const cars = await CarService.getHomePageCars();
			return res.status(200).json(cars);
		} catch (error) {
			console.error(`CarController.getHomePageCars error: ${error}`);
			res.status(500).json({ message: error.message });
		}
	},
};
