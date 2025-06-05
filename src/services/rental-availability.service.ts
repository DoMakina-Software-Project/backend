import RentalAvailability from "../models/rental-availability.model";
import { Op, Transaction } from "sequelize";
import sequelize from "../config/db";
import { addDays, subDays, compareAsc, max, startOfDay } from "date-fns";

interface DateRange {
	startDate: Date;
	endDate: Date;
}

interface AvailabilityPeriod extends DateRange {
	id?: number;
	carId: number;
}

class RentalAvailabilityService {
	/**
	 * Add availability periods for a car
	 * Handles merging overlapping and adjacent periods
	 */
	async addAvailability(
		carId: number,
		periods: DateRange[],
		transaction?: Transaction
	): Promise<void> {
		const t = transaction || (await sequelize.transaction());

		try {
			// Validate input
			this.validateDateRanges(periods);

			// Get existing availability periods for the car
			const existingPeriods = await RentalAvailability.findAll({
				where: { carId },
				order: [["startDate", "ASC"]],
				transaction: t,
			});

			// Convert to plain objects for easier manipulation
			const existingRanges: AvailabilityPeriod[] = existingPeriods.map(
				(p) => ({
					id: p.id,
					carId: p.carId,
					startDate: new Date(p.startDate),
					endDate: new Date(p.endDate),
				})
			);

			// Add new periods to existing ones
			const allRanges = [
				...existingRanges,
				...periods.map((p) => ({ carId, ...p })),
			];

			// Merge overlapping and adjacent ranges
			const mergedRanges = this.mergeOverlappingRanges(allRanges);

			// Delete all existing records and insert merged ones
			await RentalAvailability.destroy({
				where: { carId },
				transaction: t,
			});

			if (mergedRanges.length > 0) {
				await RentalAvailability.bulkCreate(
					mergedRanges.map((range) => ({
						carId,
						startDate: range.startDate,
						endDate: range.endDate,
					})),
					{ transaction: t }
				);
			}

			if (!transaction) {
				await t.commit();
			}
		} catch (error) {
			if (!transaction) {
				await t.rollback();
			}
			throw error;
		}
	}

	/**
	 * Remove availability periods for a car
	 * Handles partial overlaps by splitting ranges
	 */
	async removeAvailability(
		carId: number,
		periods: DateRange[],
		transaction?: Transaction
	): Promise<void> {
		const t = transaction || (await sequelize.transaction());

		try {
			// Validate input
			this.validateDateRanges(periods);

			// Get existing availability periods
			const existingPeriods = await RentalAvailability.findAll({
				where: { carId },
				order: [["startDate", "ASC"]],
				transaction: t,
			});

			let remainingRanges: DateRange[] = existingPeriods.map((p) => ({
				startDate: new Date(p.startDate),
				endDate: new Date(p.endDate),
			}));

			// Remove each period from existing ranges
			for (const periodToRemove of periods) {
				remainingRanges = this.subtractRangeFromRanges(
					remainingRanges,
					periodToRemove
				);
			}

			// Update database
			await RentalAvailability.destroy({
				where: { carId },
				transaction: t,
			});

			if (remainingRanges.length > 0) {
				await RentalAvailability.bulkCreate(
					remainingRanges.map((range) => ({
						carId,
						startDate: range.startDate,
						endDate: range.endDate,
					})),
					{ transaction: t }
				);
			}

			if (!transaction) {
				await t.commit();
			}
		} catch (error) {
			if (!transaction) {
				await t.rollback();
			}
			throw error;
		}
	}

	/**
	 * Check if a car is available for the specified date range
	 */
	async isAvailable(
		carId: number,
		startDate: Date,
		endDate: Date
	): Promise<boolean> {
		this.validateDateRange({ startDate, endDate });

		const availabilityPeriods = await RentalAvailability.findAll({
			where: {
				carId,
				startDate: { [Op.lte]: startDate },
				endDate: { [Op.gte]: endDate },
			},
		});

		return availabilityPeriods.length > 0;
	}

	/**
	 * Get all availability periods for a car
	 */
	async getAvailability(carId: number): Promise<DateRange[]> {
		const periods = await RentalAvailability.findAll({
			where: { carId },
			order: [["startDate", "ASC"]],
		});

		return periods.map((p) => ({
			startDate: new Date(p.startDate),
			endDate: new Date(p.endDate),
		}));
	}

	/**
	 * Get available dates within a specific range
	 */
	async getAvailableDatesInRange(
		carId: number,
		startDate: Date,
		endDate: Date
	): Promise<DateRange[]> {
		this.validateDateRange({ startDate, endDate });

		const periods = await RentalAvailability.findAll({
			where: {
				carId,
				[Op.or]: [
					{
						startDate: { [Op.between]: [startDate, endDate] },
					},
					{
						endDate: { [Op.between]: [startDate, endDate] },
					},
					{
						startDate: { [Op.lte]: startDate },
						endDate: { [Op.gte]: endDate },
					},
				],
			},
			order: [["startDate", "ASC"]],
		});

		return periods.map((p) => {
			const periodStart = new Date(p.startDate);
			const periodEnd = new Date(p.endDate);

			return {
				startDate: periodStart > startDate ? periodStart : startDate,
				endDate: periodEnd < endDate ? periodEnd : endDate,
			};
		});
	}

