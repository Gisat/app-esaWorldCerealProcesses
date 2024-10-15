"use client";
import React from 'react'
import { Tabs } from '@mantine/core';
import './style.scss'

const Navbar = ({ children, activeValue }: { children: React.ReactNode, activeValue: string }) => {
	return (
		<Tabs value={activeValue} className="worldCereal-Navbar">
			<Tabs.List className="worldCereal-Navbar-list">
				{children}
			</Tabs.List>
		</Tabs>
	)
}

export default Navbar