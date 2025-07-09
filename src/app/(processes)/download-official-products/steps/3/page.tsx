'use client';

import { useSharedState } from '@gisatcz/ptr-fe-core/client';
import { WorldCerealState } from '@features/state/state.models';
import { OneOfWorldCerealActions } from '@features/state/state.actions';
import { useEffect } from 'react';
import { WorldCerealStateActionType } from '@features/state/state.actionTypes';

export default function DownloadStep2() {
	const [state, dispatch] = useSharedState<WorldCerealState, OneOfWorldCerealActions>();

	useEffect(() => {
		dispatch({
			type: WorldCerealStateActionType.DOWNLOAD_OFFICIAL_PRODUCT_SET_ACTIVE_STEP,
			payload: 3,
		});
	}, []);

	return <>Step3</>;
}
