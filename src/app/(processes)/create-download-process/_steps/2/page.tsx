"use client";

import React, { useState, useEffect, createElement } from 'react';
import useSWR from "swr";
import { useRouter } from 'next/navigation';
import { DateInput } from '@mantine/dates';
import { Button, Stack, SegmentedControl } from '@mantine/core';
import { products } from "@features/(processes)/_constants/app";
import PageSteps from '@features/(processes)/_components/PageSteps';
import { MapExtentSelect } from '@features/(shared)/_components/map/MapExtentSelect';
import FormLabel from '@features/(shared)/_layout/_components/FormLabel';
import TwoColumns, { Column } from '@features/(shared)/_layout/_components/TwoColumns';
import { IconCheck } from "@tabler/icons-react";



const minDate = new Date("2021-01-01");
const maxDate = new Date("2022-01-01");

const defaultWidth = "10000";
const defaultHeight = "10000";

const minSize = 100;
const maxSize = 500000;

const defaultOutputFileFormat = "GTiff";

type BboxType = [] | number[] | undefined;
type OutputFileFormatType = string | undefined;

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

	if (shouldFetch && data) {
		setShouldFetch(false)
	}

	if (data?.key) {
		setTimeout(() => {
			setValues([["3", 'step'], [data.key, 'jobid']])
		}, 50)
	}

	function handleClick() {
		setShouldFetch(true);
	}

	const width = searchParams?.width || defaultWidth;
	const height = searchParams?.height || defaultHeight;
	const widthInvalid = width && (Number(width) < minSize || Number(width) > maxSize)
	const heightInvalid = height && (Number(height) < minSize || Number(height) > maxSize)

	return (
		<Button leftSection={<IconCheck size={14} />} disabled={isLoading || !!widthInvalid || !!heightInvalid} className="worldCereal-Button" onClick={handleClick} >{isLoading ? 'Creating...' : 'Create process'}</Button>
	);
}

export default function Page({ searchParams }: {
	searchParams?: searchParamsType
}) {

	// const [cookieValue, _] = useUserInfoCookie()
	// useRedirectIf(() => cookieValue === undefined, "/")

	const router = useRouter()
	const startDate = searchParams?.startDate || "2021-01-01";
	const startDateDate = new Date(startDate);

	const endDate = searchParams?.endDate || "2021-12-30";
	const endDateDate = new Date(endDate);

	const collection = searchParams?.collection || undefined;

	const width = searchParams?.width || defaultWidth;
	const height = searchParams?.height || defaultHeight;

	const params = {
		bbox: searchParams?.bbox || undefined,
		startDate: startDate,
		endDate: endDate,
		collection: collection,
		off: searchParams?.off || defaultOutputFileFormat,
	}

	const setValue = (value: string | null | undefined, key: string, val?: any) => {
		const url = new URL(window.location.href);

		url.searchParams.set(key, value || "");
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
		setValue(extent?.join(","), 'bbox');
	}

	const onOutpoutFormatChange = (off?: OutputFileFormatType) => {
		setValue(off, 'off');
	}

	useEffect(() => {
		setValue(transformDate(endDateDate), 'endDate')
		setValue(transformDate(startDateDate), 'startDate')
	}, [endDateDate, setValue, startDateDate]);

	const collectionName = collection && products.find(p => p.value === collection)?.label;

	const bbox = searchParams?.bbox?.split(",");
	const longitude = bbox ? (Number(bbox[0]) + Number(bbox[2])) / 2 : 15
	const latitude = bbox ? (Number(bbox[1]) + Number(bbox[3])) / 2 : 50

	return <TwoColumns>
		<Column>
			<FormLabel>Zoom map to select extent</FormLabel>
			<MapExtentSelect onBboxChange={onBboxChange} extentSizeInMeters={[Number.parseInt(width), Number.parseInt(height)]} longitude={longitude} latitude={latitude} />
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
					<SegmentedControl onChange={(value) => onOutpoutFormatChange(value)} className="worldCereal-SegmentedControl" size="md" defaultValue={defaultOutputFileFormat} data={[{ label: 'NetCDF', value: 'NETCDF' }, { label: 'GeoTiff', value: 'GTiff' }]} />
				</div>
			</Stack>
		</Column>
	</TwoColumns>
}