"use client";
import React, { createElement } from 'react'
import { Tabs, rem } from '@mantine/core';
import Link from 'next/link'
import './style.scss'

const NavbarItem = ({ title, icon, href, active, value }: { title: string, icon: string, href: string, active: boolean, value: string }) => {
	return (
		<Link href={href} >
			<Tabs.Tab className="worldCereal-NavbarItem" value={value} leftSection={createElement(icon, {
				style: { width: rem(18), height: rem(18) },
			})}>{title}</Tabs.Tab>
		</Link>
	)
}

export default NavbarItem