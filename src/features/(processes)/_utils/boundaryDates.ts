/**
 * Calculates the boundary dates based on a given date and interval.
 * 
 * @param date - The reference date from which the boundary dates are calculated.
 * @param interval - The number of months to subtract from the reference date to calculate the start date. Defaults to 12.
 * @returns An object containing the start and end dates:
 * - `start`: The first day of the month, `interval` months before the given date.
 * - `end`: The last day of the month of the given date.
 */
export default function getBoundaryDates(date: Date, interval: number = 12): { startDate: Date; endDate: Date } {
    const startDate = new Date(date);
    startDate.setMonth(startDate.getMonth() - (interval - 1));
    startDate.setDate(1);

    const endDate = new Date(date);
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(0);

    return { startDate, endDate };
}