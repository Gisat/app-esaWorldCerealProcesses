"use client"
import { usePathname, useSelectedLayoutSegment } from 'next/navigation'
import Navbar from "@/components/ui/layout/Navbar";
import NavbarItem from "@/components/ui/layout/Navbar/Item";
import Content from "@/components/ui/layout/Content";

const navbarItems = [
  {
    key: "processes-list",
    title: "List of processes",
    icon: "list",
  }, {
    key: "create-download-process",
    title: "Create download process",
    icon: "add",
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
