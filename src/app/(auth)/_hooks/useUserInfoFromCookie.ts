"use client"

import { Unsure } from '@/app/(shared)/_logic/types.universal';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { IAM_CONSTANTS } from '../_logic/models.auth';

type UserInfoCookieHookOutput = [
    Unsure<string>,
    () => void
]

/**
 * Reads user info cookie value and returns a function to delete it (FE logout)
 * @returns 
 */
export const useUserInfoCookie = (): UserInfoCookieHookOutput => {
    // just basic implementation, later we need more robust cookie management for identity and backend cooperation
    const [cookieValue, setCookieValue] = useState<Unsure<string>>(undefined);

    useEffect(() => {
        // Read the cookie
        const value = Cookies.get(IAM_CONSTANTS.Cookie_Email);
        setCookieValue(value);
    }, []);

    /**
     * Delete FE controlled cookie
     * HttpOnly must be done by redirest to auth API route
     */
    const deleteUserInfoCookie = () => {
        Cookies.remove(IAM_CONSTANTS.Cookie_Email)
        setCookieValue(undefined)
    }

    return [cookieValue, deleteUserInfoCookie]
}