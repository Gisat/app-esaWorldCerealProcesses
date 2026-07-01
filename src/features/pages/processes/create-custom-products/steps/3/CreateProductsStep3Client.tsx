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
import { customProductsProductTypes } from '@features/(processes)/_constants/app';
import { area as turfArea } from '@turf/area';
import { resolveBackgroundLayer } from '@features/(map)/_components/mapBackgroundLayers/backgroundLayers';
import { polygon as turfPolygon } from '@turf/helpers';
import './CreateProductsStep3Client.css';

function AttributeItem({ label, value, isLink }: { label: string; value?: string; isLink?: boolean }) {
	if (!value) return null;
	return (
		<div className="step3-attr-item">
			<Text size="sm" c="var(--textSecondaryColor)">
				{label}:
			</Text>
			{isLink ? (
				<a href={value} target="_blank" rel="noopener noreferrer" className="step3-attr-link">
					<Text size="sm" fw={700} c="white">
						{value}
					</Text>
				</a>
			) : (
				<Text size="sm" fw={700} c="white">
					{value}
				</Text>
			)}
		</div>
	);
}

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
								<Text size="sm" c="white" mb="xs">
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
						<div className="step3-attr-column">
							<AttributeItem
								label="Product"
								value={
									formParams.processId.options.find((o) => o.value === data.oeoProcessId)?.label ?? data.oeoProcessId
								}
							/>
							<AttributeItem label="Model" value={data.seasonalModelZip} />
							{data.seasonalModelZip && <AttributeItem label="Base model" value={data.seasonalModelZip} isLink />}
							{data.landcoverHeadZip && (
								<AttributeItem label="Cropland head override" value={data.landcoverHeadZip} isLink />
							)}
							{data.croptypeHeadZip && (
								<AttributeItem label="Crop type head override" value={data.croptypeHeadZip} isLink />
							)}
							{data.timeRange?.[0] && <AttributeItem label="Start date" value={data.timeRange[0]} />}
							{data.timeRange?.[1] && <AttributeItem label="End date" value={data.timeRange[1]} />}
						</div>

						<div className="step3-attr-column">
							{data.seasonIds?.[0] && <AttributeItem label="Season ID" value={data.seasonIds[0]} />}
							{data.orbitState && (
								<AttributeItem
									label="Orbit state"
									value={
										formParams.orbitState.options.find((o) => o.value === data.orbitState)?.label ?? data.orbitState
									}
								/>
							)}
							{data.postprocessMethodCroptype && (
								<AttributeItem
									label="Post process method - croptype"
									value={
										formParams.postprocessMethodCroptype.options.find((o) => o.value === data.postprocessMethodCroptype)?.label ??
										data.postprocessMethodCroptype
									}
								/>
							)}
							{data.postprocessKernelSizeCroptype != null && (
								<AttributeItem label="Post process kernel size - croptype" value={String(data.postprocessKernelSizeCroptype)} />
							)}
							{data.postprocessMethodCropland && (
								<AttributeItem
									label="Post process method - cropland"
									value={
										formParams.postprocessMethodCropland.options.find(
											(o) => o.value === data.postprocessMethodCropland
										)?.label ?? data.postprocessMethodCropland
									}
								/>
							)}
							{data.postprocessKernelSizeCropland != null && (
								<AttributeItem label="Post process kernel size - cropland" value={String(data.postprocessKernelSizeCropland)} />
							)}
						</div>
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
