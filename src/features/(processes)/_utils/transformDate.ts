/**
 * Transforms a given Date object into a string formatted as "YYYY-MM-DD".
 *
 * Extracts year, month, and day components directly from the Date object
 * to avoid timezone conversion issues.
 *
 * @param date - The Date object to be transformed.
 * @returns A string representing the date in "YYYY-MM-DD" format.
 */
export const transformDate = (date: Date): string => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};
