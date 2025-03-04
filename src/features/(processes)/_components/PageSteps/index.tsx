"use client";
import { Button, Group } from "@mantine/core";
import { IconArrowLeft, IconArrowRight, IconPlus } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { cloneElement } from "react";

/**
 * Props for the PageSteps component.
 *
 * @typedef {Object} PageStepsProps
 * @property {React.ReactNode} [children] - Optional child elements.
 * @property {React.FunctionComponentElement<any>} [NextButton] - Custom next button component.
 * @property {boolean} [disabled] - If `true`, disables the next step button.
 */
interface PageStepsProps {
  children?: React.ReactNode;
  NextButton?: React.FunctionComponentElement<any>;
  disabled?: boolean;
}

/**
 * PageSteps Component
 *
 * A navigation component for stepping through multiple pages in a process.
 * Provides "Back" and "Next Step" buttons, with the option to inject a custom NextButton.
 *
 * @component
 * @param {PageStepsProps} props - Component props.
 * @returns {JSX.Element} A navigation UI for multi-step processes.
 */
export default function PageSteps({ NextButton, disabled }: PageStepsProps) {
  const router = useRouter();
  const params = useSearchParams();
  const activeStep = Number.parseInt(params.get("step") || "1", 10);

  /**
   * Updates the active step in the URL.
   *
   * @param {number} step - The step number to navigate to.
   */
  const setActive = (step: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set("step", step.toString());
    router.push(url.toString());
  };

  /**
   * Moves to the next step, unless disabled.
   */
  const nextStep = () => {
    if (!disabled) setActive(activeStep + 1);
  };

  /**
   * Moves to the previous step.
   */
  const prevStep = () => setActive(activeStep - 1);

  /**
   * Starts a new process by setting the active step to 1.
   */
  const newProcess = () => setActive(1);

  /**
   * Navigates to the process list page.
   */
  const processList = () => {
    window.location.href = `/${"processes-list"}`;
  };

  const backButton = activeStep === 2;
  const finalButtons = activeStep === 3;

  return (
    <Group mt="xl">
      {backButton && (
        <Button
          className="worldCereal-Button is-secondary is-ghost"
          variant="outline"
          onClick={prevStep}
          leftSection={<IconArrowLeft size={14} />}
        >
          Back
        </Button>
      )}
      {NextButton ? (
        cloneElement(NextButton, { disabled })
      ) : (
        <Button
          className="worldCereal-Button"
          onClick={nextStep}
          disabled={disabled}
        >
          Next step
        </Button>
      )}
      {finalButtons && (
        <>
          <Button
            className="worldCereal-Button is-secondary is-ghost"
            variant="outline"
            onClick={newProcess}
            leftSection={<IconPlus size={14} />}
          >
            Setup new process
          </Button>
          <Button
            className="worldCereal-Button is-secondary is-ghost"
            variant="outline"
            onClick={processList}
            leftSection={<IconArrowRight size={14} />}
          >
            Go to the list
          </Button>
        </>
      )}
    </Group>
  );
}