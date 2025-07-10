import DownloadStep2Client from '@features/pages/processes/download-official-products/steps/2/DownloadStep2Client';

/**
 * Component representing the second step in the "Download Official Products" process.
 *
 * This step allows users to define the bounding box, select output file format, and create a process.
 *
 * @component
 * @returns {JSX.Element} The rendered component for step 2 of the process.
 */
export default async function DownloadStep2() {
	return <DownloadStep2Client />;
}
