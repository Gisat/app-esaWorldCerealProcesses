"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Select } from '@mantine/core';
import { products } from '@/constants/app';
import PageSteps from '@/components/atoms/PageSteps';

export default function Page({ searchParams }: {
	searchParams?: {
		query?: string;
		step?: string;
		collection?: string;
	}
}) {
	const router = useRouter()
	const collection = searchParams?.collection || null;
	const productIsValid = products.some((p: { value: String }) => p.value === collection);


	const setValue = (collection: string | null) => {

		const url = new URL(window.location.href);
		url.searchParams.set('collection', collection || "");
		router.push(url.toString())
	}

	return <>
		<Select
			allowDeselect={false}
			label="Product/Collection"
			placeholder="Pick one"
			data={products}
			value={productIsValid && collection}
			onChange={setValue}
		/>
		<PageSteps />
	</>
}