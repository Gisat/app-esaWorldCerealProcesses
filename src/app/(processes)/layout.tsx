"use client";
import { navbarItems } from "@features/(processes)/_constants/app";
import { ContentWrapper as Content } from "@features/(shared)/_layout/_components/Content/ContentWrapper";
import Navbar from "@features/(shared)/_layout/_components/Navbar";
import NavbarItem from "@features/(shared)/_layout/_components/Navbar/NavbarItem";
import { usePathname, useSelectedLayoutSegment } from "next/navigation";
import { Suspense } from "react";

export default function ProcessesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentPath = usePathname();
  const segment = useSelectedLayoutSegment() || navbarItems[0].key;
  const basePath = currentPath.split(`/${segment}`)[0];

  return (
    <Suspense>
      <Navbar activeValue={segment}>
        {navbarItems.map((item) => {
          return (
            <NavbarItem
              key={item.key}
              active={segment === item.key}
              disabled={false}
              value={item.key}
              title={item.title}
              icon={item.icon}
              href={`${basePath}/${item.key}`}
            />
          );
        })}
      </Navbar>
      <Content>{children}</Content>
    </Suspense>
  );
}
