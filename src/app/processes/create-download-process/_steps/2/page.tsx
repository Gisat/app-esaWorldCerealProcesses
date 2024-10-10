"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DateInput } from '@mantine/dates';
// import { products } from '@/constants/app';
import { Button } from '@mantine/core';
import { SegmentedControl } from '@mantine/core';
import MapExtentSelect from './components/MapExtentSelect/index';
import PageSteps from '@/components/atoms/PageSteps';



const minDate = new Date("2024-01-01");
const maxDate = new Date("2025-01-01");

type ExtentType = [] | number[] | undefined;

export default function Page({ searchParams }: {
	searchParams?: {
		query?: string;
		step?: string;
		startDate?: string;
		endDate?: string;
	}
}) {
	const router = useRouter()
	const startDate = searchParams?.startDate || undefined;
	const startDateDate = startDate ? new Date(startDate) : undefined;

	const endDate = searchParams?.endDate || undefined;
	const endDateDate = endDate ? new Date(endDate) : undefined;

	const [extent, setExtent] = useState([] as ExtentType);


	const setValue = (value: string | null | undefined, key: string, val?: any) => {
		const url = new URL(window.location.href);
		url.searchParams.set(key, value || "");
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

	const onExtentChange = (extent?: ExtentType) => {
		setExtent(extent)
		setValue(extent?.join(","), 'extent');
	}

	const onNextClick = () => {
		//disable

		// create case and get id

		// go to next step with caseID (keep url params)
	}

	const NextButton = <Button onClick={onNextClick} disabled={!startDateDate || !endDateDate} >Další</Button>

	return <>

		<DateInput
			value={startDateDate}
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
			onChange={(value) => setValue(transformDate(value), 'endDate')}
			label="End date"
			placeholder="Select end date"
			valueFormat="YYYY-MM-DD"
			minDate={startDateDate || minDate}
			maxDate={maxDate}
			clearable={true}
		/>
		<SegmentedControl color="blue" defaultValue="netcdf" data={[{ label: 'netCDF', value: 'netcdf' }, { label: 'GeoTIFF', value: 'geotiff', disabled: true, }]} />
		<MapExtentSelect onExtentChange={onExtentChange} />
		<div>Extent: {extent?.join(", ")}</div>
		<PageSteps nextButton={NextButton} />
	</>
}