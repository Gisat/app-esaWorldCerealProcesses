"use client";
import { navbarItems } from "@features/(processes)/_constants/app";
import { useIsLoggedIn } from "@features/(shared)/_hooks/user.isLogged";
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

  const { isLoggedIn } = useIsLoggedIn("api/auth/user-info");

  return (
    <Suspense>
      <Navbar activeValue={segment}>
        {navbarItems.map((item) => {
          const isDisabled = !isLoggedIn() && item.key !== "home"; // If user is not logged - disable all except "home". If user logged - all Navbar items are enabled (disable={false})
          return (
            <NavbarItem
              key={item.key}
              active={segment === item.key}
              disabled={isDisabled}
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
