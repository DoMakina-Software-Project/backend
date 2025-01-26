import { CarService } from "../../services/index.js";

export default {
	async updateCar(req, res) {
		try {
			const { id } = req.params;
			const { price, isSold } = req.body;

			const car = await CarService.updateCar(id, { price, isSold });
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
};
