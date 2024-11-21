import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
	res.send("Hello from public route");
});

router.get("/cars", (req, res) => {
	const cars = [
		{
			name: "1999 Toyota Corolla",
			type: "Sedan",
			photos: [
				"https://t4.ftcdn.net/jpg/05/37/32/57/360_F_537325726_GtgjRiyc37BLPn9OmisBVVZec9frLaL0.jpg",
			],
			price: "$20,000",
		},
		{
			name: "Toyota Corolla",
			type: "Sedan",
			photos: [
				"https://t4.ftcdn.net/jpg/05/37/32/57/360_F_537325726_GtgjRiyc37BLPn9OmisBVVZec9frLaL0.jpg",
			],
			price: "$20,000",
		},
		{
			name: "BMW 3 Series",
			type: "Sedan",
			photos: [
				"https://t4.ftcdn.net/jpg/05/37/32/57/360_F_537325726_GtgjRiyc37BLPn9OmisBVVZec9frLaL0.jpg",
			],
			price: "$20,000",
		},
		{
			name: "Mercedes Benz C-Class",
			type: "Sedan",
			photos: [
				"https://t4.ftcdn.net/jpg/05/37/32/57/360_F_537325726_GtgjRiyc37BLPn9OmisBVVZec9frLaL0.jpg",
			],
			price: "$10,000",
		},
	];

	res.status(200).json(cars);
});

export default router;
