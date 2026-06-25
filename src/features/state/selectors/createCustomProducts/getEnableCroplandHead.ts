import { WorldCerealState, CreateCustomProductsEnableCroplandHeadModel } from '@features/state/state.models';

export const getEnableCroplandHead_customProducts = (state: WorldCerealState): CreateCustomProductsEnableCroplandHeadModel | undefined => {
	return state.createCustomProducts?.enableCroplandHead;
};
