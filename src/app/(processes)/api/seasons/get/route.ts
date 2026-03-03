import { NextResponse } from 'next/server';

function generateRandomSeasons(count: number) {
	const seasons = [];
	const minYear = 2018;
	const maxYear = 2025;
	const maxEndYear = 2026;
	const maxEndMonth = 3;

	let attempts = 0;
	const maxAttempts = 100;

	// Helper to get last day of a month
	const getLastDayOfMonth = (year: number, month: number) => {
		return new Date(year, month, 0).getDate();
	};

	while (seasons.length < count && attempts < maxAttempts) {
		attempts++;

		// Random start year (2018-2025)
		const startYear = minYear + Math.floor(Math.random() * (maxYear - minYear + 1));
		// Random start month (1-12)
		const startMonth = Math.floor(Math.random() * 12) + 1;
		// Random duration (3-12 months inclusive, but season cannot exceed 12 months)
		const duration = Math.floor(Math.random() * 10) + 3;

		// Calculate end date with year rollover
		// Duration of D months from month M: end month = M + D - 1
		const endMonthRaw = startMonth + duration - 1;
		const endYear = startYear + Math.floor(endMonthRaw / 12);
		const endMonth = (endMonthRaw % 12) + 1;

		// Validate: end date must be within bounds and not exceed 12 months
		if (duration > 12 || endYear > maxEndYear || (endYear === maxEndYear && endMonth > maxEndMonth)) {
			continue;
		}

		// Format: startDate = YYYY-MM-01, endDate = YYYY-MM-DD (last day)
		const formatMonth = (month: number) => month.toString().padStart(2, '0');
		const lastDayOfEndMonth = getLastDayOfMonth(endYear, endMonth);

		seasons.push({
			id: String(seasons.length + 1),
			startDate: `${startYear}-${formatMonth(startMonth)}-01`,
			endDate: `${endYear}-${formatMonth(endMonth)}-${lastDayOfEndMonth}`,
		});
	}

	return seasons;
}

export async function GET() {
	const suggestedSeasons = generateRandomSeasons(3);

	return NextResponse.json(suggestedSeasons);
}
