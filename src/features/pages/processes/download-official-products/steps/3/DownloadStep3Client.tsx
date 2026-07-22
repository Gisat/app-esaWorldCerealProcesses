'use client';

import useSWR from 'swr';
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { IconArrowRight, IconPlayerPlayFilled, IconPlus } from '@tabler/icons-react';
import { Button, Group, Text } from '@mantine/core';
import { fetcher } from '@features/(shared)/_logic/utils';
import { TextParagraph } from '@features/(shared)/_layout/_components/Content/TextParagraph';
import { MapBBox } from '@features/(shared)/_components/map/MapBBox';
import ProcessAttributes from '@features/(processes)/_components/ProcessAttributes';
import formParams from '@features/(processes)/_constants/download-official-products/formParams';
import { resolveBackgroundLayer } from '@features/(map)/_components/mapBackgroundLayers/backgroundLayers';
import { area as turfArea } from '@turf/area';
import { polygon as turfPolygon } from '@turf/helpers';
import '@features/pages/processes/create-custom-products/steps/3/CreateProductsStep3Client.css';

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

export default function DownloadStep3Client() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const jobKey = searchParams.get('jobKey') ?? undefined;
	const urlBackgroundLayer = searchParams.get('backgroundLayer') ?? undefined;

	const [backgroundLayer, setBackgroundLayer] = useState<string | null>(null);
	const [shouldFetch, setShouldFetch] = useState(false);
	const [startedData, setStartedData] = useState<{ key: string; status: string } | null>(null);

	const startJobUrl = `/api/jobs/start/${jobKey}`;
	const getJobUrl = `/api/jobs/get/${jobKey}`;

	const { data: startedProcessData, isLoading } = useSWR(shouldFetch && jobKey ? startJobUrl : null, () =>
		fetcher(startJobUrl)
	);

	const { data } = useSWR(jobKey ? getJobUrl : null, fetcher);

	const initialBackgroundLayer = useMemo(() => {
		if (urlBackgroundLayer) return urlBackgroundLayer;
		return resolveBackgroundLayer(data?.customProperties);
	}, [urlBackgroundLayer, data]);

	useEffect(() => {
		if (initialBackgroundLayer && !backgroundLayer) {
			setBackgroundLayer(initialBackgroundLayer);
		}
	}, [initialBackgroundLayer, backgroundLayer]);

	useEffect(() => {
		if (shouldFetch && startedProcessData) {
			setShouldFetch(false);
			setStartedData(startedProcessData);
		}
	}, [shouldFetch, startedProcessData]);

	useEffect(() => {
		if (startedData?.key && startedData?.status) {
			const timer = setTimeout(() => {
				router.push('/processes-list');
			}, 50);
			return () => clearTimeout(timer);
		}
	}, [startedData, router]);

	const onStartProcess = () => {
		setShouldFetch(true);
	};

	const onNewProcessClick = () => {
		router.push('/download-official-products/steps/1');
	};

	const onGoToList = () => {
		router.push('/processes-list');
	};

	const activeBackgroundLayer = backgroundLayer ?? undefined;

	return (
		<div className="step3-container">
			<TextParagraph color="var(--textAccentedColor)">
				<b>You have created the Download official products process with following parameters:</b>
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
							jobKey={jobKey}
							product={
								formParams.product.options.find((option) => option.value === data.oeoCollection)?.label
							}
							collectionName={data.timeRange?.[0]?.split('-')?.[0]}
							resultFileFormat={data.format === 'GTiff' ? 'GeoTIFF' : data.format}
						/>
					</div>
				</div>
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
		</div>
	);
}
