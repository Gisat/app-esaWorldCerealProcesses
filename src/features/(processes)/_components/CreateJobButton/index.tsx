'use client';

import { apiFetcher } from '@features/(shared)/_url/apiFetcher';
import useUpdateUrlParams from '@features/(shared)/_url/useUpdateUrlParams';
import { Button } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, JSX } from 'react';
import useSWR from 'swr';

/**
 * Type for job creation parameters.
 */
type JobParams = {
	startDate?: string;
	endDate?: string;
	bbox?: string;
	outputFileFormat?: string;
	collection?: string;
	srs?: string;
	model?: string;
	product?: string;
};

/**
 * Type for search parameters.
 */
type SearchParamsType = {
	step?: string;
	startDate?: string;
	endDate?: string;
	collection?: string;
	bbox?: string;
	width?: string;
	height?: string;
	outputFileFormat?: string;
	model?: string;
	product?: string;
};

// Default values
const defaultWidth = '10000';
const defaultHeight = '10000';
const minSize = 100;
const maxSize = 500000;

/**
 * Props for CreateJobButton component.
 */
interface CreateJobButtonProps {
	params: JobParams;
	searchParams?: SearchParamsType;
	apiUrl: string;
	disabled?: boolean;
}

/**
 * Reusable button component for creating a job process.
 *
 * @param {CreateJobButtonProps} props - Component props.
 * @returns {JSX.Element} Button component for initiating job creation.
 */
const CreateJobButton = ({ params, searchParams, apiUrl, disabled = false }: CreateJobButtonProps): JSX.Element => {
	const router = useRouter();
	const updateUrlParams = useUpdateUrlParams();
	const [shouldFetch, setShouldFetch] = useState(false);

	//const url = `/api/jobs/create/from-process`;
	const urlParams = new URLSearchParams(params);

	// Fetch job data when shouldFetch is true
	const { data, isLoading } = useSWR(shouldFetch ? [apiUrl, urlParams.toString()] : null, () =>
		apiFetcher(apiUrl, urlParams.toString())
	);

	// Reset fetch state when data is available
	useEffect(() => {
		if (shouldFetch && data) {
			setShouldFetch(false);
		}
	}, [shouldFetch, data]);

	// Update URL parameters when job data is received
	useEffect(() => {
		if (data?.key) {
			setTimeout(() => {
				updateUrlParams(
					[
						['3', 'step'],
						[data.key, 'key'],
					],
					router.push
				);
			}, 50);
		}
	}, [data, updateUrlParams, router]);

	/**
	 * Handles button click event to initiate job creation.
	 */
	const handleClick = () => {
		setShouldFetch(true);
	};

	// Extract search parameters for validation
	const width = searchParams?.width ?? defaultWidth;
	const height = searchParams?.height ?? defaultHeight;
	const widthInvalid = width && (Number(width) < minSize || Number(width) > maxSize);
	const heightInvalid = height && (Number(height) < minSize || Number(height) > maxSize);

	return (
		<Button
			leftSection={<IconCheck size={14} />}
			disabled={isLoading || !!widthInvalid || !!heightInvalid || disabled}
			className="worldCereal-Button"
			onClick={handleClick}
		>
			{isLoading ? 'Creating...' : 'Create process'}
		</Button>
	);
};

export { CreateJobButton };
