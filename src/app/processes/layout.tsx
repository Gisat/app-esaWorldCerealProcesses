"use client"
import { usePathname, useSelectedLayoutSegment } from 'next/navigation'
import Navbar from "@/components/ui/layout/Navbar";
import NavbarItem from "@/components/ui/layout/Navbar/Item";

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
  const segment = useSelectedLayoutSegment()

  const basePath = currentPath.split(`/${segment}`)[0]
  return (

    <div className={`ptr-processes`}>
      <Navbar>
        {navbarItems.map((item) => <NavbarItem key={item.key} active={segment === item.key} title={item.title} icon={item.icon} href={`${basePath}/${item.key}`} />)}
      </Navbar>
      {children}
    </div >
  );
}
