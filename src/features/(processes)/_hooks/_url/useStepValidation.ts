"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

/**
 * Hook to validate required parameters for a given step in a multi-step process.
 * If validation fails, it redirects the user to a previous step or an error page.
 *
 * @param {number} step - The current step.
 * @param {Record<string, boolean>} requiredParams - A mapping of required parameters (key: param name, value: is required?).
 * @param {Record<string, (value: string) => boolean>} paramValidations - Validation functions for each required parameter.
 * @param {string} fallbackUrl - The URL to redirect to if validation fails (default: "/home").
 */
export function useStepValidation(
  step: number,
  requiredParams: Record<string, boolean>,
  paramValidations: Record<string, (value: string) => boolean>,
  fallbackUrl: string = "/home"
) {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    let isValid = true;

    // Check for missing or invalid required params
    Object.entries(requiredParams).forEach(([param, isRequired]) => {
      const value = searchParams.get(param);

      if (isRequired) {
        // Missing parameter
        if (!value) {
          isValid = false;
          return;
        }

        // Validate parameter if a validation function is provided
        const validate = paramValidations[param];
        if (validate && !validate(value)) {
          isValid = false;
        }
      }
    });

    // Redirect if validation fails
    if (!isValid) {
      router.push(fallbackUrl);
    }
  }, [
    step,
    searchParams,
    router,
    requiredParams,
    paramValidations,
    fallbackUrl,
  ]);
}
