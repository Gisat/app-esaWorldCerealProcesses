"use client";

import React, { useState, useEffect } from 'react';
import useSWR from "swr";
import { useRouter } from 'next/navigation';
import { DateInput } from '@mantine/dates';
import { Button, Stack } from '@mantine/core';
import { SegmentedControl } from '@mantine/core';
import MapExtentSelect from '@/components/map/MapExtentSelect';
import PageSteps from '@/components/atoms/PageSteps';
import TwoColumns, { Column } from "@/components/ui/layout/TwoColumns";
import FormLabel from "@/components/ui/layout/FormLabel";
import { products } from "@/constants/app";



const minDate = new Date("2021-01-01");
const maxDate = new Date("2022-01-01");

type BboxType = [] | number[] | undefined;

const fetcher = (url: string, queryParams: string) => {
	return fetch(`${url}?${queryParams}`).then(r => r.json());
}

const CreateJobButton = ({ setValues, params }: { setValues: (pairs: Array<[value: string, key: string]>) => void, params: { startDate?: string, endDate?: string, bbox?: string, outputFileFormat?: string, collection?: string } }) => {
	const [shouldFetch, setShouldFetch] = useState(false);
	const url = `/api/jobs/create`
	const urlParams = new URLSearchParams(params)

	const { data, isLoading } = useSWR(shouldFetch ? [url, urlParams.toString()] : null, () => fetcher(url, urlParams.toString()));

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
	return (
		<Button disabled={isLoading} className="worldCereal-Button" onClick={handleClick} >{isLoading ? 'Creating...' : 'Create process'}</Button>
	);
}

export default function Page({ searchParams }: {
	searchParams?: {
		step?: string;
		startDate?: string;
		endDate?: string;
		collection?: string;
		bbox?: string;
	}
}) {
	const router = useRouter()
	const startDate = searchParams?.startDate || "2021-01-01";
	const startDateDate = new Date(startDate);

	const endDate = searchParams?.endDate || "2021-12-30";
	const endDateDate = new Date(endDate);

	const collection = searchParams?.collection || undefined;

	const [bbox, setBbox] = useState([] as BboxType);

	const params = {
		bbox: searchParams?.bbox || undefined,
		startDate: startDate,
		endDate: endDate,
		collection: collection,
		outputFileFormat: 'NETCDF',
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
		const stringDate = value?.toLocaleDateString();
		if (stringDate) {
			return `${stringDate.substring(6, 10)}-${stringDate.substring(3, 5)}-${stringDate.substring(0, 2)}`
		} else {
			return null
		}
	}

	const onBboxChange = (extent?: BboxType) => {
		setBbox(extent)
		setValue(extent?.join(","), 'bbox');
	}

	useEffect(() => {
		setValue(transformDate(endDateDate), 'endDate')
		setValue(transformDate(startDateDate), 'startDate')
	}, []);

	const collectionName = collection && products.find(p => p.value === collection)?.label;

	return <TwoColumns>
		<Column>
			<FormLabel>Zoom map to select extent</FormLabel>
			<MapExtentSelect onBboxChange={onBboxChange} />
			<div>Current map extent: {bbox?.join(", ")}</div>
			<PageSteps NextButton={React.createElement(CreateJobButton, { setValues, params })} />
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
					<SegmentedControl className="worldCereal-SegmentedControl" size="md" readOnly defaultValue="NETCDF" data={[{ label: 'netCDF', value: 'NETCDF' }, { label: 'GeoTIFF', value: 'geotiff', disabled: true, }]} />
				</div>
			</Stack>
		</Column>
	</TwoColumns>
}