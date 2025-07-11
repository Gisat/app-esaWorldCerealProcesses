import { AppSpecificAction, OneOfStateActions } from '@gisatcz/ptr-fe-core/client';
import { SetProductAction } from '@features/state/actions/downloadOfficialProduct/action.setProduct';
import { SetCollectionAction } from '@features/state/actions/downloadOfficialProduct/action.setCollection';
import { SetActiveStepAction } from '@features/state/actions/downloadOfficialProduct/action.setActiveStep';
import { SetOutputFileFormatAction } from '@features/state/actions/downloadOfficialProduct/action.setOutputFileFormat';
import { SetBackgroundLayerAction } from '@features/state/actions/downloadOfficialProduct/action.setBackgroundLayer';
import { SetBBoxAction } from '@features/state/actions/downloadOfficialProduct/action.setBBox';
import { SetCurrentJobKeyAction } from '@features/state/actions/downloadOfficialProduct/action.setCurrentJobKey';
import { ResetSettingsAction } from '@features/state/actions/downloadOfficialProduct/action.resetSettings';
import { SetActiveStepAction_customProducts } from '@features/state/actions/createCustomProducts/action.setActiveStep';
import { ResetSettingsAction_customProducts } from '@features/state/actions/createCustomProducts/action.resetSettings';
import { SetBackgroundLayerAction_customProducts } from '@features/state/actions/createCustomProducts/action.setBackgroundLayer';
import { SetBBoxAction_customProducts } from '@features/state/actions/createCustomProducts/action.setBBox';
import { SetCurrentJobKeyAction_customProducts } from '@features/state/actions/createCustomProducts/action.setCurrentJobKey';
import { SetOutputFileFormatAction_customProducts } from '@features/state/actions/createCustomProducts/action.setOutputFileFormat';
import { SetProductAction_customProducts } from '@features/state/actions/createCustomProducts/action.setProduct';
import { SetModelAction_customProducts } from '@features/state/actions/createCustomProducts/action.setModel';
import { SetEndDateAction_customProducts } from '@features/state/actions/createCustomProducts/action.setEndDate';

/**
 * List of all actions that can be dispatched to the world cereal app state.
 * This includes both the standard state actions and the custom actions defined for the world cereal app .
 */
export type OneOfWorldCerealActions = AppSpecificAction &
	(
		| OneOfStateActions // from the ptr-fe-core/client as basic of known actions
		// Download official products
		| SetActiveStepAction
		| SetCollectionAction
		| SetProductAction
		| SetOutputFileFormatAction
		| SetBackgroundLayerAction
		| SetBBoxAction
		| SetCurrentJobKeyAction
		| ResetSettingsAction
		// Create custom products
		| SetActiveStepAction_customProducts
		| SetBackgroundLayerAction_customProducts
		| SetBBoxAction_customProducts
		| SetCurrentJobKeyAction_customProducts
		| SetOutputFileFormatAction_customProducts
		| SetProductAction_customProducts
		| SetModelAction_customProducts
		| SetEndDateAction_customProducts
		| ResetSettingsAction_customProducts
	);
