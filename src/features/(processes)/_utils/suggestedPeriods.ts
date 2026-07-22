export type SuggestedPeriod = {
	id: string;
	startDate: string;
	endDate: string;
};

export type ShiftedSuggestedPeriod = {
	period: SuggestedPeriod;
	shiftedStartDate: Date;
	shiftedEndDate: Date;
	shiftedEndTimestamp: number;
};

const getMonthOfDateStr = (dateStr: string): number => {
	if (!dateStr) return NaN;
	const match = dateStr.match(/-(\d{2})-\d{2}$/);
	return match ? Number(match[1]) : NaN;
};

const getMonthPairOfPeriod = (period: SuggestedPeriod): string => {
	const startMonth = getMonthOfDateStr(period.startDate);
	const endMonth = getMonthOfDateStr(period.endDate);
	return `${startMonth}__${endMonth}`;
};

const getMonthPairOfDates = (startDate: Date, endDate: Date): string => {
	return `${startDate.getMonth() + 1}__${endDate.getMonth() + 1}`;
};

/**
 * Returns the suggested period whose start/end month combination matches the
 * given start/end dates (day and year are ignored). Used to keep the
 * suggested-season radio bullet selected when the user shifts the range by a
 * year or moves the slider within the same month pair (issue #31, comment
 * 4990762248 + follow-up clarification that seasons are month-based).
 */
export const findSuggestedPeriodByMonth = (
	periods: SuggestedPeriod[],
	startDate: Date,
	endDate: Date
): SuggestedPeriod | undefined => {
	const target = getMonthPairOfDates(startDate, endDate);
	return periods.find((p) => getMonthPairOfPeriod(p) === target);
};

/**
 * Year-shifts a suggested period (whose startDate/endDate carry a baseline
 * year, e.g. 2021) to the requested `targetEndYear`. The shifted range
 * always spans the first day of the first month through the last day of the
 * last month in the chosen year (per kvantricht's rule: "from the first day
 * of a first month to the last day of a last month").
 *
 * `targetEndYear` is clamped down (never up) so the resulting end date is
 * strictly in the past relative to `today`.
 *
 * Handles year-crossing seasons (e.g. baseline "2021-11-01" -> "2022-02-28")
 * by preserving the original year offset between start and end dates.
 */
export const shiftPeriodToYear = (
	period: SuggestedPeriod,
	targetEndYear: number,
	today: Date
): ShiftedSuggestedPeriod => {
	const [startYearStr, startMonthStr] = period.startDate.split('-');
	const [endYearStr, endMonthStr] = period.endDate.split('-');
	const startMonth = Number(startMonthStr);
	const endMonth = Number(endMonthStr);
	const yearOffset = Number(endYearStr) - Number(startYearStr);

	const todayTs = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
	while (new Date(targetEndYear, endMonth, 0).getTime() >= todayTs) {
		targetEndYear -= 1;
	}

	const targetStartYear = targetEndYear - yearOffset;
	const shiftedStartDate = new Date(targetStartYear, startMonth - 1, 1);
	const shiftedEndDate = new Date(targetEndYear, endMonth, 0);

	return {
		period,
		shiftedStartDate,
		shiftedEndDate,
		shiftedEndTimestamp: shiftedEndDate.getTime(),
	};
};

/**
 * Year-shifts a suggested period to the latest year in which the season
 * has fully passed relative to `today`. Convenience wrapper over
 * `shiftPeriodToYear`.
 */
export const shiftPeriodToLatestFullyPastYear = (
	period: SuggestedPeriod,
	today: Date
): ShiftedSuggestedPeriod => {
	return shiftPeriodToYear(period, today.getFullYear(), today);
};

/**
 * Returns the suggested period (with year-shifted start/end dates) whose
 * shifted end date is the latest date that has fully passed relative to
 * `today`. The result includes both the original period (for radio
 * selection) and the year-shifted dates (for the slider range).
 *
 * Used as the default selection when a user first draws a bbox (issue #31,
 * comment 4991015885). The baseline year in the API response is treated as
 * a year-agnostic season pattern; the latest fully available year is then
 * derived from today's date.
 */
export const findLatestFullyAvailableShiftedPeriod = (
	periods: SuggestedPeriod[],
	today: Date = new Date()
): ShiftedSuggestedPeriod | undefined => {
	if (!periods || periods.length === 0) return undefined;
	const shifted = periods.map((p) => shiftPeriodToLatestFullyPastYear(p, today));
	shifted.sort((a, b) => b.shiftedEndTimestamp - a.shiftedEndTimestamp);
	return shifted[0];
};
