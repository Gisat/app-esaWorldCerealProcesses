import React from 'react';
import Step1 from './_steps/1/page';
import Step2 from './_steps/2/page';
import Step3 from './_steps/3/page';

const getStepComponent = (step: number, searchParams: any) => {
	switch (step) {
		case 1:
			return <Step1 searchParams={searchParams} />
		case 2:
			return <Step2 searchParams={searchParams} />
		case 3:
			return <Step3 searchParams={searchParams} />

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
	}
}) {

	// const [active, setActive] = useState(1);
	// const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
	// const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

	const step = Number.parseInt(searchParams?.step || "");

	return getStepComponent(step, searchParams);

}