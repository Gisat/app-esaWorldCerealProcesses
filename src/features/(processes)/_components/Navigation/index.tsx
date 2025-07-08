'use client';

import { navbarItems } from '@features/(processes)/_constants/app';
import NavbarItem from '@features/(shared)/_layout/_components/Navbar/NavbarItem';
import Navbar from '@features/(shared)/_layout/_components/Navbar';
import { usePathname, useSelectedLayoutSegment } from 'next/navigation';

export const Navigation = () => {
	const currentPath = usePathname();
	const segment = useSelectedLayoutSegment() || navbarItems[0].key;
	const basePath = currentPath.split(`/${segment}`)[0];

	return (
		<Navbar activeValue={segment}>
			{navbarItems.map((item) => {
				return (
					<NavbarItem
						key={item.key}
						active={segment === item.key}
						disabled={false}
						value={item.key}
						title={item.title}
						icon={item.icon}
						href={`${basePath}/${item.key}`}
					/>
				);
			})}
		</Navbar>
	);
};
