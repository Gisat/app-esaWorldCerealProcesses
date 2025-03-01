"use client";
import { Button, Group } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { cloneElement } from "react";

interface PageStepsProps {
  children?: React.ReactNode;
  NextButton?: React.FunctionComponentElement<any>;
  disabled?: boolean;
}

export default function PageSteps({ NextButton, disabled }: PageStepsProps) {
  const router = useRouter();
  const params = useSearchParams();
  const activeStep = Number.parseInt(params.get("step") || "");

  const setActive = (step: any) => {
    const url = new URL(window.location.href);
    url.searchParams.set("step", step);
    router.push(url.toString());
  };

  const nextStep = () => {
    if (!disabled) setActive(activeStep + 1);
  };
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
