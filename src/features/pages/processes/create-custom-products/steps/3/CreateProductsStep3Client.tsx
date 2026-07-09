'use client';

import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconArrowRight, IconPlayerPlayFilled, IconPlus } from '@tabler/icons-react';
import { Button, Group, Text } from '@mantine/core';
import { useSearchParams } from 'next/navigation';
import { fetcher } from '@features/(shared)/_logic/utils';
import { TextParagraph } from '@features/(shared)/_layout/_components/Content/TextParagraph';
import { MapBBox } from '@features/(shared)/_components/map/MapBBox';
import formParams from '@features/(processes)/_constants/generate-custom-products/formParams';
import { area as turfArea } from '@turf/area';
import { resolveBackgroundLayer } from '@features/(map)/_components/mapBackgroundLayers/backgroundLayers';
import { polygon as turfPolygon } from '@turf/helpers';
import ProcessAttributes from '@features/(processes)/_components/ProcessAttributes';
import './CreateProductsStep3Client.css';

function computeExtentText(bbox: number[]): string {
	const [minLng, minLat, maxLng, maxLat] = bbox;
	const coords = `${minLng.toFixed(2)}, ${minLat.toFixed(2)}, ${maxLng.toFixed(2)}, ${maxLat.toFixed(2)}`;
	try {
		const polygon = turfPolygon([
			[
				[minLng, minLat],
				[maxLng, minLat],
				[maxLng, maxLat],
				[minLng, maxLat],
				[minLng, minLat],
			],
		]);
		const areaSqkm = Math.round(turfArea(polygon) / 1_000_000);
		return `Extent: ${coords} (${areaSqkm.toLocaleString()} sqkm)`;
	} catch {
		return `Extent: ${coords}`;
	}
}

export default function CreateProductsStep3Client() {
	const searchParams = useSearchParams();
	const jobKey = searchParams.get('jobKey') ?? undefined;

	const [backgroundLayer, setBackgroundLayer] = useState<string | null>(null);

	const router = useRouter();
	const [shouldFetch, setShouldFetch] = useState(false);

	const startJobUrl = `/api/jobs/start/${jobKey}`;
	const getJobUrl = `/api/jobs/get/${jobKey}`;

	const { data: startedProcessData, isLoading } = useSWR(shouldFetch && jobKey ? startJobUrl : null, () =>
		fetcher(startJobUrl)
	);

	const { data } = useSWR(jobKey ? getJobUrl : null, fetcher);

	/**
	 * Initializes the background layer from the job's customProperties
	 * when the job data is first loaded.
	 */
	useEffect(() => {
		const key = resolveBackgroundLayer(data?.customProperties);
		if (key && !backgroundLayer) {
			setBackgroundLayer(key);
		}
	}, [data, backgroundLayer]);

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

	const activeBackgroundLayer = backgroundLayer ?? undefined;

	return (
		<div className="step3-container">
			<TextParagraph color="var(--textAccentedColor)">
				<b>You have created the Generate custom product process with following parameters:</b>
			</TextParagraph>

			{data && data.key === jobKey ? (
				<div className="step3-content">
					<div className="step3-map-section">
						{data.bbox && (
							<>
								<Text size="sm" c="dimmed" mb="xs">
									{computeExtentText(data.bbox)}
								</Text>
								<MapBBox
									mapSize={[550, 350]}
									bbox={data.bbox}
									disabled
									backgroundLayer={activeBackgroundLayer}
									setBackgroundLayer={setBackgroundLayer}
								/>
							</>
						)}
					</div>

					<div className="step3-attributes">
						<ProcessAttributes
							jobKey={data.key}
							product={
								formParams.processId.options.find((o) => o.value === data.oeoProcessId)?.label ?? data.oeoProcessId
							}
							seasonalModelZip={data.seasonalModelZip}
							landcoverHeadZip={data.landcoverHeadZip}
							croptypeHeadZip={data.croptypeHeadZip}
							startDate={data.timeRange?.[0]}
							endDate={data.timeRange?.[1]}
							seasonId={data.seasonIds?.[0]}
							orbitState={
								data.orbitState
									? formParams.orbitState.options.find((o) => o.value === data.orbitState)?.label ?? data.orbitState
									: undefined
							}
							postprocessMethodCroptype={
								data.postprocessMethodCroptype
									? formParams.postprocessMethodCroptype.options.find(
											(o) => o.value === data.postprocessMethodCroptype
									  )?.label ?? data.postprocessMethodCroptype
									: undefined
							}
							postprocessKernelSizeCroptype={data.postprocessKernelSizeCroptype}
							postprocessMethodCropland={
								data.postprocessMethodCropland
									? formParams.postprocessMethodCropland.options.find(
											(o) => o.value === data.postprocessMethodCropland
									  )?.label ?? data.postprocessMethodCropland
									: undefined
							}
							postprocessKernelSizeCropland={data.postprocessKernelSizeCropland}
							enableCroplandHead={data.enableCroplandHead}
							maskCropland={data.maskCropland}
						/>
					</div>
				</div>
			) : null}

			<Group mt="xl">
				<Button
					className="worldCereal-Button step3-button"
					disabled={isLoading}
					onClick={onStartProcess}
					leftSection={<IconPlayerPlayFilled size={14} />}
				>
					{isLoading ? 'Starting...' : 'Start process & go to the list'}
				</Button>
				<Button
					className="worldCereal-Button is-secondary is-ghost step3-button"
					variant="outline"
					onClick={onNewProcessClick}
					leftSection={<IconPlus size={14} />}
				>
					Setup new process
				</Button>
				<Button
					className="worldCereal-Button is-secondary is-ghost step3-button"
					variant="outline"
					onClick={onGoToList}
					leftSection={<IconArrowRight size={14} />}
				>
					Go to the list
				</Button>
			</Group>
		</div>
	);
}
