'use client';

import React from 'react';
import useSWR from 'swr';
import { apiFetcher } from '@features/(shared)/_url/apiFetcher';
import { ProcessesTable } from '@features/(processes)/_components/ProcessesTable';

/**
 * ProcessesListClient Component
 *
 * This component fetches and displays a list of processes using the `ProcessesTable` component.
 * It utilizes the `useSWR` hook for data fetching and provides a manual refresh functionality.
 *
 * @component
 * @returns {JSX.Element} The rendered `ProcessesTable` component with fetched data.
 */
export const ProcessesListClient = () => {
	// API endpoint for fetching the list of processes
	const url = `/api/jobs/get/list`;

	// Fetch data using SWR with a refresh interval of 15 seconds
	const { data, mutate, error } = useSWR(url, apiFetcher, {
		refreshInterval: 15000,
	});

	// Handle error state
	if (error) return 'Error from data request';

	/**
	 * Triggers a manual refresh of the process list.
	 *
	 * @function
	 */
	function forceReloadList() {
		mutate();
	}

	// Render the ProcessesTable component with the fetched data
	// If no data is available, show a loading state
	return <ProcessesTable loading={!data?.length} data={data || []} forceReloadList={forceReloadList} />;
};
