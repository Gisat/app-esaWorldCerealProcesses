// "use client"
import React from 'react';


const getStepComponent = (step: number) => {
	switch (step) {
		case 1:
			return <>
				Step 1
			</>
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