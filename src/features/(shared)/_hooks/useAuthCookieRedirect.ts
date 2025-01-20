import { Unsure } from "@/app/(shared)/_logic/types.universal";
import { swrFetcher } from "@/app/(shared)/_logic/utils";
import { useEffect, useState } from "react";
import useSWR from "swr";

export const useUserInfoFromAuth = () => {

    const fetchUrl = `http://localhost:6100/oid/user-info` // TODO from env


    const [emailValue, setEmailValue] = useState<Unsure<string>>(undefined);
    const { data, error, isLoading, isValidating } = useSWR(fetchUrl, swrFetcher);
  
    useEffect(() => {
        console.log(data)

      if(data)
        setEmailValue(data.email)
    })

    return {
        emailValue, isLoading, 
    }
}
