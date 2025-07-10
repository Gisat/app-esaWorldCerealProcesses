import React from 'react';
import { ContentContainer } from '@features/(shared)/_layout/_components/Content/ContentContainer';
import { DownloadOfficialProductsStepper } from '@features/pages/processes/DownloadOfficialProductsStepper';

/**
 * Layout component for the "Download Official Products" section.
 *
 * This component wraps the provided children with a content container and a stepper
 * for navigating through the download process.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be rendered inside the layout.
 * @returns {JSX.Element} The rendered layout component.
 */
export default function DownloadLayout({ children }: { children: React.ReactNode }) {
	return (
		/**
		 * Wraps the children components inside a content container and stepper.
		 */
		<ContentContainer>
			<DownloadOfficialProductsStepper>{children}</DownloadOfficialProductsStepper>
		</ContentContainer>
	);
}
