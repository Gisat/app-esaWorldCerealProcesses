"use client";

import React, { useState } from 'react';
import useSWR from "swr";
import { useRouter } from 'next/navigation';
import { Button } from '@mantine/core';

import PageSteps from '@/components/atoms/PageSteps';

const fetcher = (url: string) => {
	return fetch(`${url}`).then(r => r.json());
}


const StartJobButton = ({ jobId }: { jobId?: string }) => {
	const [shouldFetch, setShouldFetch] = useState(false);
	const url = `/api/jobs/start/${jobId}`

	const { data, isLoading } = useSWR(shouldFetch ? [url,] : null, () => fetcher(url));


	if (shouldFetch && data) {
		setShouldFetch(false)
	}

	if (data?.jobId) {
		setTimeout(() => {
			//FIXME go to list
		}, 50)

	}

	function handleClick() {
		setShouldFetch(true);
	}

	return (
		<Button className="worldCereal-Button" onClick={handleClick} >{isLoading ? 'Loading...' : 'Start and go to list'}</Button>
	);
}

export default function Page({ searchParams }: {
	searchParams?: {
		query?: string;
		step?: string;
		startDate?: string;
		endDate?: string;
		jobid?: string;
	}
}) {
	const jobId = searchParams?.jobid;

	const { data } = useSWR(`/api/jobs/get/${jobId}`, fetcher)
	const dataAsArray = Object.entries(data || {})


	return <>

		{dataAsArray.map(([key, value]: [string, any]) => {
			return <p key={key}>{key}:{value.toString()}</p>
		})}
		<PageSteps NextButton={React.createElement(StartJobButton, { jobId })} />
	</>
}