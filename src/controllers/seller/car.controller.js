import { CarService } from "../../services/index.js";

export default {
	async getCar(req, res) {
		try {
			const id = req.params.id;
			const cars = await CarService.getCarById(id);
			res.status(200).json(cars);
		} catch (error) {
			console.error(`CarController.getCars() error: ${error}`);
			res.status(500).json({ message: error.message });
		}
	},

	async createCar(req, res) {
		try {
			const {
				model,
				year,
				price,
				description,
				brandId,
				mileage,
				fuelType,
				transmission,
				listingType,
			} = req.body;
			const userId = req.user.id;
			const imagesUrls = req.uploadedImages;

			const car = await CarService.createCar({
				sellerId: userId,
				brandId,
				model,
				year,
				price,
				description,
				mileage,
				fuelType,
				transmission,
				listingType,
				imagesUrls,
			});
			if (!car) {
				return res.status(400).json({ message: "Car not created." });
			}
			res.status(201).json(car);
		} catch (error) {
			console.error(`CarController.createCar() error: ${error}`);
			res.status(500).json({ message: error.message });
		}
	},

	async updateCar(req, res) {
		try {
			const { id } = req.params;
			const { price } = req.body;

			const car = await CarService.updateCar(id, { price });
			if (!car) {
				return res
					.status(404)
					.json({ message: `Car with ID ${id} not found.` });
			}
			res.status(200).json({
				message: `Car with ID ${id} updated successfully.`,
			});
		} catch (error) {
			console.error(`CarController.updateCar() error: ${error}`);
			res.status(500).json({ message: error.message });
		}
	},

	async deleteCar(req, res) {
		try {
			const id = req.params.id;
			if (!id) {
				return res.status(400).json({ message: "Car ID is required." });
			}

			const result = await CarService.deleteCar(id);
			if (!result) {
				return res
					.status(404)
					.json({ message: "Car has not been deleted." });
			}
			res.status(200).json(result);
		} catch (error) {
			console.error(`CarController.deleteCar() error: ${error}`);
			res.status(500).json({ message: error.message });
		}
	},
	async getUserCars(req, res) {
		try {
			const userId = req.user.id;

			const cars = await CarService.getUserCars(userId);
			res.status(200).json(cars);
		} catch (error) {
			console.error(`CarController.getUserCars() error: ${error}`);
			res.status(500).json({ message: error.message });
		}
	},

	async updateIsSold(req, res) {
		try {
			const { id } = req.params;
			const { status } = req.body;

			const car = await CarService.updateCar(id, { status });
			if (!car) {
				return res
					.status(404)
					.json({ message: `Car with ID ${id} not found.` });
			}
			res.status(200).json({
				message: `Updated successfully.`,
			});
		} catch (error) {
			console.error(`CarController.updateIsSold() error: ${error}`);
			res.status(500).json({ message: error.message });
		}
	},
	async deletePromotion(req, res) {
		try {
			const id = req.params.id;
			const car = await CarService.deletePromotion(id);
			if (!car) {
				return res
					.status(404)
					.json({ message: `Car with ID ${id} not found.` });
			}
			res.status(200).json({
				message: `Promoted is successfully deleted.`,
			});
		} catch (error) {
			console.error(`CarController.deletePromotion() error: ${error}`);
			res.status(500).json({ message: error.message });
		}
	},
};
