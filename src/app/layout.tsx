import { MantineProvider } from '@features/(shared)/_components/providers/MantineProvider/MantineProvider';
import FaroClient from '@features/(shared)/_components/providers/grafana/FaroClient';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { AppShell, AppShellMain, rem } from '@mantine/core';
import { Roboto, Sen } from 'next/font/google';
import type { Metadata } from 'next';
import React from 'react';
/** Import of style files */
import '@features/styles/index.css';
import '@gisatcz/ptr-fe-core/client/styles';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import './index.css';

import { Header } from '@features/(shared)/_layout/_components/Header';
// TODO uncomment when Faro is ready for react 19
// import FaroFrontendMonitoring from '../features/(grafana)/_components/FaroFrontendMonitoring';
import InstanceWarning from '@features/(shared)/_components/InstanceWarning';

const roboto = Roboto({
	weight: ['300', '400', '500', '700'],
	subsets: ['latin'],
	variable: '--font-roboto',
	display: 'swap',
});

const sen = Sen({
	weight: ['400', '700'],
	subsets: ['latin'],
	variable: '--font-sen',
	display: 'swap',
});

export const metadata: Metadata = {
	title: 'WorldCereals Processes',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {

	const showInstanceWarning = process.env.INSTANCE_WARNING_HIDDEN !== 'true';
	// Manually configure whether the InstanceWarning should occupy the full window.
	// Set to `true` to show as fullWindow, or `false` to show inline. Change here instead of via env var.
	const instanceWarningFullWindow = true;

	return (
		<html lang="en" className={`${roboto.variable} ${sen.variable}`}>
			<head>
				<title>WorldCereal Processes</title>
			</head>
			<body className={`esaWorldCerealProcesses`}>
				<NuqsAdapter>
					{showInstanceWarning ? <InstanceWarning fullWindow={instanceWarningFullWindow} /> : null}
					<FaroClient />
					{/*<FaroFrontendMonitoring envUrl="/api/faro" />*/}
					<MantineProvider>
						<AppShell withBorder={false} padding={0} className={'worldCereal-appContent'}>
							<Header />
							<AppShellMain pt={`calc(${rem(64)})`}>{children}</AppShellMain>
						</AppShell>
					</MantineProvider>
				</NuqsAdapter>
			</body>
		</html>
	);
}
