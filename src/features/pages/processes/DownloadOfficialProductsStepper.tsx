'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useSharedState } from '@gisatcz/ptr-fe-core/client';
import { Stepper } from '@mantine/core';
import { getActiveStep } from '@features/state/selectors/downloadOfficialProducts/getActiveStep';
import { WorldCerealState } from '@features/state/state.models';
import { OneOfWorldCerealActions } from '@features/state/state.actions';
import { getCollection } from '@features/state/selectors/downloadOfficialProducts/getCollection';
import { getProduct } from '@features/state/selectors/downloadOfficialProducts/getProduct';
import { getOutputFileFormat } from '@features/state/selectors/downloadOfficialProducts/getOutputFileFormat';
import { getBBox } from '@features/state/selectors/downloadOfficialProducts/getBBox';

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
	const [state] = useSharedState<WorldCerealState, OneOfWorldCerealActions>();
	const activeStep = getActiveStep(state);
	const collection = getCollection(state);
	const product = getProduct(state);
	const outputFileFormat = getOutputFileFormat(state);
	const bbox = getBBox(state);

	// Determines if the first step is disabled based on the active step.
	const firstStepDisabled = activeStep === 3;

	// Determines if the second step is disabled based on the collection, product, and active step.
	const secondStepDisabled = !collection || !product || activeStep === 3;

	// Determines if the third step is disabled based on the collection, product, output file format, and bounding box.
	const thirdStepDisabled = !collection || !product || !outputFileFormat || !bbox;

	/**
	 * Navigates to the specified step in the process.
	 *
	 * @param {number} step - The step number to navigate to.
	 */
	const setActive = (step: number) => {
		router.push(`/download-official-products/steps/${step + 1}`); // navigates to the corresponding step URL
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
