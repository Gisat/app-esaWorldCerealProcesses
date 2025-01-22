"useClient"

import type { Metadata } from "next";
import React from "react";
import { AppShell, AppShellMain, rem } from '@mantine/core';
import MantineProvider from "@features/(shared)/_components/providers/Mantine";

import './styles/index.scss';
import '../features/(shared)/variables.module.scss';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

import FaroFrontendMonitoring from '../features/(grafana)/_components/FaroFrontendMonitoring';
import Header from "@features/(shared)/_layout/_components/Header";

export const metadata: Metadata = {
  title: "WorldCereals Processes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Sen:wght@400;700&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet"></link>
      </head>
      <body className={`ptr-dark esaWorldCerealProcesses`}>
        <FaroFrontendMonitoring envUrl="/api/faro" />
        <MantineProvider>
          <AppShell
            withBorder={false}
            header={{ height: 50 }}
            padding="md"
            className={"worldCereal-appContent"}
          >
            <Header />
            <AppShellMain pt={`calc(${rem(50)}`}>
              {children}
            </AppShellMain>
          </AppShell>
        </MantineProvider>
      </body>
    </html>
  );
}
