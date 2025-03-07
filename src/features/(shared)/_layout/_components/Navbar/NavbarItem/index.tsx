"use client";
import { Tabs, rem } from "@mantine/core";
import { IconTypeface } from "@tabler/icons-react";
import Link from "next/link";
import { createElement } from "react";
import "./style.css";

const NavbarItem = ({
  title,
  icon,
  href,
  value,
  disabled,
}: {
  title: string;
  icon: typeof IconTypeface;
  href: string;
  active: boolean;
  value: string;
  disabled: boolean;
}) => {
  return (
    <Link href={href}>
      <Tabs.Tab
        className="worldCereal-NavbarItem"
        value={value}
        disabled={disabled}
        leftSection={createElement(icon, {
          style: { width: rem(18), height: rem(18) },
        })}
      >
        {title}
      </Tabs.Tab>
    </Link>
  );
};

export default NavbarItem;
