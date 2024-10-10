"use client"
import React from 'react';
import { Button, Group } from '@mantine/core';
import { useRouter, useSearchParams } from 'next/navigation';



export default function PageSteps({ children, nextButton }: { children?: React.ReactNode, nextButton?: React.ReactNode }) {
	const router = useRouter()
	const params = useSearchParams()
	const activeStep = Number.parseInt(params.get('step') || "");


	const setActive = (step: any) => {
		const url = new URL(window.location.href);
		url.searchParams.set('step', step);
		router.push(url.toString())
	}

	const nextStep = () => setActive(activeStep + 1);
	const prevStep = () => setActive(activeStep - 1);

	const backVisible = activeStep > 1
	const nextVisible = activeStep < 3
	return (
		<Group justify="center" mt="xl">
			{backVisible ? <Button variant="default" onClick={prevStep}>Back</Button> : null}
			{nextVisible ? nextButton || <Button onClick={nextStep}>Next step</Button> : null}
		</Group>
	);
}