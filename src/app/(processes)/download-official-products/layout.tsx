"use client"
import React, { useEffect, Suspense, useState, useCallback } from 'react';
import { Stepper } from '@mantine/core';
import { useSearchParams } from 'next/navigation';
import { ContentContainer } from '@features/(shared)/_layout/_components/Content/ContentContainer';
import { useUrlParam } from '@features/(shared)/_hooks/_url/useUrlParam';

/**
 * DownloadLayout component that provides a step-based UI for managing a multi-step process.
 * It ensures a valid step is selected and updates the URL accordingly.
 *
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - The content to render inside each step.
 * @returns {JSX.Element} A stepper layout for guiding users through a download or processing workflow.
 */
export default function DownloadLayout({ children }: { children: React.ReactNode }) {
  const params = useSearchParams();
  const { setUrlParam } = useUrlParam(); // Use the custom hook to push params to URL

  const [activeStep, setActiveStep] = useState<number>(1);

  /**
   * Updates the step in the URL and local state.
   *
   * @param {number} step - The step number to navigate to.
   */
  const setActive = useCallback(
    (step: number) => {
      if (step < 1 || step > 3) return; // Prevent setting invalid steps
      if (Number(params.get("step")) !== step) {
        setUrlParam("step", step.toString()); // Use the custom hook to update the URL
      }
      setActiveStep(step); // Update local state
    },
    [params, setUrlParam] // Memoized function to avoid unnecessary re-renders
  );

  // Initialize step from URL and ensure it's valid
  useEffect(() => {
    const stepFromURL = Number(params.get("step")) || 1;
    if (stepFromURL < 1 || stepFromURL > 3 || Number.isNaN(stepFromURL)) {
      setActive(1); // Reset to step 1 if invalid
    } else {
      setActive(stepFromURL);
    }
  }, [params, setActive]); // Include `setActive` in the dependency array

	return (
		<Suspense>
			<ContentContainer>
				<Stepper 
					className="worldCereal-Stepper" 
					size="sm" 
					active={activeStep - 1}
					onStepClick={(step) => step === 0 && activeStep === 2 && setActive(1)}
					allowNextStepsSelect={false}
				>
					<Stepper.Step label="Select collection & product" allowStepClick={false} style={{ cursor: activeStep === 2 ? "pointer" : "default" }}>
						{children}
					</Stepper.Step>
					<Stepper.Step label="Set parameters & create process" allowStepClick={false} style={{ cursor: "default"}}>
						{children}
					</Stepper.Step>
					<Stepper.Step label="Start process" allowStepClick={false} style={{ cursor: "default"}}>
						{children}
					</Stepper.Step>
					<Stepper.Completed>
						{children}
					</Stepper.Completed>
				</Stepper>
			</ContentContainer>
		</Suspense>
	);
}