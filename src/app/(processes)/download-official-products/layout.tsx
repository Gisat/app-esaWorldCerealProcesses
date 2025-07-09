import React from 'react';
import { ContentContainer } from '@features/(shared)/_layout/_components/Content/ContentContainer';
import { DownloadOfficialProductsStepper } from '@features/pages/processes/DownloadOfficialProductsStepper';

export default function DownloadLayout({ children }: { children: React.ReactNode }) {
	return (
		<ContentContainer>
			<DownloadOfficialProductsStepper>{children}</DownloadOfficialProductsStepper>
		</ContentContainer>
	);
}
