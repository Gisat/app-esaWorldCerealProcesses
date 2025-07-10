'use client';

import Link from 'next/link';
import Image from 'next/image';
import { pages } from '@features/(processes)/_constants/app';
import logoData from '../logo';
import './style.css';

const Title = () => {
	const title = 'Processes';
	return (
		<Link className="worldCereal-Title" href={`/${pages.home.url}`}>
			<div>
				<Image src={`data:image/jpeg;base64,${logoData}`} alt="Celeals Logo" width={30} height={30} />
			</div>
			<h1>
				<span>WorldCereal</span>
				<span>{title}</span>
			</h1>
		</Link>
	);
};

export default Title;
