"use client";
import React from 'react'
import { Tabs } from '@mantine/core';
import './style.scss'

const Navbar = ({ children, activeValue }: { children: React.ReactNode, activeValue: string }) => {
	return (
		<Tabs value={activeValue}>
			<Tabs.List>
				{children}
			</Tabs.List>
		</Tabs>
	)
}

export default Navbar