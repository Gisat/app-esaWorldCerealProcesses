/**
 * Extracts and splits the "bbox" parameter from search parameters.
 *
 * @param {URLSearchParams | Record<string, string>} searchParams - The search parameters, either as a URLSearchParams object or a plain object with string values.
 * @returns {string[] | undefined} An array of bbox values if found, otherwise undefined.
 *
 * @example
 * // Using URLSearchParams
 * const params = new URLSearchParams("bbox=10,20,30,40");
 * console.log(getBBoxFromSearchParams(params)); // ["10", "20", "30", "40"]
 *
 * @example
 * // Using a plain object
 * const params = { bbox: "10,20,30,40" };
 * console.log(getBBoxFromSearchParams(params)); // ["10", "20", "30", "40"]
 *
 * @example
 * // When bbox is not present
 * const params = new URLSearchParams();
 * console.log(getBBoxFromSearchParams(params)); // undefined
 */
export function getBBoxFromSearchParams(
  searchParams: URLSearchParams | Record<string, string>
): string[] | undefined {
  if (searchParams instanceof URLSearchParams) {
    const bbox = searchParams.get("bbox");
    return bbox ? bbox.split(",") : undefined;
  } else if (typeof searchParams === "object" && "bbox" in searchParams) {
    return searchParams.bbox?.split(",");
  }
  return undefined;
}
