import { act, fireEvent, render, screen } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import React from 'react';

import { InstanceWarningClient } from '@features/(shared)/_components/InstanceWarning/InstanceWarning.client';

const STORAGE_KEY = 'ewc-instance-warning-dismissed';

const renderServerHtml = (): string => renderToString(<InstanceWarningClient fullWindow text="DEV version" />);

const hydrateInto = (serverHtml: string): HTMLElement => {
	const container = document.createElement('div');
	container.innerHTML = serverHtml;
	document.body.appendChild(container);
	act(() => {
		hydrateRoot(container, <InstanceWarningClient fullWindow text="DEV version" />);
	});
	return container;
};

describe('InstanceWarningClient', () => {
	beforeEach(() => {
		window.sessionStorage.clear();
		document.body.innerHTML = '';
	});

	it('renders the warning when not dismissed', () => {
		render(<InstanceWarningClient fullWindow text="DEV version" />);
		expect(screen.getByText('DEV version')).toBeInTheDocument();
	});

	it('renders nothing when already dismissed in the session', () => {
		window.sessionStorage.setItem(STORAGE_KEY, 'true');
		render(<InstanceWarningClient fullWindow text="DEV version" />);
		expect(screen.queryByText('DEV version')).not.toBeInTheDocument();
	});

	it('dismisses on Continue and stays hidden across a remount', () => {
		const { unmount } = render(<InstanceWarningClient fullWindow text="DEV version" />);

		fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

		expect(screen.queryByText('DEV version')).not.toBeInTheDocument();

		unmount();
		render(<InstanceWarningClient fullWindow text="DEV version" />);
		expect(screen.queryByText('DEV version')).not.toBeInTheDocument();
	});

	it('respects the hidden prop regardless of storage', () => {
		render(<InstanceWarningClient hidden fullWindow text="DEV version" />);
		expect(screen.queryByText('DEV version')).not.toBeInTheDocument();
	});

	it('omits the banner from server HTML', () => {
		expect(renderServerHtml()).not.toContain('DEV version');
	});

	it('shows the banner after hydration for a fresh session', () => {
		const container = hydrateInto(renderServerHtml());
		expect(container.textContent).toContain('DEV version');
	});

	it('stays hidden after hydration when dismissed in the session', () => {
		window.sessionStorage.setItem(STORAGE_KEY, 'true');
		const container = hydrateInto(renderServerHtml());
		expect(container.textContent).not.toContain('DEV version');
	});
});
