import { Router } from "express";

const router = Router();

const cars = [
	{
		id: 1,
		name: "1999 Toyota Corolla",
		type: "Sedan",
		photos: [
			"https://t4.ftcdn.net/jpg/05/37/32/57/360_F_537325726_GtgjRiyc37BLPn9OmisBVVZec9frLaL0.jpg",
		],
		price: "$20,000",
	},
	{
		id: 2,
		name: "Toyota Corolla",
		type: "Sedan",
		photos: [
			"https://t4.ftcdn.net/jpg/05/37/32/57/360_F_537325726_GtgjRiyc37BLPn9OmisBVVZec9frLaL0.jpg",
		],
		price: "$20,000",
	},
	{
		id: 3,
		name: "BMW 3 Series",
		type: "Sedan",
		photos: [
			"https://t4.ftcdn.net/jpg/05/37/32/57/360_F_537325726_GtgjRiyc37BLPn9OmisBVVZec9frLaL0.jpg",
		],
		price: "$20,000",
	},
	{
		id: 4,
		name: "Mercedes Benz C-Class",
		type: "Sedan",
		photos: [
			"https://t4.ftcdn.net/jpg/05/37/32/57/360_F_537325726_GtgjRiyc37BLPn9OmisBVVZec9frLaL0.jpg",
		],
		price: "$10,000",
	},
];

router.get("/", (req, res) => {
	res.status(200).json({ message: "Welcome to the API" });
});

router.get("/cars", (req, res) => {
	res.status(200).json(cars);
});

router.get("/cars/:id", (req, res) => {
	const id = parseInt(req.params.id);
	console.log({ id });

	const car = cars.find((car) => car.id === id);

	if (!car) {
		res.status(404).json({ message: "Car not found" });
	} else {
		res.status(200).json(car);
	}
});

export default router;
