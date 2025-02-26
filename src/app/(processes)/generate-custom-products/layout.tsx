"use client";
import { Stepper } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";

/**
 * DownloadLayout component that provides a step-based UI for managing a multi-step process.
 * It ensures a valid step is selected and updates the URL accordingly.
 *
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - The content to render inside each step.
 * @returns {JSX.Element} A stepper layout for guiding users through a download or processing workflow.
 *
 * @example
 * <DownloadLayout>
 *   <YourStepComponent />
 * </DownloadLayout>
 */
export default function DownloadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const activeStep = Number.parseInt(params.get("step") || "");

  useEffect(() => {
    const setActive = (step: any) => {
      const url = new URL(window.location.href);
      url.searchParams.set("step", step);
      router.push(url.toString());
    };

    const activeStep = Number.parseInt(params.get("step") || "");
    if (activeStep > 3 || activeStep < 1 || Number.isNaN(activeStep)) {
      setActive(1);
    }
  }, [params, router]);

  return (
    <Suspense>
      <Stepper
        className="worldCereal-Stepper"
        size="sm"
        active={activeStep - 1}
      >
        <Stepper.Step
          label="Select product & model"
          allowStepClick={false}
          allowStepSelect={false}
        >
          {children}
        </Stepper.Step>
        <Stepper.Step
          label="Set parameters & create process"
          allowStepClick={false}
          allowStepSelect={false}
        >
          {children}
        </Stepper.Step>
        <Stepper.Step
          label="Start process"
          allowStepClick={false}
          allowStepSelect={false}
        >
          {children}
        </Stepper.Step>
        <Stepper.Completed>{children}</Stepper.Completed>
      </Stepper>
    </Suspense>
  );
}
