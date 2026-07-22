import {
	findLatestFullyAvailableShiftedPeriod,
	findSuggestedPeriodByMonth,
	shiftPeriodToLatestFullyPastYear,
	shiftPeriodToYear,
	type SuggestedPeriod,
} from '@features/(processes)/_utils/suggestedPeriods';

describe('findSuggestedPeriodByMonth', () => {
	const periods: SuggestedPeriod[] = [
		{ id: '2021-03-01_2021-07-31', startDate: '2021-03-01', endDate: '2021-07-31' },
		{ id: '2021-08-01_2021-10-31', startDate: '2021-08-01', endDate: '2021-10-31' },
		{ id: '2021-11-01_2022-02-28', startDate: '2021-11-01', endDate: '2022-02-28' },
	];

	it('matches a period by start/end month regardless of day', () => {
		// 15th of March -> 20th of July, any year -> still matches the Mar-Jul period
		const result = findSuggestedPeriodByMonth(periods, new Date(2024, 2, 15), new Date(2024, 6, 20));
		expect(result?.id).toBe('2021-03-01_2021-07-31');
	});

	it('returns undefined when no period shares the same start/end months', () => {
		// May -> May doesn't match any of the three seasons
		const result = findSuggestedPeriodByMonth(periods, new Date(2024, 4, 1), new Date(2024, 4, 31));
		expect(result).toBeUndefined();
	});

	it('ignores the year in the input dates', () => {
		const result = findSuggestedPeriodByMonth(periods, new Date(2030, 7, 1), new Date(2030, 9, 31));
		expect(result?.id).toBe('2021-08-01_2021-10-31');
	});

	it('returns undefined for an empty list', () => {
		expect(findSuggestedPeriodByMonth([], new Date(2024, 0, 1), new Date(2024, 11, 31))).toBeUndefined();
	});
});

describe('shiftPeriodToYear', () => {
	const period: SuggestedPeriod = {
		id: '2021-03-01_2021-07-31',
		startDate: '2021-03-01',
		endDate: '2021-07-31',
	};

	it('shifts to the requested year when the season is fully past in that year', () => {
		// Target 2024 is in the past relative to today (2026)
		const result = shiftPeriodToYear(period, 2024, new Date(2026, 6, 22));
		expect(result.shiftedStartDate.getFullYear()).toBe(2024);
		expect(result.shiftedEndDate.getFullYear()).toBe(2024);
	});

	it('clamps the target year down when it puts the season in the future', () => {
		// Target 2027 is in the future -> clamp to 2026? No, July 2026 not fully past yet -> 2025
		const result = shiftPeriodToYear(period, 2027, new Date(2026, 6, 22));
		expect(result.shiftedEndDate.getFullYear()).toBe(2025);
	});

	it('clamps the target year down to the current year when it is fully past', () => {
		// Target 2026 with today = Aug 5, 2026: July 2026 is fully past -> keep 2026
		const result = shiftPeriodToYear(period, 2026, new Date(2026, 7, 5));
		expect(result.shiftedStartDate.getFullYear()).toBe(2026);
		expect(result.shiftedEndDate.getFullYear()).toBe(2026);
	});

	it('preserves the year offset for year-crossing seasons', () => {
		const novFeb: SuggestedPeriod = {
			id: '2021-11-01_2022-02-28',
			startDate: '2021-11-01',
			endDate: '2022-02-28',
		};
		// Target 2024: shift to Nov 1 2023 -> Feb 29 2024 (leap year)
		const result = shiftPeriodToYear(novFeb, 2024, new Date(2026, 6, 22));
		expect(result.shiftedStartDate.getFullYear()).toBe(2023);
		expect(result.shiftedStartDate.getMonth()).toBe(10);
		expect(result.shiftedEndDate.getFullYear()).toBe(2024);
		expect(result.shiftedEndDate.getMonth()).toBe(1);
	});
});

describe('shiftPeriodToLatestFullyPastYear', () => {
	const period: SuggestedPeriod = {
		id: '2021-03-01_2021-07-31',
		startDate: '2021-03-01',
		endDate: '2021-07-31',
	};

	it('keeps the target year when the season has fully passed in the current year', () => {
		// Today = August 1, 2026 -> July 31, 2026 is fully past -> use 2026
		const result = shiftPeriodToLatestFullyPastYear(period, new Date(2026, 7, 1));
		expect(result.shiftedStartDate.getFullYear()).toBe(2026);
		expect(result.shiftedEndDate.getFullYear()).toBe(2026);
	});

	it('uses the previous year when the season end is in the current (incomplete) month', () => {
		// Today = July 22, 2026 -> July 2026 not fully past -> use 2025
		const result = shiftPeriodToLatestFullyPastYear(period, new Date(2026, 6, 22));
		expect(result.shiftedStartDate.getFullYear()).toBe(2025);
		expect(result.shiftedEndDate.getFullYear()).toBe(2025);
	});

	it('snaps to the first day of the start month and the last day of the end month', () => {
		const result = shiftPeriodToLatestFullyPastYear(period, new Date(2026, 7, 1));
		expect(result.shiftedStartDate.getMonth()).toBe(2); // March (0-indexed)
		expect(result.shiftedStartDate.getDate()).toBe(1);
		expect(result.shiftedEndDate.getMonth()).toBe(6); // July (0-indexed)
		expect(result.shiftedEndDate.getDate()).toBe(31);
	});

	it('normalises mid-month start/end dates to full month boundaries', () => {
		const midMonthPeriod: SuggestedPeriod = {
			id: '2021-03-15_2021-07-15',
			startDate: '2021-03-15',
			endDate: '2021-07-15',
		};
		const result = shiftPeriodToLatestFullyPastYear(midMonthPeriod, new Date(2026, 7, 1));
		expect(result.shiftedStartDate.getDate()).toBe(1);
		expect(result.shiftedStartDate.getMonth()).toBe(2);
		expect(result.shiftedEndDate.getDate()).toBe(31);
		expect(result.shiftedEndDate.getMonth()).toBe(6);
	});

	it('handles January correctly by falling back to December of the previous year', () => {
		// Today = January 15, 2026 -> December 2025 is the latest fully-past month
		// For a season ending in December, target = 2025
		const decPeriod: SuggestedPeriod = {
			id: '2021-11-01_2021-12-31',
			startDate: '2021-11-01',
			endDate: '2021-12-31',
		};
		const result = shiftPeriodToLatestFullyPastYear(decPeriod, new Date(2026, 0, 15));
		expect(result.shiftedEndDate.getFullYear()).toBe(2025);
		expect(result.shiftedEndDate.getMonth()).toBe(11); // December
		expect(result.shiftedEndDate.getDate()).toBe(31);
	});
});

