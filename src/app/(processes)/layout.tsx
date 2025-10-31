import { ContentWrapper as Content } from '@features/(shared)/_layout/_components/Content/ContentWrapper';
import { Navigation } from '@features/(processes)/_components/Navigation';

/**
 * Layout component for the "Processes" section of the application.
 *
 * This component wraps the provided children with a navigation bar and content wrapper.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be rendered inside the layout.
 * @returns {JSX.Element} The rendered layout component.
 */
export default async function ProcessesLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			{/* Renders the navigation bar for the "Processes" section */}
			<Navigation />
			{/* Wraps the children components inside the content wrapper */}
			<Content>{children}</Content>
		</>
	);
}
