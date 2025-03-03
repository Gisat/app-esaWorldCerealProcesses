"use client"
import React from 'react';
import { Button, Group } from '@mantine/core';
import { useRouter, useSearchParams } from 'next/navigation';
import {IconArrowLeft, IconArrowRight, IconPlus} from "@tabler/icons-react";



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
	const newProcess = () => setActive(1);
	const processList = () => {
		window.location.href = 	`/${"processes-list"}`
	}

	return (
		<Group mt="xl">
			{activeStep === 2 ? <Button className="worldCereal-Button is-secondary is-ghost" variant="outline" onClick={prevStep} leftSection={<IconArrowLeft size={14} />}>Back</Button> : null}
			{NextButton || <Button className="worldCereal-Button" onClick={nextStep}>Next step</Button>}
			{activeStep === 3 ? <Button className="worldCereal-Button is-secondary is-ghost" variant="outline" onClick={newProcess} leftSection={<IconPlus size={14} />}>Setup new process</Button> : null}
			{activeStep === 3 ? <Button className="worldCereal-Button is-secondary is-ghost" variant="outline" onClick={processList} rightSection={<IconArrowRight size={14} />}>Go to the list</Button> : null}
		</Group>
	);
}