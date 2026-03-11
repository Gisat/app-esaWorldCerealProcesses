import getBoundaryDates from '@features/(processes)/_utils/boundaryDates';

describe('getBoundaryDates interval=12 (inclusive)', () => {
	// Helper to create local time date (matches how route creates dates)
	const localDate = (year: number, month: number, day: number) => new Date(year, month, day);

	it('ref 2024-10-31 => 2023-11-01..2024-10-31 (12 months)', () => {
		const { startDate, endDate } = getBoundaryDates(localDate(2024, 9, 31), 12);
		expect(startDate).toEqual(localDate(2023, 10, 1));
		expect(endDate).toEqual(localDate(2024, 9, 31));
	});

	it('ref 2024-02-29 => 2023-03-01..2024-02-29 (leap year)', () => {
		const { startDate, endDate } = getBoundaryDates(localDate(2024, 1, 29), 12);
		expect(startDate).toEqual(localDate(2023, 2, 1));
		expect(endDate).toEqual(localDate(2024, 1, 29));
	});

	it('ref 2025-02-28 => 2024-03-01..2025-02-28 (non-leap Feb)', () => {
		const { startDate, endDate } = getBoundaryDates(localDate(2025, 1, 28), 12);
		expect(startDate).toEqual(localDate(2024, 2, 1));
		expect(endDate).toEqual(localDate(2025, 1, 28));
	});

	it('ref 2025-01-15 => 2024-02-01..2025-01-31 (year boundary)', () => {
		const { startDate, endDate } = getBoundaryDates(localDate(2025, 0, 15), 12);
		expect(startDate).toEqual(localDate(2024, 1, 1));
		expect(endDate).toEqual(localDate(2025, 0, 31));
	});

	it('ref 2025-04-30 => 2024-05-01..2025-04-30 (30-day month)', () => {
		const { startDate, endDate } = getBoundaryDates(localDate(2025, 3, 30), 12);
		expect(startDate).toEqual(localDate(2024, 4, 1));
		expect(endDate).toEqual(localDate(2025, 3, 30));
	});

	it('ref 2025-03-31 => 2024-04-01..2025-03-31 (31-day month)', () => {
		const { startDate, endDate } = getBoundaryDates(localDate(2025, 2, 31), 12);
		expect(startDate).toEqual(localDate(2024, 3, 1));
		expect(endDate).toEqual(localDate(2025, 2, 31));
	});

	it('ref 2025-12-31 => 2025-01-01..2025-12-31 (end of year)', () => {
		const { startDate, endDate } = getBoundaryDates(localDate(2025, 11, 31), 12);
		expect(startDate).toEqual(localDate(2025, 0, 1));
		expect(endDate).toEqual(localDate(2025, 11, 31));
	});

	it('ref 2025-07-10 => 2024-08-01..2025-07-31 (mid-month)', () => {
		const { startDate, endDate } = getBoundaryDates(localDate(2025, 6, 10), 12);
		expect(startDate).toEqual(localDate(2024, 7, 1));
		expect(endDate).toEqual(localDate(2025, 6, 31));
	});

	it('ref 2025-10-27 => 2024-11-01..2025-10-31 (DST period example)', () => {
		const { startDate, endDate } = getBoundaryDates(localDate(2025, 9, 27), 12);
		expect(startDate).toEqual(localDate(2024, 10, 1));
		expect(endDate).toEqual(localDate(2025, 9, 31));
	});

	it('ref 2024-11-01 => 2023-12-01..2024-11-30 (first day of month)', () => {
		const { startDate, endDate } = getBoundaryDates(localDate(2024, 10, 1), 12);
		expect(startDate).toEqual(localDate(2023, 11, 1));
		expect(endDate).toEqual(localDate(2024, 10, 30));
	});

	it('ref 2024-01-31 => 2023-02-01..2024-01-31 (Jan end)', () => {
		const { startDate, endDate } = getBoundaryDates(localDate(2024, 0, 31), 12);
		expect(startDate).toEqual(localDate(2023, 1, 1));
		expect(endDate).toEqual(localDate(2024, 0, 31));
	});
});
