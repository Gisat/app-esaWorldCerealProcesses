"use client"
import React, { useEffect, useState } from 'react';
import { Stepper, Button, Group } from '@mantine/core';
import { useRouter, useSearchParams } from 'next/navigation';
// import { useRouter, } from 'next/router';



export default function DownloadLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter()
	const params = useSearchParams()
	// const [active, setActive] = useState(1);
	// const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
	// const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));
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

	const nextStep = () => setActive(activeStep + 1);
	const prevStep = () => setActive(activeStep - 1);

	const backVisible = activeStep > 1
	const nextVisible = activeStep < 3
	return (
		<>
			<Stepper active={activeStep} >
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

			<Group justify="center" mt="xl">
				{backVisible ? <Button variant="default" onClick={prevStep}>Back</Button> : null}
				{nextVisible ? <Button onClick={nextStep}>Next step</Button> : null}
			</Group>
		</>
	);
}