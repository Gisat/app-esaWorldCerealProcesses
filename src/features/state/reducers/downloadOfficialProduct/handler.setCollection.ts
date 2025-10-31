import { AppSpecficReducerFunc } from '@gisatcz/ptr-fe-core/client';
import { WorldCerealState } from '../../state.models';
import { OneOfWorldCerealActions } from '../../state.actions';
import { SetCollectionAction } from '../../actions/downloadOfficialProduct/action.setCollection';

/**
 * Reducer function to handle the `setCollection` action.
 *
 * This function updates the `collection` property in the `downloadOfficialProducts` section
 * of the application state based on the payload of the provided action.
 *
 * @type {AppSpecficReducerFunc<WorldCerealState, OneOfWorldCerealActions>}
 * @param {WorldCerealState} state - The current state of the application.
 * @param {SetCollectionAction} action - The action containing the new `collection` value.
 * @returns {WorldCerealState} The updated application state.
 */
export const setCollectionHandler: AppSpecficReducerFunc<WorldCerealState, OneOfWorldCerealActions> = (
	state: WorldCerealState,
	action: SetCollectionAction
): WorldCerealState => {
	return {
		...state,
		downloadOfficialProducts: {
			...state.downloadOfficialProducts,
			collection: action.payload,
		},
	};
};
