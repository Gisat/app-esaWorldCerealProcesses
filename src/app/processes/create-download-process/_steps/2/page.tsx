"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { DateInput } from '@mantine/dates';
// import { products } from '@/constants/app';
import { SegmentedControl } from '@mantine/core';
import MapExtentSelect from './components/MapExtentSelect/index';



const minDate = new Date("2024-01-01");
const maxDate = new Date("2025-01-01");

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



	const setValue = (value: string | null | undefined, key: string, val?: any) => {
		const url = new URL(window.location.href);
		url.searchParams.set(key, value || "");
		router.push(url.toString())
	}

	const transformDate = (value: Date | null) => {
		const stringDate = value?.toLocaleDateString();
		if (stringDate) {
			return `${stringDate.substring(6, 10)}-${stringDate.substring(3, 5)}-${stringDate.substring(0, 2)}`
		} else {
			return null
		}
	}

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
		<MapExtentSelect />
	</>
}