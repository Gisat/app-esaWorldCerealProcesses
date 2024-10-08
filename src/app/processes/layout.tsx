"use client"
import { usePathname, useSelectedLayoutSegment } from 'next/navigation'
import Navbar from "@/components/ui/layout/Navbar";
import NavbarItem from "../../components/ui/layout/Navbar/NavbarItem";
import Content from "@/components/ui/layout/Content";
import {IconCirclePlus, IconListDetails} from "@tabler/icons-react";

const navbarItems = [
  {
    key: "processes-list",
    title: "List of processes",
    icon: IconListDetails,
  }, {
    key: "create-download-process",
    title: "Create download process",
    icon: IconCirclePlus,
  }
]

export default function ProcessesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentPath = usePathname();
  const segment = useSelectedLayoutSegment() || navbarItems[0].key

  const basePath = currentPath.split(`/${segment}`)[0]
  return (

    <div className={`ptr-processes`}>
      <Navbar activeValue={segment}>
        {navbarItems.map((item) => <NavbarItem key={item.key} active={segment === item.key} value={item.key} title={item.title} icon={item.icon} href={`${basePath}/${item.key}`} />)}
      </Navbar>
      <Content>{children}</Content>
    </div >
  );
}
