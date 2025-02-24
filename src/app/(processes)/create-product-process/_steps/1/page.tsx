"use client";

import PageSteps from "@features/(processes)/_components/PageSteps";
import { products } from "@features/(processes)/_constants/app";
import TwoColumns, {
  Column,
} from "@features/(shared)/_layout/_components/TwoColumns";
import { Button, Select } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { createElement } from "react";

/**
 * NextButton Component
 *
 * @param {Object} props - Component props
 * @param {string | null} props.collection - Selected collection value
 * @returns {JSX.Element} A button component to navigate to the next step
 */
const NextButton = ({ collection }: { collection: string | null }) => {
  const router = useRouter();
  const params = useSearchParams();
  const activeStep = Number.parseInt(params.get("step") || "");
  const disabled = !collection;

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
      Continue to set parameters
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
    collection?: string;
  };
}) {
  const router = useRouter();
  const collection = searchParams?.collection || null;
  const productIsValid = products.some(
    (p: { value: string }) => p.value === collection
  );

  /**
   * Updates the collection parameter in the URL
   *
   * @param {string | null} collection - Selected collection value
   */
  const setValue = (collection: string | null) => {
    const url = new URL(window.location.href);
    url.searchParams.set("collection", collection || "");
    router.push(url.toString());
  };

  return (
    <TwoColumns>
      <Column>
        <Select
          withAsterisk
          className="worldCereal-Select"
          size="md"
          allowDeselect={false}
          label="Product/Collection"
          placeholder="Pick one"
          data={products}
          value={(productIsValid && collection) || null}
          onChange={setValue}
        />
        <PageSteps NextButton={createElement(NextButton, { collection })} />
      </Column>
    </TwoColumns>
  );
}
