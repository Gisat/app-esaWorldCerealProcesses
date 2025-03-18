import formParams from "../_constants/generate-custom-products/formParams";

/**
 * Retrieves the namespace associated with a specific process ID.
 * 
 * Searches for a match in the customProducts array and returns the corresponding
 * namespace if found.
 * 
 * @param processId - The ID of the process to look up
 * @returns The namespace string associated with the process ID, or an empty string if not found
 */
export default function getNamespaceByProcessId(processId: string | null): string {
  return formParams.product.options.find((product) => product.value === processId)?.namespace || "";
}