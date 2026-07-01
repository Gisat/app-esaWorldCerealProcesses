'use client';
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Stepper } from '@mantine/core';
import { useQueryStates } from 'nuqs';
import {
	downloadOfficialProductsSearchParams,
	serializeDownloadOfficialProductsSearchParams,
} from '@features/(processes)/_constants/download-official-products/searchParams';
import { parseBbox } from '@features/(processes)/_utils/bbox';

/**
 * Component representing a stepper for the "Download Official Products" process.
 *
 * This stepper guides the user through three steps: selecting a collection and product,
 * setting parameters and creating a process, and starting the process.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be rendered within each step.
 * @returns {JSX.Element} The rendered stepper component.
 */
export const DownloadOfficialProductsStepper = ({ children }: { children: React.ReactNode }) => {
	const router = useRouter();
	const pathname = usePathname();
	const activeStep = Number(pathname.split('/').pop()) || 1;

	const [{ collection, product, format, bbox, backgroundLayer }] = useQueryStates(
		downloadOfficialProductsSearchParams
	);

	const bboxArr = parseBbox(bbox);

	// Determines if the first step is disabled based on the active step.
	const firstStepDisabled = activeStep === 3;

	// Determines if the second step is disabled based on the collection, product, and active step.
	const secondStepDisabled = !collection || !product || activeStep === 3;

	// Determines if the third step is disabled based on the collection, product, output file format, and bounding box.
	const thirdStepDisabled = !collection || !product || !format || !bboxArr;

	/**
	 * Navigates to the specified step in the process, forwarding the current URL state
	 * so the user's selections survive the route change.
	 *
	 * @param {number} step - The 0-indexed step in the Stepper (0 -> steps/1, 1 -> steps/2, 2 -> steps/3).
	 */
	const setActive = (step: number) => {
		const targetStep = step + 1;
		if (targetStep === activeStep) return;
		const href = serializeDownloadOfficialProductsSearchParams(
			`/download-official-products/steps/${targetStep}`,
			{ collection, product, format, bbox, backgroundLayer }
		);
		router.push(href);
	};

	return (
		<Stepper className="worldCereal-Stepper" size="sm" active={activeStep - 1} onStepClick={setActive}>
			<Stepper.Step
				label="Select collection & product"
				style={{ cursor: !firstStepDisabled ? 'pointer' : 'default' }}
				disabled={firstStepDisabled}
			>
				{children}
			</Stepper.Step>
			<Stepper.Step
				label="Set parameters & create process"
				style={{ cursor: !secondStepDisabled ? 'pointer' : 'default' }}
				disabled={secondStepDisabled}
			>
				{children}
			</Stepper.Step>
			<Stepper.Step
				label="Start process"
				style={{ cursor: !thirdStepDisabled ? 'pointer' : 'default' }}
				disabled={thirdStepDisabled}
			>
				{children}
			</Stepper.Step>
		</Stepper>
	);
};