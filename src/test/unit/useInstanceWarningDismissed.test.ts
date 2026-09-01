import { act, renderHook } from '@testing-library/react';

import { useInstanceWarningDismissed } from '@features/(shared)/_hooks/useInstanceWarningDismissed';

const STORAGE_KEY = 'ewc-instance-warning-dismissed';

describe('useInstanceWarningDismissed', () => {
	beforeEach(() => {
		window.sessionStorage.clear();
	});

	it('returns not dismissed when nothing is persisted', () => {
		const { result } = renderHook(() => useInstanceWarningDismissed());
		expect(result.current[0]).toBe(false);
	});

	it('returns dismissed when sessionStorage holds a true flag', () => {
		window.sessionStorage.setItem(STORAGE_KEY, 'true');
		const { result } = renderHook(() => useInstanceWarningDismissed());
		expect(result.current[0]).toBe(true);
	});

	it('persists the dismissal to sessionStorage and re-renders consumers', () => {
		const { result } = renderHook(() => useInstanceWarningDismissed());

		act(() => {
			result.current[1]();
		});

		expect(result.current[0]).toBe(true);
		expect(window.sessionStorage.getItem(STORAGE_KEY)).toBe('true');
	});
});
