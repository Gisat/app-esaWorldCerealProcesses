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
 * @returns {Function} A function that updates URL parameters dynamically.
 */
const useUpdateUrlParams = (): UpdateUrlParamsFn => {
  /**
   * Updates multiple URL search parameters dynamically.
   * @param {Array<[string | undefined, string]>} pairs - An array of tuples containing the new values and keys.
   * @param {Function} push - A function to update the URL (can be Next.js router.push or any other function).
   * @param {boolean} [shallow=true] - Whether to use shallow routing (avoids data re-fetching in Next.js).
   * @param {boolean} [scroll=false] - Whether to scroll to the top after navigation.
   */
  const updateParams = useCallback<UpdateUrlParamsFn>(
    (pairs, push, shallow = true, scroll = false) => {
      const url = new URL(window.location.href);

      // Update search parameters
      pairs.forEach(([value, key]) => {
        if (value === undefined || value === null) {
          url.searchParams.delete(key); // Remove key if value is undefined/null
        } else {
          url.searchParams.set(key, value);
        }
      });
      

      // Use provided push function to update the URL
      push(url.toString(), { shallow, scroll });
    },
    []
  );

  return updateParams;
};

export default useUpdateUrlParams;
