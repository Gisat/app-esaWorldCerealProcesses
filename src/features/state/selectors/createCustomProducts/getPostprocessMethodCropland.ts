import { WorldCerealState, CreateCustomProductsPostprocessMethodCroplandModel } from '@features/state/state.models';

export const getPostprocessMethodCropland_customProducts = (state: WorldCerealState): CreateCustomProductsPostprocessMethodCroplandModel | undefined => {
	return state.createCustomProducts?.postprocessMethodCropland;
};
