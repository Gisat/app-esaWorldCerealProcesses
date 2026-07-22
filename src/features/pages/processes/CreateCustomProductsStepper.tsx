'use client';
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Stepper } from '@mantine/core';
import { useQueryStates } from 'nuqs';
import {
	generateCustomProductsSearchParams,
	serializeGenerateCustomProductsSearchParams,
} from '@features/(processes)/_constants/generate-custom-products/searchParams';
import { parseBbox } from '@features/(processes)/_utils/bbox';

export const CreateCustomProductsStepper = ({ children }: { children: React.ReactNode }) => {
	const router = useRouter();
	const pathname = usePathname();
	const activeStep = Number(pathname.split('/').pop()) || 1;

	const [{ processId, bbox, endDate, backgroundLayer, orbitState, postprocessMethodCroptype, postprocessKernelSizeCroptype, cropTypeModelType }] =
		useQueryStates(generateCustomProductsSearchParams);

	const bboxArr = parseBbox(bbox);

	const firstStepDisabled = activeStep === 3;

	const secondStepDisabled = !processId || activeStep === 3;

	const thirdStepDisabled = !processId || !bboxArr || !endDate;

	const setActive = (step: number) => {
		const targetStep = step + 1;
		if (targetStep === activeStep) return;
		const href = serializeGenerateCustomProductsSearchParams(
			`/generate-custom-products/steps/${targetStep}`,
			{ processId, bbox, endDate, backgroundLayer, orbitState, postprocessMethodCroptype, postprocessKernelSizeCroptype, cropTypeModelType }
		);
		router.push(href);
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
