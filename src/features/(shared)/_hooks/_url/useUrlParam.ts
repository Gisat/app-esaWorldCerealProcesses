"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

/**
 * Custom hook for managing URL query parameters in Next.js (App Router).
 *
 * @returns {Object} - An object containing the `setUrlParam` function.
 */
const useUrlParam = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /**
   * Updates or removes a query parameter in the URL.
   *
   * @param {string} key - The query parameter key to modify.
   * @param {string | null | undefined} value - The value to set. If `null` or `undefined`, the key is removed.
   * @returns {void}
   *
   * @example
   * // Set a query parameter
   * setUrlParam("format", "GTiff");
   *
   * // Remove a query parameter
   * setUrlParam("format", null);
   */
  const setUrlParam = useCallback(
    (key: string, value: string | null | undefined): void => {
      if (typeof window === "undefined") return; // Prevent SSR issues

      // Create new URLSearchParams with all existing parameters
      const params = new URLSearchParams(searchParams.toString());

      // Update or delete the specified parameter
      if (value && value !== "") {
        params.set(key, value);
      } else {
        params.delete(key);
      }

      console.log(`Updating URL with param: ${key}=${value}`);
      console.log("All params:", params.toString());

      // Update URL while preserving other parameters
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const setUrlParams = useCallback(
    (paramsToSet: [key: string, value: string | null | undefined][]): void => {
      if (typeof window === "undefined") return; // Prevent SSR issues

      // Create new URLSearchParams with all existing parameters
      const params = new URLSearchParams(searchParams.toString());

      // Update or delete the specified parameters
      for (const [key, value] of paramsToSet) {
        if (value && value !== "") {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }

      console.log("Updated URL params:", params.toString());

      // Update URL while preserving other parameters
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  return { setUrlParam, setUrlParams };
};

export { useUrlParam };
