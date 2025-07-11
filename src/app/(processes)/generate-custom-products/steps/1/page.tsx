import CreateProductsStep1Client from '@features/pages/processes/create-custom-products/steps/1/CreateProductsStep1Client';

/**
 * Component representing the first step in the "Create Custom Products" process.
 *
 * This step allows users to select a product collection and a specific product.
 *
 * @component
 * @async
 * @returns {JSX.Element} The rendered component for step 1 of the process.
 */
export default async function CreateProductsStep1() {
	return <CreateProductsStep1Client />;
}
