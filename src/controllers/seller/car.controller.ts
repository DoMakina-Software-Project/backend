import { Request, Response } from "express";
import { CarService } from "../../services";
import type { UserWithRoles } from "../../services/user.service";

interface SellerRequest extends Request {
	user: UserWithRoles;
	uploadedImages?: string[];
}

const SellerCarController = {
	async getCar(req: Request, res: Response): Promise<void> {
		try {
			const id = req.params.id;
			const cars = await CarService.getCarById(Number(id));
			res.status(200).json(cars);
		} catch (error: any) {
			console.error(`CarController.getCars() error: ${error}`);
			res.status(500).json({ message: error.message });
		}
	},

	async createCar(req: SellerRequest, res: Response): Promise<void> {
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
			const imagesUrls = req.uploadedImages ?? [];

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
				res.status(400).json({ message: "Car not created." });
				return;
			}
			res.status(201).json(car);
		} catch (error: any) {
			console.error(`CarController.createCar() error: ${error}`);
			res.status(500).json({ message: error.message });
		}
	},

	async updateCar(req: SellerRequest, res: Response): Promise<void> {
		try {
			const { id } = req.params;
			const {
				brandId,
				model,
				year,
				price,
				description,
				mileage,
				fuelType,
				transmission,
				listingType,
				status,
			} = req.body;

			// Prepare update parameters
			const updateParams: any = {};
			if (brandId !== undefined) updateParams.brandId = Number(brandId);
			if (model !== undefined) updateParams.model = model;
			if (year !== undefined) updateParams.year = year;
			if (price !== undefined) updateParams.price = Number(price);
			if (description !== undefined)
				updateParams.description = description;
			if (mileage !== undefined) updateParams.mileage = Number(mileage);
			if (fuelType !== undefined) updateParams.fuelType = fuelType;
			if (transmission !== undefined)
				updateParams.transmission = transmission;
			if (listingType !== undefined)
				updateParams.listingType = listingType;
			if (status !== undefined) updateParams.status = status;

			// Handle image updates
			const { removedImageIds } = req.body;

			// Add new images if uploaded
			if (req.uploadedImages && req.uploadedImages.length > 0) {
				updateParams.newImagesUrls = req.uploadedImages;
			}

			// Handle removed images by ID
			if (removedImageIds) {
				try {
					const parsedIds = JSON.parse(removedImageIds);
					if (Array.isArray(parsedIds) && parsedIds.length > 0) {
						updateParams.removedImageIds = parsedIds.map(
							(id: any) => Number(id)
						);
					}
				} catch (error) {
					console.error("Error parsing removedImageIds:", error);
				}
			}

			const car = await CarService.updateCar(Number(id), updateParams);
			if (!car) {
				res.status(404).json({
					message: `Car with ID ${id} not found.`,
				});
				return;
			}
			res.status(200).json({
				message: `Car with ID ${id} updated successfully.`,
			});
		} catch (error: any) {
			console.error(`CarController.updateCar() error: ${error}`);
			res.status(500).json({ message: error.message });
		}
	},

	async deleteCar(req: Request, res: Response): Promise<void> {
		try {
			const id = req.params.id;
			if (!id) {
				res.status(400).json({ message: "Car ID is required." });
				return;
			}

			const result = await CarService.deleteCar(Number(id));
			if (!result) {
				res.status(404).json({ message: "Car has not been deleted." });
				return;
			}
			res.status(200).json(result);
		} catch (error: any) {
			console.error(`CarController.deleteCar() error: ${error}`);
			res.status(500).json({ message: error.message });
		}
	},

	async getUserCars(req: SellerRequest, res: Response): Promise<void> {
		try {
			const userId = req.user.id;
			const cars = await CarService.getUserCars(userId);
			res.status(200).json(cars);
		} catch (error: any) {
			console.error(`CarController.getUserCars() error: ${error}`);
			res.status(500).json({ message: error.message });
		}
	},

	async updateIsSold(req: Request, res: Response): Promise<void> {
		try {
			const { id } = req.params;
			const { status } = req.body;

			const car = await CarService.updateCar(Number(id), { status });
			if (!car) {
				res.status(404).json({
					message: `Car with ID ${id} not found.`,
				});
				return;
			}
			res.status(200).json({
				message: `Updated successfully.`,
			});
		} catch (error: any) {
			console.error(`CarController.updateIsSold() error: ${error}`);
			res.status(500).json({ message: error.message });
		}
	},

	async deletePromotion(req: Request, res: Response): Promise<void> {
		try {
			const id = req.params.id;
			const car = await CarService.deletePromotion(Number(id));
			if (!car) {
				res.status(404).json({
					message: `Car with ID ${id} not found.`,
				});
				return;
			}
			res.status(200).json({
				message: `Promoted is successfully deleted.`,
			});
		} catch (error: any) {
			console.error(`CarController.deletePromotion() error: ${error}`);
			res.status(500).json({ message: error.message });
		}
	},

	async getVerificationStats(
		req: SellerRequest,
		res: Response
	): Promise<void> {
		try {
			const sellerId = req.user.id;
			const stats = await CarService.getSellerVerificationStats(sellerId);
			res.status(200).json(stats);
		} catch (error: any) {
			console.error(
				`CarController.getVerificationStats() error: ${error}`
			);
			res.status(500).json({ message: error.message });
		}
	},
};

export default SellerCarController;
