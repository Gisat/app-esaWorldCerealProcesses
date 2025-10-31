import React from 'react';
import { ContentContainer } from '@features/(shared)/_layout/_components/Content/ContentContainer';
import { CreateCustomProductsStepper } from '@features/pages/processes/CreateCustomProductsStepper';

/**
 * Asynchronous React component that provides a layout for downloading custom products.
 *
 * This component wraps its children inside a `ContentContainer` and a `CreateCustomProductsStepper`.
 *
 * @function CustomProcessLayout
 * @async
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be rendered inside the layout.
 * @returns {JSX.Element} - The rendered layout containing the children components.
 */
export default async function CustomProcessLayout({ children }: { children: React.ReactNode }) {
	return (
		/**
		 * Wraps the children components inside a content container and stepper.
		 */
		<ContentContainer>
			<CreateCustomProductsStepper>{children}</CreateCustomProductsStepper>
		</ContentContainer>
	);
}
