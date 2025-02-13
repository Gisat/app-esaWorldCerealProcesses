"use client";

import React, { useState, useEffect, createElement } from 'react';
import useSWR from "swr";
import { useRouter } from 'next/navigation';
import { DateInput } from '@mantine/dates';
import { Button, Stack, SegmentedControl } from '@mantine/core';
import { products } from "@features/(processes)/_constants/app";
import PageSteps from '@features/(processes)/_components/PageSteps';
import { MapBBox } from '@features/(shared)/_components/map/MapBBox';
import FormLabel from '@features/(shared)/_layout/_components/FormLabel';
import TwoColumns, { Column } from '@features/(shared)/_layout/_components/TwoColumns';
import { IconCheck } from "@tabler/icons-react";

const minDate = new Date("2021-01-01");
const maxDate = new Date("2022-01-01");

const defaultOutputFileFormat = "GTIFF";

type BboxType = [] | number[] | undefined;
type OutputFileFormatType = string | undefined;

const roundCoordinates = (coordinatesToRound) => coordinatesToRound.map((coordinates, index) => {
	return `[${coordinates.map(coordinate => {
		return `${Math.round(coordinate * 100) / 100}`
	})}]${coordinatesToRound?.length - 1 !== index ? "," : ""} `
})

type searchParamsType = {
	step?: string;
	startDate?: string;
	endDate?: string;
	collection?: string;
	bbox?: string;
	width?: string;
	height?: string;
	off?: string;
}

const fetcher = (url: string, queryParams: string) => {
	return fetch(`${url}?${queryParams}`).then(r => r.json());
}

const CreateJobButton = ({ setValues, params, searchParams }: { searchParams?: searchParamsType, setValues: (pairs: Array<[value: string, key: string]>) => void, params: { startDate?: string, endDate?: string, bbox?: string, off?: string, collection?: string } }) => {
	const [shouldFetch, setShouldFetch] = useState(false);
	const url = `/api/jobs/create`
	const urlParams = new URLSearchParams(params)

	const { data, isLoading } = useSWR(shouldFetch ? [url, urlParams.toString()] : null, () => fetcher(url, urlParams.toString()));

	//console.log(data, params, searchParams, urlParams)

	if (shouldFetch && data) {
		setShouldFetch(false)
	}

	if (data?.jobId) {
		setTimeout(() => {
			setValues([["3", 'step'], [data.jobId, 'jobid']])
		}, 50)
	}

	function handleClick() {
		setShouldFetch(true);
	}

	const bboxPoints = searchParams?.bbox?.split(",");

	return (
		<Button leftSection={<IconCheck size={14} />} disabled={isLoading || !bboxPoints} className="worldCereal-Button" onClick={handleClick} >{isLoading ? 'Creating...' : 'Create process'}</Button>
	);
}

