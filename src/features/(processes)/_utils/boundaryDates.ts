/**
 * Calculates a month window ending in the reference month (inclusive).
 * interval = number of calendar months INCLUDING the reference month.
 */
export default function getBoundaryDates(date: Date, interval: number = 12): { startDate: Date; endDate: Date } {
	if (interval < 1) throw new Error('interval must be >= 1');

	// Use local time to ensure selected date doesn't change due to timezone
	const y = date.getFullYear();
	const m = date.getMonth();

	// Get last day of reference month: day 0 of (m+1) gives last day of current month
	const endDate = new Date(y, m + 1, 0); // last day of reference month (local time)

	// Calculate start: go back (interval-1) months from the reference month
	const monthsBack = interval - 1;
	let startMonth = m - monthsBack;
	let startYear = y;
	if (startMonth < 0) {
		startYear -= 1;
		startMonth += 12;
	}
	// Start date is always day 1 of the month
	const startDate = new Date(startYear, startMonth, 1);

	return { startDate, endDate };
}
