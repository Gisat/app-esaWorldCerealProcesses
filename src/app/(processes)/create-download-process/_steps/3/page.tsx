"use client";

import React, { createElement, useState } from 'react';
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { Button } from '@mantine/core';

import PageSteps from '@features/(processes)/_components/PageSteps';

import { pages } from '@features/(processes)/_constants/app';
import Details from '@features/(processes)/_components/ProcessesTable/Details';
import { fetcher } from '@features/(shared)/_logic/utils';

/**
 * StartJobButton component.
 * @param {Object} props - The component props.
 * @param {string} [props.jobId] - The job ID.
 * @returns {JSX.Element} - The rendered component.
 */
const StartJobButton = ({ jobId }: { jobId?: string }) => {
	const router = useRouter();
	const [shouldFetch, setShouldFetch] = useState(false);
	const url = `/api/jobs/start/${jobId}`

	const { data, isLoading } = useSWR(shouldFetch ? [url,] : null, () => fetcher(url));


	if (shouldFetch && data) {
		setShouldFetch(false)
	}

	if (data?.result?.jobId) {
		setTimeout(() => {
			router.push(`/${pages.processesList.url}`)
		}, 50)

	}

	function handleClick() {
		setShouldFetch(true);
	}

	return (
		<Button className="worldCereal-Button" disabled={isLoading} onClick={handleClick} >{isLoading ? 'Starting...' : 'Start process and go to the list'}</Button>
	);
}

/**
 * Page component.
 * @param {Object} props - The component props.
 * @param {Object} [props.searchParams] - The search parameters.
 * @param {string} [props.searchParams.query] - The query parameter.
 * @param {string} [props.searchParams.step] - The step parameter.
 * @param {string} [props.searchParams.startDate] - The start date parameter.
 * @param {string} [props.searchParams.endDate] - The end date parameter.
 * @param {string} [props.searchParams.jobid] - The job ID parameter.
 * @returns {JSX.Element} - The rendered component.
 */
export default function Page({ searchParams }: {
	searchParams?: {
		query?: string;
		step?: string;
		startDate?: string;
		endDate?: string;
		jobid?: string;
	}
}) {

	// const [cookieValue, _] = useUserInfoCookie()
	// useRedirectIf(() => cookieValue === undefined, "/")

	const jobId = searchParams?.jobid;

	const { data } = useSWR(`/api/jobs/get/${jobId}`, fetcher)

	return <>
		{data ? <Details bbox={data?.bbox} startDate={data?.timeRange?.[0]} endDate={data?.timeRange?.[1]} resultFileFormat={data?.resultFileFormat} oeoCollection={data?.oeoCollection} /> : null}
		<PageSteps NextButton={createElement(StartJobButton, { jobId })} />
	</>
}