export default function Page({ searchParams }: {
	searchParams?: searchParamsType
}) {

	const [areaBbox, setAreaBbox] = useState<number | undefined>(undefined);
	const [currentExtent, setCurrentExtent] = useState<BboxType>(undefined);

	const router = useRouter()
	const startDate = searchParams?.startDate || "2021-01-01";
	const startDateDate = new Date(startDate);

	const endDate = searchParams?.endDate || "2021-12-30";
	const endDateDate = new Date(endDate);

	const collection = searchParams?.collection || undefined;


	const params = {
		bbox: searchParams?.bbox || undefined,
		startDate: startDate,
		endDate: endDate,
		collection: collection,
		off: searchParams?.off || defaultOutputFileFormat,
	}

	const setValue = (value: string | null | undefined, key: string, val?: any) => {
		const url = new URL(window.location.href);

		if (value) {
			url.searchParams.set(key, value);
		} else {
			url.searchParams.delete(key);
		}
		// @ts-expect-error 'shallow' does not exist in type 'NavigateOptions'
		router.push(url.toString(), { shallow: true, scroll: false })

	}
	const setValues = (pairs: [value: string | null | undefined, key: string, val?: any][]) => {
		const url = new URL(window.location.href);

		pairs.forEach(([value, key]) => {
			url.searchParams.set(key, value || "");
		})

		// @ts-expect-error 'shallow' does not exist in type 'NavigateOptions'
		router.push(url.toString(), { shallow: true, scroll: false })
	}

	const transformDate = (value: Date | null) => {
		return value ? new Date(value).toISOString().split("T")[0] : null;
	}

	const onBboxChange = (extent?: BboxType) => {
		if (extent?.length === 4) {
			const cornerPoints = [extent?.[2], extent?.[0]];
			setCurrentExtent(cornerPoints);
		} else {
			setCurrentExtent(undefined);
		}
	}

	const onOutpoutFormatChange = (off?: OutputFileFormatType) => {
		setValue(off, 'off');
	}

	useEffect(() => {
		setValue(transformDate(endDateDate), 'endDate')
		setValue(transformDate(startDateDate), 'startDate')
		setValue(currentExtent?.join(","), 'bbox');
	}, [endDateDate, setValue, startDateDate, currentExtent]);

	const collectionName = collection && products.find(p => p.value === collection)?.label;

	const bbox = searchParams?.bbox?.split(",");
	// const longitude = bbox ? (Number(bbox[0]) + Number(bbox[2])) / 2 : 15
	// const latitude = bbox ? (Number(bbox[1]) + Number(bbox[3])) / 2 : 50


	let coordinatesToDisplay = null;

	//console.log(coordinatesToDisplay, bbox, currentExtent)

	if (currentExtent) {
		coordinatesToDisplay = roundCoordinates([currentExtent?.[0], currentExtent?.[1]]);
	} else if (bbox) {
		coordinatesToDisplay = roundCoordinates([[bbox?.[0], bbox?.[1]], [bbox?.[2], bbox?.[3]]]);
	} else {
		coordinatesToDisplay = "none";
	}

	//let bboxArea;



	console.log(areaBbox)

	return <TwoColumns>
		<Column>
			<FormLabel>Draw the extent (maximum 500 x 500 km)</FormLabel>
			<MapBBox onBboxChange={onBboxChange} bbox={bbox} setAreaBbox={setAreaBbox}/>
			<FormLabel>Current extent: {coordinatesToDisplay} ({areaBbox} sqkm)</FormLabel>
			<PageSteps NextButton={createElement(CreateJobButton, { setValues, params, searchParams })} />
		</Column>
		<Column>
			<Stack gap="lg" w="100%" align="flex-start">
				<div>
					<FormLabel>Product/collection</FormLabel>
					<div>{collectionName}</div>
				</div>
				<DateInput
					size="md"
					className="worldCereal-DateInput"
					value={startDateDate}
					onChange={(value) => setValue(transformDate(value), 'startDate', value)}
					label="Start date"
					placeholder="Select start date"
					valueFormat="YYYY-MM-DD"
					minDate={minDate}
					maxDate={endDateDate || maxDate}
					clearable={false}
					disabled
				/>
				<DateInput
					size="md"
					className="worldCereal-DateInput"
					value={endDateDate}
					onChange={(value) => setValue(transformDate(value), 'endDate')}
					label="End date"
					placeholder="Select end date"
					valueFormat="YYYY-MM-DD"
					minDate={startDateDate || minDate}
					maxDate={maxDate}
					clearable={false}
					disabled
				/>


				<div>
					<FormLabel>Output file format</FormLabel>
					<SegmentedControl onChange={(value) => onOutpoutFormatChange(value)} className="worldCereal-SegmentedControl" size="md" defaultValue={defaultOutputFileFormat} data={[{ label: 'netCDF', value: 'NETCDF' }, { label: 'GeoTIFF', value: 'GTIFF' }]} />
				</div>
			</Stack>
		</Column>
	</TwoColumns>
}