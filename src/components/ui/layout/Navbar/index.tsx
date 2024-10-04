"use client";
import React from 'react'
import { Tabs } from '@mantine/core';
import './style.scss'

const Navbar = ({ children }: { children: React.ReactNode }) => {
	return (
		// <nav className='ptr-navbar'>
		// 	<div className="container flex justify-between h-[14vh] items-center">
		// 		{children}
		// 	</div>
		// </nav>
		<Tabs defaultValue="first">
			<Tabs.List>
				{children}
			</Tabs.List>
		</Tabs>
	)
}

export default Navbar