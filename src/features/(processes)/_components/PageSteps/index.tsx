"use client"
import React from 'react';
import { Button, Group } from '@mantine/core';
import { useRouter, useSearchParams } from 'next/navigation';
import {IconArrowLeft} from "@tabler/icons-react";



export default function PageSteps({ NextButton }: { children?: React.ReactNode, NextButton?: React.FunctionComponentElement<any> }) {
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
	return (
		<Group justify="center" mt="xl">
			{backVisible ? <Button className="worldCereal-Button is-secondary is-ghost" variant="outline" onClick={prevStep} leftSection={<IconArrowLeft size={14} />}>Back</Button> : null}
			{NextButton || <Button className="worldCereal-Button" onClick={nextStep}>Next step</Button>}
		</Group>
	);
}