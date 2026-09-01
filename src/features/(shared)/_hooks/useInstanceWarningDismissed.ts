'use client';

import { useCallback, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'ewc-instance-warning-dismissed';

/** Subscribers notified whenever the dismissed flag changes. */
const dismissedListeners = new Set<() => void>();

const readPersisted = (): boolean =>
	typeof window !== 'undefined' && window.sessionStorage.getItem(STORAGE_KEY) === 'true';

const getDismissedSnapshot = (): boolean => readPersisted();

const subscribeToDismissed = (listener: () => void): (() => void) => {
	dismissedListeners.add(listener);
	return () => {
		dismissedListeners.delete(listener);
	};
};

/**
 * Server snapshot — always treated as dismissed.
 *
 * The banner must not be part of the server-rendered HTML: the browser paints
 * that HTML before React hydrates, so a banner rendered on the server would
 * visibly flash for users who already dismissed it. The real `sessionStorage`
 * value is read client-side after hydration via `getDismissedSnapshot`.
 */
const getServerDismissedSnapshot = (): boolean => true;

/**
 * Tracks whether the instance warning was dismissed for the current session.
 *
 * The dismissed flag is persisted in `sessionStorage`, so the warning stays
 * dismissed for the current browser tab/session but reappears in a new session
 * (new tab or browser restart). The server snapshot treats the warning as
 * dismissed, so SSR renders nothing — the banner appears only after hydration
 * when the real `sessionStorage` value is known, which avoids a visible blink
 * on refresh for users who already dismissed it.
 *
 * The returned dismiss action persists the flag and notifies every subscribed
 * consumer so they re-render immediately.
 *
 * @returns {readonly [boolean, () => void]} Tuple of the dismissed flag and the dismiss action.
 */
export const useInstanceWarningDismissed = (): readonly [boolean, () => void] => {
	const dismissed = useSyncExternalStore(subscribeToDismissed, getDismissedSnapshot, getServerDismissedSnapshot);

	const dismiss = useCallback(() => {
		window.sessionStorage.setItem(STORAGE_KEY, 'true');
		for (const listener of dismissedListeners) {
			listener();
		}
	}, []);

	return [dismissed, dismiss];
};
