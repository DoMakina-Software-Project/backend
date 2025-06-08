import { Request, Response } from "express";
import { CarService } from "../../services";

const StaffCarController = {
	/**
	 * Get unverified cars with pagination
	 */
	async getUnverifiedCars(req: Request, res: Response) {
		try {
			const page = parseInt(req.query.page as string) || 1;
			const limit = parseInt(req.query.limit as string) || 10;
			const status =
				(req.query.status as "PENDING" | "APPROVED" | "REJECTED") ||
				"PENDING";

			const result = await CarService.getUnverifiedCars({
				page,
				limit,
				status,
			});

			res.status(200).json(result);
		} catch (error: any) {
			res.status(500).json({
				message: error.message || "Failed to retrieve unverified cars",
			});
		}
	},

	/**
	 * Get car details for verification
	 */
	async getCarForVerification(req: Request, res: Response) {
		try {
			const carId = parseInt(req.params.id);

			const car = await CarService.getCarForVerification(carId);

			if (!car) {
				return res.status(404).json({
					message: "Car not found",
				});
			}

			res.status(200).json(car);
		} catch (error: any) {
			res.status(500).json({
				message: error.message || "Failed to retrieve car details",
			});
		}
	},

	/**
	 * Approve car
	 */
	async approveCar(req: Request, res: Response) {
		try {
			const carId = parseInt(req.params.id);
			const staffId = (req as any).user?.id;

			if (!staffId) {
				return res.status(401).json({
					message: "Unauthorized: Staff not found",
				});
			}

			const updatedCar = await CarService.updateVerificationStatus({
				carId,
				status: "APPROVED",
				verifiedBy: staffId,
			});

			res.status(200).json(updatedCar);
		} catch (error: any) {
			if (error.message.includes("not found")) {
				return res.status(404).json({ message: error.message });
			}
			res.status(400).json({
				message: error.message || "Failed to approve car",
			});
		}
	},

	/**
	 * Reject car
	 */
	async rejectCar(req: Request, res: Response) {
		try {
			const carId = parseInt(req.params.id);
			const { reason } = req.body;
			const staffId = (req as any).user?.id;

			if (!staffId) {
				return res.status(401).json({
					message: "Unauthorized: Staff not found",
				});
			}

			const updatedCar = await CarService.updateVerificationStatus({
				carId,
				status: "REJECTED",
				verifiedBy: staffId,
				rejectionReason: reason,
			});

			res.status(200).json(updatedCar);
		} catch (error: any) {
			if (error.message.includes("not found")) {
				return res.status(404).json({ message: error.message });
			}
			res.status(400).json({
				message: error.message || "Failed to reject car",
			});
		}
	},

	/**
	 * Get verification statistics
	 */
	async getVerificationStats(req: Request, res: Response) {
		try {
			const stats = await CarService.getVerificationStats();
			res.status(200).json(stats);
		} catch (error: any) {
			res.status(500).json({
				message:
					error.message || "Failed to retrieve verification stats",
			});
		}
	},
};

export default StaffCarController;
