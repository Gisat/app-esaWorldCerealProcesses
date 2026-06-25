import { WorldCerealState, CreateCustomProductsLandcoverHeadZipModel } from '@features/state/state.models';

export const getLandcoverHeadZip_customProducts = (state: WorldCerealState): CreateCustomProductsLandcoverHeadZipModel | undefined => {
	return state.createCustomProducts?.landcoverHeadZip;
};
