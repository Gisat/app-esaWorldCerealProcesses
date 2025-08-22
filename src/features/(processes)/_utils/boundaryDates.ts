/**
 * Calculates a month window ending in the reference month (inclusive).
 * interval = number of calendar months INCLUDING the reference month.
 */
export default function getBoundaryDates(date: Date, interval: number = 12): { startDate: Date; endDate: Date } {
  if (interval < 1) throw new Error('interval must be >= 1');

  const y = date.getUTCFullYear();
  const m = date.getUTCMonth();

  const endDate = new Date(Date.UTC(y, m + 1, 0));               // last day of reference month (UTC)
  const startDate = new Date(Date.UTC(y, m - (interval - 1), 1)); // first day 11 months earlier (UTC)

  return { startDate, endDate };
}