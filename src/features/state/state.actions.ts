import { AppSpecificAction, OneOfStateActions } from '@gisatcz/ptr-fe-core/client';
import { SetProductAction } from '@features/state/actions/downloadOfficialProduct/action.setProduct';
import { SetCollectionAction } from '@features/state/actions/downloadOfficialProduct/action.setCollection';
import { SetActiveStepAction } from '@features/state/actions/downloadOfficialProduct/action.setActiveStep';
import { SetOutputFileFormatAction } from '@features/state/actions/downloadOfficialProduct/action.setOutputFileFormat';
import { SetBackgroundLayerAction } from '@features/state/actions/downloadOfficialProduct/action.setBackgroundLayer';
import { SetBBoxAction } from '@features/state/actions/downloadOfficialProduct/action.setBBox';

/**
 * List of all actions that can be dispatched to the world cereal app state.
 * This includes both the standard state actions and the custom actions defined for the world cereal app .
 */
export type OneOfWorldCerealActions = AppSpecificAction &
	(
		| OneOfStateActions // from the ptr-fe-core/client as basic of known actions
		| SetActiveStepAction
		| SetCollectionAction
		| SetProductAction
		| SetOutputFileFormatAction
		| SetBackgroundLayerAction
		| SetBBoxAction
	);
// ...add more custom actions as needed
