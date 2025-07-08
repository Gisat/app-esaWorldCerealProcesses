import { ContentWrapper as Content } from '@features/(shared)/_layout/_components/Content/ContentWrapper';
import { Navigation } from '@features/(processes)/_components/Navigation';

export default function ProcessesLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<Navigation />
			<Content>{children}</Content>
		</>
	);
}
