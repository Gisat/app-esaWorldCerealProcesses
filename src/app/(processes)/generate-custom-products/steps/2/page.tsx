/**
 * Asynchronous React component for rendering the second step in the "Create Custom Products" process.
 *
 * This component imports and renders the `CreateProductsStep2Client` component.
 *
 * @function CreateProductsStep2
 * @async
 * @returns {JSX.Element} The rendered `CreateProductsStep2Client` component.
 */
import CreateProductsStep2Client from '@features/pages/processes/create-custom-products/steps/2/CreateProductsStep2Client';

export default async function CreateProductsStep2() {
	return <CreateProductsStep2Client />;
}
