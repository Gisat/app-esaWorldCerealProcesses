import type { Metadata } from "next";

import '../styles/index.scss';
import '../styles/_variables.scss';

import Header from "@/components/ui/layout/Header";

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
      <body className={`ptr-light`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
