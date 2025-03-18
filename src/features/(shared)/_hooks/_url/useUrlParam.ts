"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

/**
 * Custom hook for managing URL query parameters in Next.js (App Router).
 *
 * @returns {Object} - An object containing the `setUrlParam` function.
 */
const useUrlParam = () => {
  const router = useRouter();
  const pathname = usePathname();

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

      const params = new URLSearchParams(window.location.search); // Always get the latest URL params

      if (value && value !== "") {
        params.set(key, value);
      } else {
        params.delete(key);
      }

      // Update the URL with the new query params
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname]
  );

  const setUrlParams = useCallback(
    (paramsToSet: [key: string, value: string | null | undefined][]): void => {
      if (typeof window === "undefined") return; // Prevent SSR issues

      const params = new URLSearchParams(window.location.search); // Always get the latest URL params

      for (const [key, value] of paramsToSet) {
        if (value && value !== "") {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }

      // Update the URL with the new query params
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname]
  );

  return { setUrlParam, setUrlParams };
};

export { useUrlParam };
