import { Router } from "express";
import { StaffCarController } from "../../../controllers/staff";
import { CarValidator, throwValidationErrors } from "../validators";

const router = Router();

// Get unverified cars with pagination
router.get(
	"/unverified",
	CarValidator.getUnverifiedCars,
	throwValidationErrors,
	StaffCarController.getUnverifiedCars
);

// Get car details for verification
router.get(
	"/:id/verification",
	CarValidator.getCarForVerification,
	throwValidationErrors,
	StaffCarController.getCarForVerification
);

// Approve car
router.put(
	"/:id/approve",
	CarValidator.approveCar,
	throwValidationErrors,
	StaffCarController.approveCar
);

// Reject car
router.put(
	"/:id/reject",
	CarValidator.rejectCar,
	throwValidationErrors,
	StaffCarController.rejectCar
);

// Get verification statistics
router.get("/verification/stats", StaffCarController.getVerificationStats);

export default router;
