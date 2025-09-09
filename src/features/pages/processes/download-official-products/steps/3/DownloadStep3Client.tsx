'use client';

import useSWR from 'swr';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconArrowRight, IconPlayerPlayFilled, IconPlus } from '@tabler/icons-react';
import { Button, Group } from '@mantine/core';
import { useSharedState } from '@gisatcz/ptr-fe-core/client';
import { WorldCerealState } from '@features/state/state.models';
import { OneOfWorldCerealActions } from '@features/state/state.actions';
import { WorldCerealStateActionType } from '@features/state/state.actionTypes';
import { fetcher } from '@features/(shared)/_logic/utils';
import { TextParagraph } from '@features/(shared)/_layout/_components/Content/TextParagraph';
import Details from '@features/(processes)/_components/ProcessesTable/Details';
import { getCurrentJobKey } from '@features/state/selectors/downloadOfficialProducts/getCurrentJobKey';
import { getBackgroundLayer } from '@features/state/selectors/downloadOfficialProducts/getBackgroundLayer';
import formParams from '@features/(processes)/_constants/download-official-products/formParams';

/**
 * Component representing the second step in the "Download Official Products" process.
 *
 * This step allows users to review the process parameters and start the process.
 *
 * @component
 * @returns {JSX.Element} The rendered component for step 2 of the process.
 */
export default function DownloadStep3Client() {
	/**
	 * Shared state hook for accessing and dispatching application state.
	 * @type {[WorldCerealState, React.Dispatch<OneOfWorldCerealActions>]}
	 */
	const [state, dispatch] = useSharedState<WorldCerealState, OneOfWorldCerealActions>();
	const [backgroundLayer] = useState<string | undefined>(getBackgroundLayer(state));
	const jobKey = getCurrentJobKey(state);

	/**
	 * Router instance for navigation.
	 */
	const router = useRouter();

	/**
	 * State to determine whether to fetch process data.
	 * @type {boolean}
	 */
	const [shouldFetch, setShouldFetch] = useState(false);

	/**
	 * Effect to set the active step in the state when the component mounts.
	 */
	useEffect(() => {
		dispatch({
			type: WorldCerealStateActionType.DOWNLOAD_OFFICIAL_PRODUCT_SET_ACTIVE_STEP,
			payload: 3,
		});
		// clear settings
		dispatch({
			type: WorldCerealStateActionType.DOWNLOAD_OFFICIAL_PRODUCT_RESET_SETTINGS,
			payload: undefined,
		});
	}, []);

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
	 * Effect to reset the fetch state when process data is retrieved.
	 */
	if (shouldFetch && startedProcessData) {
		setShouldFetch(false);
	}

	/**
	 * Effect to navigate to the process list when the process is successfully started.
	 */
	if (startedProcessData?.key && startedProcessData?.status) {
		setTimeout(() => {
			onGoToList();
		}, 50);
	}

	/**
	 * Handler to start the process and fetch data.
	 */
	const onStartProcess = () => {
		setShouldFetch(true);
	};

	/**
	 * Handler to navigate to the first step for setting up a new process.
	 */
	const onNewProcessClick = () => {
		router.push(`/download-official-products/steps/1`);
	};

	/**
	 * Handler to navigate to the process list.
	 */
	const onGoToList = () => {
		router.push(`/processes-list`);
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
						formParams.outputFileFormat.options.find((option) => option.value === data.resultFileFormat)?.label
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
