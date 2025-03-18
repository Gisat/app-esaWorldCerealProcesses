/**
 * Checks if the user is logged in by fetching user information from the provided URL.
 *
 * @param {string} userInfoUrl - The URL to fetch user information from.
 * @param {string} cookies - The cookies to include in the request headers.
 * @returns {Promise<boolean>} - A promise that resolves to `true` if the user is logged in (i.e., the user info contains an email), otherwise `false`.
 *
 * @throws Will log an error message if the fetch request fails or if there is an error during the process.
 */
export async function isUserLoggedIn(userInfoUrl: string, cookies: string) {
  try {
    const response = await fetch(userInfoUrl, {
      headers: {
        Cookie: cookies,
      },
    });
    if (!response.ok) {
      console.error("Failed to fetch user info:", response.statusText);
      return false;
    }
    const data = await response.json();
    console.log("User info data:", data);
    return !!data.email;
  } catch (error) {
    console.error("User Info Error:", error);
    return false;
  }
}
