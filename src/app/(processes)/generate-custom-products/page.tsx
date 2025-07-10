import Step1 from './_steps/1/page';
import Step2 from './_steps/2/page';
import Step3 from './_steps/3/page';
import { Suspense } from 'react';

/**
 * Returns the appropriate step component based on the provided step number.
 *
 * @param {number} step - The current step number.
 * @param {Object} searchParams - The search parameters passed to the step component.
 * @returns {JSX.Element} The corresponding step component or an error message if the step is invalid.
 *
 * @example
 * const stepComponent = getStepComponent(2, { query: "example" });
 * console.log(stepComponent); // Renders <Step2 searchParams={{ query: "example" }} />
 */
const getStepComponent = (step: number, searchParams: any) => {
	switch (step) {
		case 1:
			return <Step1 searchParams={searchParams} />;
		case 2:
			return <Step2 searchParams={searchParams} />;
		case 3:
			return <Step3 searchParams={searchParams} />;

		default:
			return <>Incorect parameters</>;
	}
};

/**
 * The main page component that renders the appropriate step component
 * based on the `step` query parameter in `searchParams`.
 *
 * @param {Object} props - Component props.
 * @param {Object} [props.searchParams] - Optional search parameters containing query values.
 * @param {string} [props.searchParams.query] - An optional query string.
 * @param {string} [props.searchParams.step] - The step number as a string.
 * @returns {JSX.Element} The corresponding step component based on the step number.
 *
 * @example
 * <Page searchParams={{ step: "1", query: "example" }} />
 */
export default function Page({
	searchParams,
}: {
	searchParams?: {
		query?: string;
		step?: string;
	};
}) {
	const step = Number.parseInt(searchParams?.step || '');

	return <Suspense>{getStepComponent(step, searchParams)}</Suspense>;
}
