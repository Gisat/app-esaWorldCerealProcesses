"use client";
import React from 'react'
// import { NavLink } from '@mantine/core';
import { Tabs, rem } from '@mantine/core';
import Link from 'next/link'
import classNames from 'classnames'
import { usePathname } from 'next/navigation'
import './style.scss'
// import { BiMenuAltRight } from 'react-icons/bi'
// import { AiOutlineClose } from 'react-icons/ai'

const Navbar = ({ title, icon, href, active }: { title: string, icon: string, href: string, active: boolean }) => {
	const currentPath = usePathname();

	return (
		// <Link href={href} className={active || currentPath === href ? "active" : ""}>{title}</Link>

		// <Link href={href}>
		// <NavLink component={Link} href={href} className={classNames('NavbarItem', { active: active || currentPath === href })} label={title}>
		// </NavLink>
		// <Tabs.Tab value={href} leftSection={<IconPhoto style={iconStyle} />}>
		<Tabs.Tab value={href} >
			<Link href={href} >{title}</Link>
		</Tabs.Tab>
		// </Link>

	)
}

export default Navbar