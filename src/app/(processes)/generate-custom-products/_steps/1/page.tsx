"use client";

import PageSteps from "@features/(processes)/_components/PageSteps";
import { customProducts } from "@features/(processes)/_constants/app";
import { useUrlParam } from "@features/(shared)/_hooks/_url/useUrlParam";
import TwoColumns, {
  Column,
} from "@features/(shared)/_layout/_components/Content/TwoColumns";
import { Button, Select } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { createElement } from "react";

/**
 * NextButton Component
 *
 * @param {Object} props - Component props
 * @param {string | null} props.product - Selected product value
 * @returns {JSX.Element} A button component to navigate to the next step
 */
const NextButton = ({ product }: { product: string | null }) => {
  const router = useRouter();
  const params = useSearchParams();
  const activeStep = Number.parseInt(params.get("step") || "");
  const disabled = !product;

  /**
   * Updates the step parameter in the URL
   *
   * @param {number} step - Step number to navigate to
   */
  const setActive = (step: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set("step", step.toString());
    router.push(url.toString());
  };

  /**
   * Moves to the next step
   */
  const nextStep = () => setActive(activeStep + 1);

  return (
    <Button
      rightSection={<IconArrowRight size={14} />}
      disabled={disabled}
      className={`worldCereal-Button${disabled ? " is-disabled" : ""}`}
      onClick={nextStep}
    >
      Continue to set parameters & create process
    </Button>
  );
};

/**
 * Page Component
 *
 * @param {Object} props - Component props
 * @param {Object} [props.searchParams] - Search parameters from URL
 * @param {string} [props.searchParams.query] - Query string parameter
 * @param {string} [props.searchParams.step] - Step string parameter
 * @param {string} [props.searchParams.collection] - Collection string parameter
 * @returns {JSX.Element} Page component rendering product selection and navigation
 */
export default function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    step?: string;
    product?: string;
  };
}) {
  // hooks
  const { setUrlParam } = useUrlParam();

  const product = searchParams?.product || null;
  const productIsValid = customProducts.some(
    (p: { value: string }) => p.value === product
  );

  return (
    <TwoColumns>
      <Column>
        <Select
          withAsterisk
          className="worldCereal-Select"
          size="md"
          allowDeselect={false}
          label="Select your product"
          placeholder="Pick one"
          data={customProducts}
          value={(productIsValid && product) || null}
          onChange={(value) => value && setUrlParam("product", value)}
          mb="md"
        />
        <Select
          className="worldCereal-Select"
          size="md"
          allowDeselect={false}
          label="Select model"
          placeholder="Default model"
          value={(productIsValid && product) || null}
          onChange={(value) => value && setUrlParam("model", value)}
          disabled
        />
        <PageSteps NextButton={createElement(NextButton, { product })} />
      </Column>
    </TwoColumns>
  );
}
