"use client";

import React from 'react';
import { Button } from '@mantine/core';
import { useRouter, useSearchParams } from 'next/navigation';
import { Select } from '@mantine/core';
import { products } from '@/features/(processes)/constants/app';
import PageSteps from '@/features/(processes)/_components/PageSteps';
import TwoColumns, { Column } from '@/features/(shared)/_components/ui/layout/TwoColumns';



const NextButton = ({ collection }: { collection: string | null }) => {

	// const [cookieValue, _] = useUserInfoCookie()
	// useRedirectIf(() => cookieValue === undefined, "/")

	const router = useRouter()
	const params = useSearchParams()
	const activeStep = Number.parseInt(params.get('step') || "");
	const disabled = !collection;
	const setActive = (step: any) => {
		const url = new URL(window.location.href);
		url.searchParams.set('step', step);
		router.push(url.toString())
	}

	const nextStep = () => setActive(activeStep + 1);
	return (
		<Button disabled={disabled} className={`worldCereal-Button${disabled ? ' is-disabled' : ''}`} onClick={nextStep} >Continue to set parameters</Button>
	);
}

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

	return <TwoColumns>
		<Column>
			<Select
				className="worldCereal-Select"
				size="md"
				allowDeselect={false}
				label="Product/Collection"
				placeholder="Pick one"
				data={products}
				value={productIsValid && collection || null}
				onChange={setValue}
			/>
			<PageSteps NextButton={React.createElement(NextButton, { collection })} />
		</Column>
	</TwoColumns>
}