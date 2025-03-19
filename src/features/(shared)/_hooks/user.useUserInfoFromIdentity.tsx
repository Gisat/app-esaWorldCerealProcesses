import { UserInfo } from "@features/(shared)/_logic/models.users";
import { Unsure } from "@features/(shared)/_logic/types.universal";
import { swrFetcher } from "@features/(shared)/_logic/utils";
import { useEffect, useState } from "react";
import useSWR from "swr";

/**
 * Reads user-info from related API URL using session id savend in cookie
 * @param userInfoUrl URL of Next backend with user info fetch including cookies
 * @returns User Info information for client components
 */
export const useUserInfoFromIdentity = (userInfoUrl: string) => {
  const { data, error, isLoading } = useSWR(userInfoUrl, swrFetcher);

  return { isLoading, userInfoValue: data, error };
};
