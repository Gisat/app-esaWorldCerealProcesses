"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useRedirectIf = (unsureValue: () => boolean, whereToRedirect: string) => {
    const router = useRouter()
    useEffect(() => {
        const needRedirect = unsureValue()
        if (needRedirect) {
            router.push(whereToRedirect);
        }
    }, [unsureValue, router]);
}