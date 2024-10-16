"use client"
import { Suspense } from 'react'
import { usePathname, useSelectedLayoutSegment } from 'next/navigation'
import Navbar from "@/components/ui/layout/Navbar";
import NavbarItem from "../../components/ui/layout/Navbar/NavbarItem";
import Content from "@/components/ui/layout/Content";
import { navbarItems } from "@/constants/app";

export default function ProcessesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentPath = usePathname();
  const segment = useSelectedLayoutSegment() || navbarItems[0].key

  const basePath = currentPath.split(`/${segment}`)[0]
  return (
    <Suspense>
      <Navbar activeValue={segment}>
        {navbarItems.map((item) => <NavbarItem key={item.key} active={segment === item.key} value={item.key} title={item.title} icon={item.icon} href={`${basePath}/${item.key}`} />)}
      </Navbar>
      <Content>{children}</Content>
    </Suspense>

  );
}
