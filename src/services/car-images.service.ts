import { CarImageModel } from "../models";
import { InferAttributes } from "sequelize";

type CarImage = InferAttributes<CarImageModel>;

export default {
	async createImages(
		carId: number,
		imagesUrls: string[]
	): Promise<CarImage[]> {
		try {
			const images = imagesUrls.map((url) => ({
				carId,
				url,
			}));

			const cars = await CarImageModel.bulkCreate(images);
			return cars.map((car) => car.toJSON());
		} catch (error) {
			console.error(`carImageService.createImages() error: ${error}`);
			throw error;
		}
	},
};
