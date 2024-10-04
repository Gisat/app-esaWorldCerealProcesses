// "use client"
import React from 'react';
import Step1 from './_steps/1/page';


const getStepComponent = (step: number) => {
	switch (step) {
		case 1:
			return <Step1 />
		case 2:
			return <>
				Step 2
			</>
		case 3:
			return <>
				Step 3
			</>
		default:
			return <>
				Incorect parameters
			</>
	}
}

export default function Page({ searchParams }: {
	searchParams?: {
		query?: string;
		step?: string;
	};
}) {
	// const [active, setActive] = useState(1);
	// const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
	// const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));


	const step = Number.parseInt(searchParams?.step || "");

	return getStepComponent(step);

}