/**
 * Transforms a Date object to a string in the format YYYY-MM-DD.
 * @param {Date | null} value - The date to transform.
 * @returns {string | null} - The transformed date string.
 */
export const transformDate = (value: Date | null): string | null => {
  return value ? new Date(value).toISOString().split("T")[0] : null;
};
