import { ValidationChain, body } from "express-validator";

// Define allowed cities
const ALLOWED_CITIES = [
	"Bajram Curri",
	"Bajze",
	"Ballsh",
	"Berat",
	"Bilisht",
	"Bulqize",
	"Burrel",
	"Cerrik",
	"Corovode",
	"Delvine",
	"Divjake",
	"Durres",
	"Elbasan",
	"Erseke",
	"Fier",
	"Fierze",
	"Finiq",
	"Fushe-Arrez",
	"Fushe-Kruje",
	"Gjirokaster",
	"Gramsh",
	"Himare",
	"Kamez",
	"Kavaje",
	"Kelcyre",
	"Klos",
	"Konispol",
	"Koplik",
	"Korce",
	"Kraste",
	"Krrabe",
	"Kruje",
	"Krume",
	"Ksamil",
	"Kucove",
	"Kukes",
	"Kurbnesh",
	"Lac",
	"Leskovik",
	"Lezhe",
	"Libohove",
	"Librazhd",
	"Lushnje",
	"Maliq",
	"Mamurras",
	"Manez",
	"Memaliaj",
	"Milot",
	"Orikum",
	"Patos",
	"Peqin",
	"Permet",
	"Peshkopi",
	"Pogradec",
	"Polican",
	"Prrenjas",
	"Puke",
	"Reps",
	"Roskovec",
	"Rreshen",
	"Rrogozhine",
	"Rubik",
	"Sarande",
	"Selenice",
	"Shengjin",
	"Shijak",
	"Shkoder",
	"Sukth",
	"Tepelene",
	"Theth",
	"Tirana",
	"Ulez",
	"Ura Vajgurore",
	"Vau i Dejes",
	"Vithkuq",
	"Vlore",
	"Vore"
]; // You can modify this list as needed

interface SellerProfileValidator {
	createSellerProfile: ValidationChain[];
}

const SellerProfileValidator: SellerProfileValidator = {
	createSellerProfile: [
		body("country")
			.trim()
			.notEmpty()
			.withMessage("Country is required")
			.isString()
			.withMessage("Country must be a string")
			.custom((value) => {
				if (value.toLowerCase() !== "albania") {
					throw new Error("Only Albania is accepted as country");
				}
				return true;
			}),
		body("city")
			.trim()
			.notEmpty()
			.withMessage("City is required")
			.isString()
			.withMessage("City must be a string")
			.custom((city: string) => {
				if (!ALLOWED_CITIES.includes(city)) {
					throw new Error(`Invalid city: ${city}. Only cities in Albania are accepted`);
				}
				return true;
			}),
	],
};

export default SellerProfileValidator;
