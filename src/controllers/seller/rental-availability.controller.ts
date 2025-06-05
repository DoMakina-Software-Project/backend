import { Request, Response } from "express";
import { RentalAvailabilityService } from "../../services";

export default {
	async addAvailability(req: Request, res: Response) {
		try {
			const { carId, periods } = req.body;
			await RentalAvailabilityService.addAvailability(carId, periods);
			res.status(200).json({
				message: "Availability added successfully",
			});
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "Error adding availability" });
		}
	},

	async removeAvailability(req: Request, res: Response) {
		try {
			const { carId, periods } = req.body;
			await RentalAvailabilityService.removeAvailability(carId, periods);
			res.status(200).json({
				message: "Availability removed successfully",
			});
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "Error removing availability" });
		}
	},

	async getAvailableDatesInRange(req: Request, res: Response) {
		try {
			const { carId, startDate, endDate } = req.body;
			const availability =
				await RentalAvailabilityService.getAvailableDatesInRange(
					Number(carId),
					new Date(startDate),
					new Date(endDate)
				);
			res.status(200).json(availability);
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "Error getting available dates" });
		}
	},
};
