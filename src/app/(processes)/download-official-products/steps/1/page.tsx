import DownloadStep1Client from '@features/pages/processes/download-official-products/steps/1/DownloadStep1Client';

/**
 * Component representing the first step in the "Download Official Products" process.
 *
 * This step allows users to select a product collection and a specific product.
 *
 * @component
 * @returns {JSX.Element} The rendered component for step 1 of the process.
 */
export default async function DownloadStep1() {
	return <DownloadStep1Client />;
}
