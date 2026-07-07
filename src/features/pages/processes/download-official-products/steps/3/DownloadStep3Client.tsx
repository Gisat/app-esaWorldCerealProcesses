'use client';

import useSWR from 'swr';
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { IconArrowRight, IconPlayerPlayFilled, IconPlus } from '@tabler/icons-react';
import { Button, Group } from '@mantine/core';
import { fetcher } from '@features/(shared)/_logic/utils';
import { TextParagraph } from '@features/(shared)/_layout/_components/Content/TextParagraph';
import Details from '@features/(processes)/_components/ProcessesTable/Details';
import formParams from '@features/(processes)/_constants/download-official-products/formParams';
import { resolveBackgroundLayer } from '@features/(map)/_components/mapBackgroundLayers/backgroundLayers';

/**
 * Component representing the third step in the "Download Official Products" process.
 *
 * This step allows users to review the process parameters and start the process.
 *
 * @component
 * @returns {JSX.Element} The rendered component for step 3 of the process.
 */
export default function DownloadStep3Client() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const jobKey = searchParams.get('jobKey') ?? undefined;
	const urlBackgroundLayer = searchParams.get('backgroundLayer') ?? undefined;

	/**
	 * State to determine whether to fetch process data.
	 * @type {boolean}
	 */
	const [shouldFetch, setShouldFetch] = useState(false);
	const [startedData, setStartedData] = useState<{ key: string; status: string } | null>(null);

	/**
	 * URL for starting the job process.
	 * @type {string}
	 */
	const startJobUrl = `/api/jobs/start/${jobKey}`;

	/**
	 * URL for retrieving job details.
	 * @type {string}
	 */
	const getJobUrl = `/api/jobs/get/${jobKey}`;

	/**
	 * SWR hook for fetching data when the process starts.
	 */
	const { data: startedProcessData, isLoading } = useSWR(shouldFetch && jobKey ? startJobUrl : null, () =>
		fetcher(startJobUrl)
	);

	/**
	 * SWR hook for fetching job details.
	 */
	const { data } = useSWR(jobKey ? getJobUrl : null, fetcher);


	/**
	 * Resolves the background layer key for the map.
	 * Prefers the URL param from step 2, falling back to
	 * the job's customProperties.background_layer.
	 */
	const backgroundLayer = useMemo(() => {
		if (urlBackgroundLayer) return urlBackgroundLayer;
		return resolveBackgroundLayer(data?.customProperties);
	}, [urlBackgroundLayer, data]);

	/**
	 * Effect to reset the fetch state and capture started process data.
	 */
	useEffect(() => {
		if (shouldFetch && startedProcessData) {
			setShouldFetch(false);
			setStartedData(startedProcessData);
		}
	}, [shouldFetch, startedProcessData]);

	/**
	 * Effect to navigate to the process list when the process is successfully started.
	 */
	useEffect(() => {
		if (startedData?.key && startedData?.status) {
			const timer = setTimeout(() => {
				router.push('/processes-list');
			}, 50);
			return () => clearTimeout(timer);
		}
	}, [startedData, router]);

	/**
	 * Handler to start the process and fetch data.
	 */
	const onStartProcess = () => {
		setShouldFetch(true);
	};

	/**
	 * Handler to navigate to the first step for setting up a new process.
	 * Navigating to a bare path drops all URL params, so the wizard starts fresh.
	 */
	const onNewProcessClick = () => {
		router.push('/download-official-products/steps/1');
	};

	/**
	 * Handler to navigate to the process list.
	 */
	const onGoToList = () => {
		router.push('/processes-list');
	};

	return (
		<>
			<TextParagraph color="var(--textAccentedColor)">
				<b>You have created the Download official products process with following parameters:</b>
			</TextParagraph>
			{data && data.key === jobKey ? (
				<Details
					bbox={data.bbox}
					resultFileFormat={
						formParams.format.options.find((option) => option.value === data.format)?.label
					}
					oeoCollection={formParams.product.options.find((option) => option.value === data.oeoCollection)?.label}
					collectionName={data.timeRange?.[0]?.split('-')?.[0]}
					backgroundLayer={backgroundLayer}
				/>
			) : null}
			<Group mt="xl">
				<Button
					className="worldCereal-Button"
					disabled={isLoading}
					onClick={onStartProcess}
					leftSection={<IconPlayerPlayFilled size={14} />}
				>
					{isLoading ? 'Starting...' : 'Start process & go to the list'}
				</Button>
				<Button
					className="worldCereal-Button is-secondary is-ghost"
					variant="outline"
					onClick={onNewProcessClick}
					leftSection={<IconPlus size={14} />}
				>
					Setup new process
				</Button>
				<Button
					className="worldCereal-Button is-secondary is-ghost"
					variant="outline"
					onClick={onGoToList}
					leftSection={<IconArrowRight size={14} />}
				>
					Go to the list
				</Button>
			</Group>
		</>
	);
}