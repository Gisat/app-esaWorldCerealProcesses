'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useSharedState } from '@gisatcz/ptr-fe-core/client';
import { Stepper } from '@mantine/core';
import { WorldCerealState } from '@features/state/state.models';
import { OneOfWorldCerealActions } from '@features/state/state.actions';
import { getActiveStep_customProducts } from '@features/state/selectors/createCustomProducts/getActiveStep';
import { getModel_customProducts } from '@features/state/selectors/createCustomProducts/getModel';
import { getProduct_customProducts } from '@features/state/selectors/createCustomProducts/getProduct';
import { getOutputFileFormat_customProducts } from '@features/state/selectors/createCustomProducts/getOutputFileFormat';
import { getBBox_customProducts } from '@features/state/selectors/createCustomProducts/getBBox';
import { getEndDate_customProducts } from '@features/state/selectors/createCustomProducts/getEndDate';

export const CreateCustomProductsStepper = ({ children }: { children: React.ReactNode }) => {
	const router = useRouter();
	const [state] = useSharedState<WorldCerealState, OneOfWorldCerealActions>();
	const activeStep = getActiveStep_customProducts(state);
	const model = getModel_customProducts(state);
	const product = getProduct_customProducts(state);
	const outputFileFormat = getOutputFileFormat_customProducts(state);
	const bbox = getBBox_customProducts(state);
	const endDate = getEndDate_customProducts(state);

	// Determines if the first step is disabled based on the active step.
	const firstStepDisabled = activeStep === 3;

	// Determines if the second step is disabled based on the collection, product, and active step.
	const secondStepDisabled = !model || !product || activeStep === 3;

	// Determines if the third step is disabled based on the collection, product, output file format, and bounding box.
	const thirdStepDisabled = !model || !product || !outputFileFormat || !bbox || !endDate;

	/**
	 * Navigates to the specified step in the process.
	 *
	 * @param {number} step - The step number to navigate to.
	 */
	const setActive = (step: number) => {
		router.push(`/generate-custom-products/steps/${step + 1}`); // navigates to the corresponding step URL
	};

	return (
		<Stepper className="worldCereal-Stepper" size="sm" active={activeStep - 1} onStepClick={setActive}>
			<Stepper.Step
				label="Select product & model"
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
