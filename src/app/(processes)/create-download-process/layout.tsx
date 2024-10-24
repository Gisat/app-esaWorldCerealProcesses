"use client"
import React, { useEffect, Suspense } from 'react';
import { Stepper } from '@mantine/core';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthCookieRedirect } from '@/hooks/useAuthCookieRedirect';

export default function DownloadLayout({ children }: { children: React.ReactNode }) {
	useAuthCookieRedirect()
	
	const router = useRouter()
	const params = useSearchParams()
	const activeStep = Number.parseInt(params.get('step') || "");

	const setActive = (step: any) => {
		const url = new URL(window.location.href);
		url.searchParams.set('step', step);
		router.push(url.toString())
	}
	useEffect(() => {
		const activeStep = Number.parseInt(params.get('step') || "");
		if (activeStep > 3 || activeStep < 1 || Number.isNaN(activeStep)) {
			setActive(1)
		}

	}, [])

	return (
		<Suspense>
			<Stepper className="worldCereal-Stepper" active={activeStep - 1} >
				<Stepper.Step label="Step 1" description="Select product" allowStepClick={false} allowStepSelect={false}>
					{children}
				</Stepper.Step>
				<Stepper.Step label="Step 2" description="Set parameters" allowStepClick={false} allowStepSelect={false}>
					{children}
				</Stepper.Step>
				<Stepper.Step label="Step 3" description="Overview" allowStepClick={false} allowStepSelect={false}>
					{children}
				</Stepper.Step>
				<Stepper.Completed>
					{children}
				</Stepper.Completed>
			</Stepper>

		</Suspense>
	);
}