import { CarModel } from "../models/index.js";

const CarService = {
  async getCarById(id) {
    try {
      const car = await CarModel.findByPk(id);
      return car ? car.toJSON() : null;
    } catch (error) {
      console.error(`carModelService.getCarById() error: ${error}`);
      throw error;
    }
  },

  async createCar({
    description,
    model,
    year,
    price,
    isSold,
    userId,
    brandId,
  }) {
    try {
      const newCarModel = await CarModel.create({
        description,
        model,
        year,
        price,
        isSold,
        userId,
        brandId,
      });

      return newCarModel ? newCarModel.toJSON() : null;
    } catch (error) {
      console.error(`carModelService.createCar() error: ${error}`);
      throw error;
    }
  },

  async findCarsByBrandId(brandId) {
    try {
      const cars = await CarModel.findAll({
        where: { brandId },
      });

      return cars.map((car) => car.toJSON());
    } catch (err) {
      console.error("Error finding cars by brand ID:", err);
      throw new Error("Unable to fetch cars for the given brand ID.");
    }
  },

  async findCarsByYear(year) {
    try {
      const cars = await CarModel.findAll({
        where: { year },
      });

      return cars.map((car) => car.toJSON());
    } catch (err) {
      console.error("Error finding cars by year:", err);
      throw new Error("Unable to fetch cars for the given year.");
    }
  },

  async updateCar(id, { price, isSold }) {
    try {
      const car = await CarModel.findByPk(id);
      if (!car) throw new Error(`Car with ID ${id} not found.`);

      car.price = price;
      car.isSold = isSold;
      car.updatedAt = new Date();
      await car.save();

      return car.toJSON();
    } catch (error) {
      console.error(`carModelService.updateCar() error: ${error}`);
      throw error;
    }
  },

  async deleteCar(id) {
    try {
      const result = await CarModel.destroy({
        where: { id },
      });

      return result > 0;
    } catch (err) {
      console.error("Error deleting car:", err);
      throw new Error("Unable to delete the car. Please try again later.");
    }
  },
};

export default CarService;
