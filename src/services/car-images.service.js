import { CarImageModel } from "../models/index.js";
export default {
	async createImages(carId, imagesUrls) {
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
