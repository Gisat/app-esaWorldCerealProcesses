import { IAM_CONSTANTS } from "@/app/(auth)/_logic/models.auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from 'js-cookie';


export const useAuthCookieRedirect = () => {
    const router = useRouter()
	
    useEffect(() => {
        const value = Cookies.get(IAM_CONSTANTS.Cookie_Email);
    
        if(!value)
            router.push("/")
    }, []);
}
