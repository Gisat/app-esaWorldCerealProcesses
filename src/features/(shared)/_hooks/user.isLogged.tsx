import { useUserInfoFromIdentity } from "./user.useUserInfoFromIdentity";

/**
 * Custom hook to check if a user is logged in based on their user information.
 *
 * @param {string} userInfoUrl - The URL to fetch user information from.
 * @returns {Object} An object containing:
 * - `isLoading` (boolean): Indicates if the user information is currently being loaded.
 * - `isLoggedIn` (function): A function that returns a boolean indicating if the user is logged in.
 * - `userInfoValue` (any): The user information fetched from the provided URL.
 * - `error` (any): Any error encountered while fetching the user information.
 */
export const useIsLoggedIn = (userInfoUrl: string) => {
  const { isLoading, userInfoValue, error } =
    useUserInfoFromIdentity(userInfoUrl);

  const isLoggedIn = () => {
    return !!userInfoValue?.email;
  };

  return { isLoading, isLoggedIn, userInfoValue, error };
};
