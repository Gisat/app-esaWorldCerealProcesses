import { AppSpecficReducerFunc } from '@gisatcz/ptr-fe-core/client';
import { WorldCerealState } from '../../state.models';
import { OneOfWorldCerealActions } from '../../state.actions';
import { SetProductAction } from '../../actions/downloadOfficialProduct/action.setProduct';

/**
 * Reducer function to handle the `setProduct` action.
 *
 * This function updates the `product` property in the `downloadOfficialProducts` section
 * of the application state based on the payload of the provided action.
 *
 * @type {AppSpecficReducerFunc<WorldCerealState, OneOfWorldCerealActions>}
 * @param {WorldCerealState} state - The current state of the application.
 * @param {SetProductAction} action - The action containing the new `product` value.
 * @returns {WorldCerealState} The updated application state.
 */
export const setProductHandler: AppSpecficReducerFunc<WorldCerealState, OneOfWorldCerealActions> = (
	state: WorldCerealState,
	action: SetProductAction
): WorldCerealState => {
	return {
		...state,
		downloadOfficialProducts: {
			...state.downloadOfficialProducts,
			product: action.payload,
		},
	};
};
