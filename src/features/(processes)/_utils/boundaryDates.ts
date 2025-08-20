/**
 * Calculates boundary dates.
 *
 * interval: number of whole months to look back (start month is exactly `interval` months before reference month).
 * Example: date=2024-10-31, interval=12  => start=2023-10-01, end=2024-10-31
 */
export default function getBoundaryDates(date: Date, interval: number = 12): { startDate: Date; endDate: Date } {
    const refYear = date.getUTCFullYear();
    const refMonth = date.getUTCMonth(); // 0-based
    // Start: first day of the month `interval` months before reference month
    const startDate = new Date(Date.UTC(refYear, refMonth - interval, 1));
    // End: last day of reference month (day 0 of next month in UTC)
    const endDate = new Date(Date.UTC(refYear, refMonth + 1, 0));
    return { startDate, endDate };
}