"useClient";

import MantineProvider from "@features/(shared)/_components/providers/Mantine";
import { AppShell, AppShellMain, rem } from "@mantine/core";
import type { Metadata } from "next";
import React from "react";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "./styles/index.css";

import Header from "@features/(shared)/_layout/_components/Header";
import FaroFrontendMonitoring from "../features/(grafana)/_components/FaroFrontendMonitoring";

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
        {/* TODO: fix warning. Font should not be imported this way */}
        <link
          href="https://fonts.googleapis.com/css2?family=Sen:wght@400;700&family=Roboto:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body className={`esaWorldCerealProcesses`}>
        <FaroFrontendMonitoring envUrl="/api/faro" />
        <MantineProvider>
          <AppShell
            withBorder={false}
            padding={0}
            className={"worldCereal-appContent"}
          >
            <Header />
            <AppShellMain pt={`calc(${rem(64)})`}>{children}</AppShellMain>
          </AppShell>
        </MantineProvider>
      </body>
    </html>
  );
}
