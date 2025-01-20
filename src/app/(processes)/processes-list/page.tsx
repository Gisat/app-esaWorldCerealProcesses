"use client"

import { ProcessesTable } from "@/features/(shared)/_components/ui/layout/ProcessesTable";
import useSWR from "swr";


const fetcher = (url: string) => {
    return fetch(`${url}`).then(r => r.json());
}


export default function Page() {

    const url = `/api/jobs/get/list`

    const { data, mutate, error } = useSWR(url, fetcher, { refreshInterval: 1000 });

    if(error)
        return "Error from data request"

    function forceReloadList() {
        mutate();
    }

    return <ProcessesTable data={data || []} forceReloadList={forceReloadList} />
}