	/**
	 * Set complete availability for a car (replaces all existing availability)
	 */
	async setAvailability(
		carId: number,
		periods: DateRange[],
		transaction?: Transaction
	): Promise<void> {
		const t = transaction || (await sequelize.transaction());

		try {
			// Allow empty periods for setAvailability (to clear all availability)
			if (periods.length > 0) {
				this.validateDateRanges(periods);
			}

			// Merge overlapping ranges
			const mergedRanges = this.mergeOverlappingRanges(
				periods.map((p) => ({ carId, ...p }))
			);

			// Replace all existing availability
			await RentalAvailability.destroy({
				where: { carId },
				transaction: t,
			});

			if (mergedRanges.length > 0) {
				await RentalAvailability.bulkCreate(
					mergedRanges.map((range) => ({
						carId,
						startDate: range.startDate,
						endDate: range.endDate,
					})),
					{ transaction: t }
				);
			}

			if (!transaction) {
				await t.commit();
			}
		} catch (error) {
			if (!transaction) {
				await t.rollback();
			}
			throw error;
		}
	}

	/**
	 * Merge overlapping and adjacent date ranges
	 */
	private mergeOverlappingRanges(ranges: AvailabilityPeriod[]): DateRange[] {
		if (ranges.length === 0) return [];

		// Sort by start date using date-fns compareAsc
		const sorted = ranges.sort((a, b) =>
			compareAsc(a.startDate, b.startDate)
		);
		const merged: DateRange[] = [];

		let current = { ...sorted[0] };

		for (let i = 1; i < sorted.length; i++) {
			const next = sorted[i];

			// Check if ranges overlap or are adjacent (including same day)
			if (this.rangesOverlapOrAdjacent(current, next)) {
				// Merge ranges using date-fns max function
				current.endDate = max([current.endDate, next.endDate]);
			} else {
				// Add current range and start a new one
				merged.push({
					startDate: current.startDate,
					endDate: current.endDate,
				});
				current = { ...next };
			}
		}

		// Add the last range
		merged.push({
			startDate: current.startDate,
			endDate: current.endDate,
		});

		return merged;
	}

	/**
	 * Subtract a date range from an array of date ranges
	 */
	private subtractRangeFromRanges(
		ranges: DateRange[],
		rangeToSubtract: DateRange
	): DateRange[] {
		const result: DateRange[] = [];

		for (const range of ranges) {
			const subtracted = this.subtractRangeFromRange(
				range,
				rangeToSubtract
			);
			result.push(...subtracted);
		}

		return result;
	}

	/**
	 * Subtract one date range from another, returning the remaining ranges
	 * Using date-fns for reliable date arithmetic
	 */
	private subtractRangeFromRange(
		range: DateRange,
		toSubtract: DateRange
	): DateRange[] {
		// No overlap
		if (!this.rangesOverlap(range, toSubtract)) {
			return [range];
		}

		const result: DateRange[] = [];

		// If there's a part before the subtracted range
		if (compareAsc(range.startDate, toSubtract.startDate) < 0) {
			// Use date-fns subDays for reliable date arithmetic
			const endDateForFirstPart = subDays(toSubtract.startDate, 1);

			result.push({
				startDate: new Date(range.startDate),
				endDate: endDateForFirstPart,
			});
		}

		// If there's a part after the subtracted range
		if (compareAsc(range.endDate, toSubtract.endDate) > 0) {
			// Use date-fns addDays for reliable date arithmetic
			const startDateForSecondPart = addDays(toSubtract.endDate, 1);

			result.push({
				startDate: startDateForSecondPart,
				endDate: new Date(range.endDate),
			});
		}

		return result;
	}

	/**
	 * Check if two date ranges overlap or are adjacent
	 * Using date-fns for reliable date arithmetic
	 */
	private rangesOverlapOrAdjacent(
		range1: DateRange,
		range2: DateRange
	): boolean {
		// Adjacent ranges (including same day touching)
		// Use date-fns addDays for reliable arithmetic
		const range1EndPlusOne = addDays(range1.endDate, 1);
		const range2EndPlusOne = addDays(range2.endDate, 1);

		return (
			compareAsc(range1.startDate, range2EndPlusOne) <= 0 &&
			compareAsc(range2.startDate, range1EndPlusOne) <= 0
		);
	}

	/**
	 * Check if two date ranges overlap
	 */
	private rangesOverlap(range1: DateRange, range2: DateRange): boolean {
		return (
			compareAsc(range1.startDate, range2.endDate) <= 0 &&
			compareAsc(range2.startDate, range1.endDate) <= 0
		);
	}

	/**
	 * Validate a single date range
	 * Using date-fns for reliable date comparison
	 */
	private validateDateRange(range: DateRange): void {
		// Allow same start and end date for single day availability
		if (compareAsc(range.startDate, range.endDate) > 0) {
			throw new Error("Start date must be before or equal to end date");
		}

		// Use date-fns startOfDay for consistent day comparison
		const today = startOfDay(new Date());

		if (compareAsc(startOfDay(range.startDate), today) < 0) {
			throw new Error("Start date cannot be in the past");
		}
	}

	/**
	 * Validate multiple date ranges
	 */
	private validateDateRanges(ranges: DateRange[]): void {
		if (!ranges || ranges.length === 0) {
			throw new Error("At least one date range is required");
		}

		for (const range of ranges) {
			this.validateDateRange(range);
		}
	}
}

const rentalAvailabilityService = new RentalAvailabilityService();
export default rentalAvailabilityService;
