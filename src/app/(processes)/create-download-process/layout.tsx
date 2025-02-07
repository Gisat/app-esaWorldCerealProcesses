"use client"
import React, { useEffect, Suspense } from 'react';
import { Stepper } from '@mantine/core';
import { useRouter, useSearchParams } from 'next/navigation';

export default function DownloadLayout({ children }: { children: React.ReactNode }) {
		
	const router = useRouter()
	const params = useSearchParams()
	const activeStep = Number.parseInt(params.get('step') || "");

	useEffect(() => {

		const setActive = (step: any) => {
			const url = new URL(window.location.href);
			url.searchParams.set('step', step);
			router.push(url.toString())
		}

		const activeStep = Number.parseInt(params.get('step') || "");
		if (activeStep > 3 || activeStep < 1 || Number.isNaN(activeStep)) {
			setActive(1)
		}

	}, [params, router])

	return (
		<Suspense>
			<Stepper className="worldCereal-Stepper" size="sm" active={activeStep - 1} >
				<Stepper.Step label="Select product" allowStepClick={false} allowStepSelect={false}>
					{children}
				</Stepper.Step>
				<Stepper.Step label="Create process" allowStepClick={false} allowStepSelect={false}>
					{children}
				</Stepper.Step>
				<Stepper.Step label="Start process" allowStepClick={false} allowStepSelect={false}>
					{children}
				</Stepper.Step>
				<Stepper.Completed>
					{children}
				</Stepper.Completed>
			</Stepper>

		</Suspense>
	);
}