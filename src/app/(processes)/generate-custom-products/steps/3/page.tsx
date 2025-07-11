import CreateProductsStep3Client from '@features/pages/processes/create-custom-products/steps/3/CreateProductsStep3Client';

/**
 * Component representing the third step in the "Create Custom Products" process.
 *
 * This step allows users to finalize the process and download the generated products.
 *
 * @component
 * @async
 * @returns {JSX.Element} The rendered component for step 3 of the process.
 */
export default async function DownloadStep3() {
	return <CreateProductsStep3Client />;
}
