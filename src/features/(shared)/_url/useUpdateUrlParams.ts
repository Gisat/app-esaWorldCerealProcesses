import { useCallback } from "react";

type UpdateUrlParamsFn = (
  pairs: [value: string | undefined, key: string][],
  push: (
    url: string,
    options?: { shallow?: boolean; scroll?: boolean }
  ) => void,
  shallow?: boolean,
  scroll?: boolean
) => void;

/**
 * Custom hook for updating URL search parameters dynamically.
 * @returns {UpdateUrlParamsFn} A function that updates URL parameters dynamically.
 */
const useUpdateUrlParams = (): UpdateUrlParamsFn => {
  /**
   * Updates multiple URL search parameters dynamically.
   * @param {Array<[string | undefined, string]>} pairs - An array of tuples containing the new values and keys.
   * @param {Function} push - A function to update the URL (e.g., Next.js `router.push` or any other function).
   * @param {boolean} [shallow=true] - Whether to use shallow routing (avoids data re-fetching in Next.js).
   * @param {boolean} [scroll=false] - Whether to scroll to the top after navigation.
   */
  const updateParams = useCallback<UpdateUrlParamsFn>(
    (pairs, push, shallow = true, scroll = false) => {
      const currentUrl = new URL(window.location.href);

      // Create a new URL object to avoid mutating the original
      const updatedUrl = pairs.reduce((acc, [value, key]) => {
        if (value === undefined || value === null) {
          acc.searchParams.delete(key); // Remove key if value is undefined/null
        } else {
          acc.searchParams.set(key, value);
        }
        return acc;
      }, new URL(currentUrl.toString())); // Clone the URL to ensure immutability

      // Use provided push function to update the URL
      push(updatedUrl.toString(), { shallow, scroll });
    },
    []
  );

  return updateParams;
};

export default useUpdateUrlParams;
