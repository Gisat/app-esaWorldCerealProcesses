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

export const DownloadOfficialProductsStepper = ({ children }: { children: React.ReactNode }) => {
	const router = useRouter();
	const [state] = useSharedState<WorldCerealState, OneOfWorldCerealActions>();
	const activeStep = getActiveStep(state);
	const collection = getCollection(state);
	const product = getProduct(state);
	const secondStepDisabled = !collection || !product;
	const thirdStepDisabled = !collection || !product;

	const setActive = (step: number) => {
		router.push(`/download-official-products/steps/${step + 1}`); // navigates to /about
	};

	return (
		<Stepper className="worldCereal-Stepper" size="sm" active={activeStep - 1} onStepClick={setActive}>
			<Stepper.Step label="Select collection & product" style={{ cursor: 'pointer' }}>
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
