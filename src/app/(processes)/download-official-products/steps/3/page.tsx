import { Suspense } from 'react';
import DownloadStep3Client from '@features/pages/processes/download-official-products/steps/3/DownloadStep3Client';

export default async function DownloadStep3() {
	return (
		<Suspense>
			<DownloadStep3Client />
		</Suspense>
	);
}
