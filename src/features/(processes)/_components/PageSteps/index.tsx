"use client";
import { Button, Group } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
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

  const backVisible = activeStep > 1;

  return (
    <Group justify="center" mt="xl">
      {backVisible && (
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
    </Group>
  );
}
