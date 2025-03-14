"use client";

import PageSteps from "@features/(processes)/_components/PageSteps";
import { SectionContainer } from "@features/(shared)/_layout/_components/Content/SectionContainer";
import { TextDescription } from "@features/(shared)/_layout/_components/Content/TextDescription";
import { TextLink } from "@features/(shared)/_layout/_components/Content/TextLink";
import TwoColumns, {
  Column,
} from "@features/(shared)/_layout/_components/Content/TwoColumns";
import { Button, Select, Space } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { createElement, useEffect } from "react";

import formParams from "@features/(processes)/_constants/download-official-products/formParams";

/**
 * NextButton component.
 * @param {Object} props - The component props.
 * @param {string | null} props.collection - The selected collection.
 * @returns {JSX.Element} - The rendered component.
 */
const NextButton = ({ collection, product }: { collection: string | null; product: string | null; }) => {
  const router = useRouter();
  const params = useSearchParams();
  const activeStep = Number.parseInt(params.get("step") || "");
  const disabled = !collection || !product;

  /**
   * Sets the active step in the URL search parameters.
   * @param {any} step - The step to set.
   */
  const setActive = (step: any) => {
    const url = new URL(window.location.href);
    url.searchParams.set("step", step);
    router.push(url.toString());
  };

  /**
   * Advances to the next step.
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
 * Page component.
 * @param {Object} props - The component props.
 * @param {Object} [props.searchParams] - The search parameters.
 * @param {string} [props.searchParams.query] - The query parameter.
 * @param {string} [props.searchParams.step] - The step parameter.
 * @param {string} [props.searchParams.collection] - The collection parameter.
 * @returns {JSX.Element} - The rendered component.
 */
export default function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    step?: string;
    collection?: string;
    product?: string;
  };
}) {

  const router = useRouter();
  const product = searchParams?.product || null;
  const collection = searchParams?.collection || null;
  const productIsValid = formParams.products.options.some(
    (option: { value: string }) => option.value === product
  );
  const collectionIsValid = formParams.collection.options.some(
    (option: { value: string }) => option.value === collection
  );

  useEffect(() => {
    setDefaults();
  }, [searchParams]);

  const setDefaults = () => {
    Object.entries(formParams).forEach(([key, value]) => {
      const defaultOption = value.options.find(
        (option) => option.default
      );
      if (defaultOption && !searchParams?.hasOwnProperty(key)) setValue(key, defaultOption.value);
    });
  };

  /**
   * Updates the specified query parameter in the current URL and navigates to the updated URL.
   *
   * @param param - The name of the query parameter to update.
   * @param value - The new value for the query parameter. If `null`, the parameter will be set to an empty string.
   */
  const setValue = (param: string, value: string | null) => {
    const url = new URL(window.location.href);
    url.searchParams.set(param, value || "");
    router.push(url.toString());
  };

  return (
    <TwoColumns>
      <Column>
        <SectionContainer>
          <TextDescription color="var(--textSecondaryColor)">
            Currently the WorldCereal project has created several <TextLink url="https://esa-worldcereal.org/en/products/global-maps" color="var(--textSecondaryColor)">global products</TextLink> for the year 2021.
          </TextDescription>
          <TextDescription color="var(--textSecondaryColor)">
            By end of 2026, a new batch of global products for a more recent year will be released.
          </TextDescription>
        </SectionContainer>
        <Select
          withAsterisk
          className="worldCereal-Select"
          size="md"
          allowDeselect={false}
          label="Select the product collection"
          data={formParams.collection.options}
          value={(collectionIsValid && collection) || null}
          onChange={(value) => setValue("collection", value)}
        />
        <Space h="md" />
        <Select
          withAsterisk
          className="worldCereal-Select"
          size="md"
          allowDeselect={false}
          label="Select your product"
          placeholder="Pick one"
          data={formParams.products.options}
          value={(productIsValid && product) || null}
          onChange={(value) => setValue("product", value)}
        />
        <PageSteps NextButton={createElement(NextButton, { collection, product })} />
      </Column>
    </TwoColumns>
  );
}
