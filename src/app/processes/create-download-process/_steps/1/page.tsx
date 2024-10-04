"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Select } from '@mantine/core';
import { products } from '@/constants/app';

export default function Page({ searchParams }: {
	searchParams?: {
		query?: string;
		step?: string;
		product?: string;
	}
}) {
	const router = useRouter()
	const product = searchParams?.product || null;
	const productIsValid = products.some((p: { value: String }) => p.value === product);
	console.log("xxx", searchParams, product);


	const setValue = (product: string | null) => {

		const url = new URL(window.location.href);
		url.searchParams.set('product', product || "");
		router.push(url.toString())
	}

	return <>
		<Select
			allowDeselect={false}
			label="Product/Collection"
			placeholder="Pick one"
			data={products}
			value={productIsValid && product}
			onChange={setValue}
		/>
	</>
}