"use client"
import { Suspense } from 'react'
import { usePathname, useSelectedLayoutSegment } from 'next/navigation'
import { navbarItems } from "@features/(processes)/_constants/app";
import NavbarItem from '@features/(shared)/_layout/_components/Navbar/NavbarItem';
import Navbar from '@features/(shared)/_layout/_components/Navbar';
import Content from '@features/(shared)/_layout/_components/Content';

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
