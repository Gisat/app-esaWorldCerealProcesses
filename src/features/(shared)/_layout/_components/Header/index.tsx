'use client';
import EsaLogo from '@features/(processes)/_components/EsaLogo';
import { AppShellHeader, Button } from '@mantine/core';
import { IconLogout, IconUser } from '@tabler/icons-react';
import Link from 'next/link';
import './style.css';
import Title from './Title';
import useSWR from 'swr';
import { swrFetcher } from '@features/(shared)/_logic/utils';

export const Header = () => {
	const { data: userInfoValue, error, isLoading } = useSWR('/api/auth/user-info', swrFetcher);

	if (isLoading) return null;

	if (error) console.error('Error fetching user info', error);

	return (
		<AppShellHeader>
			<div className="worldCereal-Header">
				<Title />
				<div className="worldCereal-Header-tools">
					<EsaLogo className="worldCereal-Header-esaLogo" />
					{!userInfoValue?.email ? (
						<Link href="/api/auth/iam">
							<Button className="worldCereal-Button" autoContrast leftSection={<IconUser size={14} />} size="sm">
								Login/Sign up
							</Button>
						</Link>
					) : (
						<>
							<span className="worldCereal-Header-email">{userInfoValue?.email ?? 'unknown'}</span>
							<Button
								leftSection={<IconLogout size={14} />}
								className="worldCereal-Button is-secondary is-ghost"
								size="sm"
								component="a"
								variant="outline"
								href="api/auth/logout"
							>
								Logout
							</Button>
						</>
					)}
				</div>
			</div>
		</AppShellHeader>
	);
};
