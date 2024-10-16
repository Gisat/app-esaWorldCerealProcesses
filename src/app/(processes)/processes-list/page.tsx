"use client"

import { useUserInfoCookie } from "@/app/(auth)/_hooks/useUserInfoFromCookie";
import { useRedirectIf } from "@/app/(shared)/_hooks/useRedirectIfNot";
import ProcessesTable from "@/components/ui/layout/ProcessesTable";
import router from "next/router";
import useSWR from "swr";

// const data = [
//     {
//         id: 674356,
//         type: 'Download',
//         created: '2022-01-01 15:30:00',
//         status: 'pending',
//         details: {
//             product: 'Active cropland',
//             startDate: '2021-01-01',
//             endDate: '2021-12-31',
//             outputFileFormat: 'netCDF',
//             extent: [50, 15, 60, 17],
//         }
//     },
//     {
//         id: 342256,
//         type: 'Download',
//         created: '2022-01-02 17:34:34',
//         status: 'failed',
//         details: {
//             product: 'Active cropland',
//             startDate: '2021-01-01',
//             endDate: '2021-12-31',
//             outputFileFormat: 'netCDF',
//             extent: [50, 15, 60, 17],
//         }
//     },
//     {
//         id: 768493,
//         type: 'Download',
//         created: '2022-01-02 19:34:34',
//         status: 'done',
//         result: 'https://example.com',
//         details: {
//             product: 'Active cropland',
//             startDate: '2021-01-01',
//             endDate: '2021-12-31',
//             outputFileFormat: 'netCDF',
//             extent: [50, 15, 60, 17],
//         }
//     },
// ];


const fetcher = (url: string) => {
    return fetch(`${url}`).then(r => r.json());
}


export default function Page() {

    // const [cookieValue, _] = useUserInfoCookie()
	// useRedirectIf(() => cookieValue === undefined, "/")

    const url = `/api/jobs/get/list`
    const { data, isLoading } = useSWR(url, fetcher);
    return <ProcessesTable data={data || []} loading={isLoading} />
}