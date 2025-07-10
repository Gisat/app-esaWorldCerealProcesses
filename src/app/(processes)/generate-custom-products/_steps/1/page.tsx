'use client';

import PageSteps from '@features/(processes)/_components/PageSteps';
import TwoColumns, { Column } from '@features/(shared)/_layout/_components/Content/TwoColumns';
import { Button, Select } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createElement, Suspense, useCallback, useEffect } from 'react';

import formParams from '@features/(processes)/_constants/generate-custom-products/formParams';

/**
 * NextButton Component
 *
 * @param {Object} props - Component props
 * @param {string | null} props.product - Selected product value
 * @returns {JSX.Element} A button component to navigate to the next step
 */
const NextButton = ({ product, model }: { product: string | null; model: string | null }) => {
	const router = useRouter();
	const params = useSearchParams();
	const activeStep = Number.parseInt(params.get('step') || '');
	const disabled = !product || !model;

	/**
	 * Updates the step parameter in the URL
	 *
	 * @param {number} step - Step number to navigate to
	 */
	const setActive = (step: number) => {
		const url = new URL(window.location.href);
		url.searchParams.set('step', step.toString());
		router.push(url.toString());
	};

	/**
	 * Moves to the next step
	 */
	const nextStep = () => setActive(activeStep + 1);

	return (
		<Button
			rightSection={<IconArrowRight size={14} />}
			disabled={disabled}
			className={`worldCereal-Button${disabled ? ' is-disabled' : ''}`}
			onClick={nextStep}
		>
			Continue to set parameters & create process
		</Button>
	);
};

/**
 * Page Component
 *
 * @param {Object} props - Component props
 * @param {Object} [props.searchParams] - Search parameters from URL
 * @param {string} [props.searchParams.query] - Query string parameter
 * @param {string} [props.searchParams.step] - Step string parameter
 * @param {string} [props.searchParams.collection] - Collection string parameter
 * @returns {JSX.Element} Page component rendering product selection and navigation
 */
export default function Page({
	searchParams,
}: {
	searchParams?: {
		query?: string;
		step?: string;
		product?: string;
		model?: string;
	};
}) {
	const router = useRouter();
	const product = searchParams?.product || null;
	const productIsValid = formParams.product.options.some((p) => p.value === product);
	const model = searchParams?.model || null;
	const modelIsValid = formParams.model.options.some((m) => m.value === model);

	/**
	 * Updates the specified query parameter in the current URL and navigates to the updated URL.
	 *
	 * @param param - The name of the query parameter to update.
	 * @param value - The new value for the query parameter. If `null`, the parameter will be set to an empty string.
	 */
	const setValue = useCallback(
		(param: string, value: string | null) => {
			const url = new URL(window.location.href);
			url.searchParams.set(param, value || '');
			router.push(url.toString());
		},
		[router]
	);

	const setDefaults = useCallback(() => {
		Object.entries(formParams).forEach(([key, value]) => {
			const defaultOption = value.options.find((option) => option.default);
			if (defaultOption && !Object.prototype.hasOwnProperty.call(searchParams, key)) setValue(key, defaultOption.value);
		});
	}, [searchParams, setValue]);

	useEffect(() => {
		setDefaults();
	}, [setDefaults]);

	return (
		<Suspense>
			<TwoColumns>
				<Column>
					<Select
						withAsterisk
						className="worldCereal-Select"
						size="md"
						allowDeselect={false}
						label="Select your product"
						placeholder="Pick one"
						data={formParams.product.options}
						value={(productIsValid && product) || null}
						onChange={(value) => value && setValue('product', value)}
						mb="md"
					/>
					<Select
						className="worldCereal-Select"
						size="md"
						allowDeselect={false}
						label="Select model"
						placeholder="Pick one"
						data={formParams.model.options}
						value={(modelIsValid && model) || null}
						onChange={(value) => value && setValue('model', value)}
					/>
					<PageSteps NextButton={createElement(NextButton, { product, model })} />
				</Column>
			</TwoColumns>
		</Suspense>
	);
}
