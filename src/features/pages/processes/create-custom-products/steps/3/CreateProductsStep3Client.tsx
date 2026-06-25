'use client';

import useSWR from 'swr';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconArrowRight, IconPlayerPlayFilled, IconPlus } from '@tabler/icons-react';
import { Button, Group } from '@mantine/core';
import { useSearchParams } from 'next/navigation';
import { fetcher } from '@features/(shared)/_logic/utils';
import { TextParagraph } from '@features/(shared)/_layout/_components/Content/TextParagraph';
import Details from '@features/(processes)/_components/ProcessesTable/Details';
import formParams from '@features/(processes)/_constants/generate-custom-products/formParams';

export default function CreateProductsStep3Client() {
	const searchParams = useSearchParams();
	const jobKey = searchParams.get('jobKey') ?? undefined;
	const backgroundLayer = searchParams.get('backgroundLayer') ?? undefined;

	const router = useRouter();

	const [shouldFetch, setShouldFetch] = useState(false);

	const startJobUrl = `/api/jobs/start/${jobKey}`;
	const getJobUrl = `/api/jobs/get/${jobKey}`;

	const { data: startedProcessData, isLoading } = useSWR(shouldFetch && jobKey ? startJobUrl : null, () =>
		fetcher(startJobUrl)
	);

	const { data } = useSWR(jobKey ? getJobUrl : null, fetcher);

	if (shouldFetch && startedProcessData) {
		setShouldFetch(false);
	}

	if (startedProcessData?.key && startedProcessData?.status) {
		setTimeout(() => {
			onGoToList();
		}, 50);
	}

	const onStartProcess = () => {
		setShouldFetch(true);
	};

	const onNewProcessClick = () => {
		router.push(`/generate-custom-products/steps/1`);
	};

	const onGoToList = () => {
		router.push(`/processes-list`);
	};

	return (
		<>
			<TextParagraph color="var(--textAccentedColor)">
				<b>You have created the Generate custom product process with following parameters:</b>
			</TextParagraph>
			{data && data.key === jobKey ? (
				<Details
					bbox={data.bbox}
					resultFileFormat={
						({ GTiff: 'GeoTIFF', NETCDF: 'NetCDF' } as Record<string, string>)[data.resultFileFormat] ??
						data.resultFileFormat
					}
					oeoProcessId={formParams.product.options.find((option) => option.value === data.oeoProcessId)?.label}
					backgroundLayer={backgroundLayer}
					startDate={data?.timeRange?.[0]}
					endDate={data?.timeRange?.[1]}
					model={data?.model}
					orbitState={formParams.orbitState.options.find((option) => option.value === data?.orbitState)?.label}
					postprocessMethod={
						formParams.postprocessMethod.options.find((option) => option.value === data?.postprocessMethod)?.label
					}
					postprocessKernelSize={data?.postprocessKernelSize}
					seasonId={data?.seasonIds?.[0]}
					seasonalModelZip={data?.seasonalModelZip}
					enableCroplandHead={data?.enableCroplandHead}
					landcoverHeadZip={data?.landcoverHeadZip}
					croptypeHeadZip={data?.croptypeHeadZip}
					maskCropland={data?.maskCropland}
					postprocessMethodCropland={
						formParams.postprocessMethodCropland.options.find(
							(option) => option.value === data?.postprocessMethodCropland
						)?.label
					}
					postprocessKernelSizeCropland={data?.postprocessKernelSizeCropland}
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