describe('findLatestFullyAvailableShiftedPeriod', () => {
	// Typical seasons API response: all entries carry a baseline year (2021)
	// and represent a year-agnostic pattern. The function must year-shift to
	// the latest fully available year.
	const periods: SuggestedPeriod[] = [
		{ id: '2021-03-01_2021-07-31', startDate: '2021-03-01', endDate: '2021-07-31' },
		{ id: '2021-08-01_2021-10-31', startDate: '2021-08-01', endDate: '2021-10-31' },
		{ id: '2021-11-01_2022-02-28', startDate: '2021-11-01', endDate: '2022-02-28' },
	];

	it('picks the latest shifted period when today is mid-July 2026', () => {
		// Shifted end dates:
		//   Mar-Jul -> 2025-07-31 (July 2026 not fully past)
		//   Aug-Oct -> 2025-10-31 (Oct 2026 not fully past)
		//   Nov-Feb -> 2026-02-28 (Feb 2026 fully past)
		// Latest = Nov-Feb shifted to 2025-11-01 -> 2026-02-28
		const result = findLatestFullyAvailableShiftedPeriod(periods, new Date(2026, 6, 22));
		expect(result?.period.id).toBe('2021-11-01_2022-02-28');
		expect(result?.shiftedStartDate.getFullYear()).toBe(2025);
		expect(result?.shiftedStartDate.getMonth()).toBe(10); // November
		expect(result?.shiftedStartDate.getDate()).toBe(1);
		expect(result?.shiftedEndDate.getFullYear()).toBe(2026);
		expect(result?.shiftedEndDate.getMonth()).toBe(1); // February
		expect(result?.shiftedEndDate.getDate()).toBe(28);
	});

	it('picks a different period once earlier seasons have fully passed in the current year', () => {
		// Today = August 5, 2026 -> July 2026 fully past, so Mar-Jul shifts to 2026
		const result = findLatestFullyAvailableShiftedPeriod(periods, new Date(2026, 7, 5));
		expect(result?.period.id).toBe('2021-03-01_2021-07-31');
		expect(result?.shiftedStartDate.getFullYear()).toBe(2026);
		expect(result?.shiftedEndDate.getFullYear()).toBe(2026);
	});

	it('uses the previous year when no current-year season has fully passed yet', () => {
		// Today = January 15, 2026 -> no 2026 season has fully passed
		// Shifted end dates:
		//   Mar-Jul -> 2025-07-31
		//   Aug-Oct -> 2025-10-31
		//   Nov-Feb -> 2025-02-28
		// Latest = Aug-Oct 2025
		const result = findLatestFullyAvailableShiftedPeriod(periods, new Date(2026, 0, 15));
		expect(result?.period.id).toBe('2021-08-01_2021-10-31');
		expect(result?.shiftedEndDate.getFullYear()).toBe(2025);
	});

	it('returns undefined for an empty list', () => {
		expect(findLatestFullyAvailableShiftedPeriod([], new Date(2026, 6, 22))).toBeUndefined();
	});

	it('preserves the year-crossing offset for Nov->Feb seasons', () => {
		// Baseline 2021-11-01 -> 2022-02-28 has a 1-year offset.
		// On Aug 1, 2026 the season's end (Feb 28) is fully past in 2026,
		// so shiftedStartDate must be Nov 1, 2025 (not Nov 1, 2026).
		const novFeb: SuggestedPeriod[] = [
			{ id: '2021-11-01_2022-02-28', startDate: '2021-11-01', endDate: '2022-02-28' },
		];
		const result = findLatestFullyAvailableShiftedPeriod(novFeb, new Date(2026, 7, 1));
		expect(result?.shiftedStartDate.getFullYear()).toBe(2025);
		expect(result?.shiftedStartDate.getMonth()).toBe(10);
		expect(result?.shiftedEndDate.getFullYear()).toBe(2026);
		expect(result?.shiftedEndDate.getMonth()).toBe(1);
		// Sanity check: end must be strictly after start
		expect(result!.shiftedEndDate.getTime()).toBeGreaterThan(result!.shiftedStartDate.getTime());
	});
});
