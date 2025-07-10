import { AppShell, AppShellMain, rem } from '@mantine/core';
import type { Metadata } from 'next';
import React from 'react';
import { MantineProvider } from '@features/(shared)/_components/providers/MantineProvider/MantineProvider';
/** Import of style files */
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@gisatcz/ptr-fe-core/client/styles';
import '@features/styles/index.css';
import './index.css';

import { Header } from '@features/(shared)/_layout/_components/Header';
// TODO uncomment when Faro is ready for react 19
// import FaroFrontendMonitoring from '../features/(grafana)/_components/FaroFrontendMonitoring';
import InstanceWarning from '@features/(shared)/_components/InstanceWarning';
import { PersistentStateWrapper } from '@features/wrappers/PersistentStateWrapper';

export const metadata: Metadata = {
	title: 'WorldCereals Processes',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				{/* TODO: fix warning. Font should not be imported this way */}
				<link
					href="https://fonts.googleapis.com/css2?family=Sen:wght@400;700&family=Roboto:wght@300;400;500;700&display=swap"
					rel="stylesheet"
				></link>
				<title>WorldCereal Processes</title>
			</head>
			<body className={`esaWorldCerealProcesses`}>
				<InstanceWarning />
				{/* TODO uncomment when Faro is ready for react 19 */}
				{/*<FaroFrontendMonitoring envUrl="/api/faro" />*/}
				<MantineProvider>
					<PersistentStateWrapper>
						<AppShell withBorder={false} padding={0} className={'worldCereal-appContent'}>
							<Header />
							<AppShellMain pt={`calc(${rem(64)})`}>{children}</AppShellMain>
						</AppShell>
					</PersistentStateWrapper>
				</MantineProvider>
			</body>
		</html>
	);
}
