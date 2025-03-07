"use client";

import { useSearchParams } from "next/navigation";

/**
 * Hook to check if a specific URL parameter exists and has a value.
 *
 * @param {string} param - The query parameter to check.
 * @returns {boolean} - Returns true if the parameter exists and has a value, false otherwise.
 */
export function useUrlParamCheck(param: string): boolean {
  const searchParams = useSearchParams();
  const value = searchParams.get(param);

  return Boolean(value && value.trim() !== "");
}
