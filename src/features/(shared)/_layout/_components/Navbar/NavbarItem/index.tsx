"use client";
import React, { createElement } from 'react'
import { Tabs, rem } from '@mantine/core';
import Link from 'next/link'
import './style.scss'
import { IconTypeface } from "@tabler/icons-react";

const NavbarItem = ({ title, icon, href, value }: { title: string, icon: typeof IconTypeface, href: string, active: boolean, value: string }) => {
	return (
		<Link href={href} >
			<Tabs.Tab className="worldCereal-NavbarItem" value={value} leftSection={createElement(icon, {
				style: { width: rem(18), height: rem(18) },
			})}>{title}</Tabs.Tab>
		</Link>
	)
}

export default NavbarItem