"use client";

import React, { useState, useEffect } from 'react';
import useSWR from "swr";
import { useRouter } from 'next/navigation';
import { DateInput } from '@mantine/dates';
import { Button } from '@mantine/core';
import { SegmentedControl } from '@mantine/core';
import MapExtentSelect from './components/MapExtentSelect/index';
import PageSteps from '@/components/atoms/PageSteps';



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
		<Button className="worldCereal-Button" onClick={handleClick} >{isLoading ? 'Loading...' : 'Create'}</Button>
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
	const startDate = searchParams?.startDate || undefined;
	const startDateDate = startDate ? new Date(startDate) : new Date("2021-01-01");

	const endDate = searchParams?.endDate || undefined;
	const endDateDate = endDate ? new Date(endDate) : new Date("2021-12-30");

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
	}, [])

	return <>

		<DateInput
			value={startDateDate}
			disabled={true}
			onChange={(value) => setValue(transformDate(value), 'startDate', value)}
			label="Start date"
			placeholder="Select start date"
			valueFormat="YYYY-MM-DD"
			minDate={minDate}
			maxDate={endDateDate || maxDate}
			clearable={true}
		/>
		<DateInput
			value={endDateDate}
			disabled={true}
			onChange={(value) => setValue(transformDate(value), 'endDate')}
			label="End date"
			placeholder="Select end date"
			valueFormat="YYYY-MM-DD"
			minDate={startDateDate || minDate}
			maxDate={maxDate}
			clearable={true}
		/>
		<SegmentedControl defaultValue="NETCDF" data={[{ label: 'netCDF', value: 'NETCDF' }, { label: 'GeoTIFF', value: 'geotiff', disabled: true, }]} />
		<MapExtentSelect onBboxChange={onBboxChange} />
		<div>Extent: {bbox?.join(", ")}</div>
		<PageSteps NextButton={React.createElement(CreateJobButton, { setValues, params })} />
	</>
}