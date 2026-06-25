import { WorldCerealState, CreateCustomProductsMaskCroplandModel } from '@features/state/state.models';

export const getMaskCropland_customProducts = (state: WorldCerealState): CreateCustomProductsMaskCroplandModel | undefined => {
	return state.createCustomProducts?.maskCropland;
};
