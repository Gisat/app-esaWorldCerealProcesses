"use client"

import useSWR from "swr";
import { useState } from "react";

import ProcessesTable from "@/components/ui/layout/ProcessesTable";

const fetcher = (url: string) => {
    return fetch(`${url}`).then(r => r.json());
}


export default function Page() {

    // const [cookieValue, _] = useUserInfoCookie()
    // useRedirectIf(() => cookieValue === undefined, "/")

    const url = `/api/jobs/get/list`

    const { data, mutate } = useSWR(url, fetcher, { refreshInterval: 1000, });


    function forceReloadList() {
        mutate();
    }

    return <ProcessesTable data={data || []} forceReloadList={forceReloadList} />
}