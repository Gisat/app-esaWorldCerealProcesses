import { useEffect, useState } from "react";
import { UserInfo } from "../_logic/models.users";
import { Unsure } from "../_logic/types.universal";
import useSWR from "swr";
import { swrFetcher } from "../_logic/utils";

/**
 * Reads user-info from related API URL using session id savend in cookie
 * @param userInfoUrl URL of Next backend with user info fetch including cookies
 * @returns User Info information for client components
 */
export const useUserInfoFromIdentity = (userInfoUrl: string) => {
    const [userInfoValue, setUserInfo] = useState<Unsure<UserInfo>>(undefined);
    const { data, error, isLoading, isValidating } = useSWR(userInfoUrl, swrFetcher);

    useEffect(() => {

        if (error) {
            console.dir("User Info Error:")
            console.dir(error)
            return
        }

        if (data) {
            if (!data.email)
                return

            setUserInfo({
                email: data.email
            })
        }

    }, [data, error])

    return { isLoading, userInfoValue, error }
}