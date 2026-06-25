import { WorldCerealState, CreateCustomProductsPostprocessKernelSizeCroplandModel } from '@features/state/state.models';

export const getPostprocessKernelSizeCropland_customProducts = (state: WorldCerealState): CreateCustomProductsPostprocessKernelSizeCroplandModel | undefined => {
	return state.createCustomProducts?.postprocessKernelSizeCropland;
};
