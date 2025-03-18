
/**
 * Transforms a given Date object into a string formatted as "YYYY-MM-DD".
 * 
 * The function uses the "sv" (Swedish) locale to format the date in ISO-like format.
 * 
 * @param date - The Date object to be transformed.
 * @returns A string representing the date in "YYYY-MM-DD" format.
 */
export const transformDate = (date: Date): string => {
  const transformedDate = date.toLocaleDateString("sv");
  return transformedDate;
};
