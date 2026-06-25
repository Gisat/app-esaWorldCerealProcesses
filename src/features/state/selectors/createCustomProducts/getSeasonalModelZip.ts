import { WorldCerealState, CreateCustomProductsSeasonalModelZipModel } from '@features/state/state.models';

export const getSeasonalModelZip_customProducts = (state: WorldCerealState): CreateCustomProductsSeasonalModelZipModel | undefined => {
	return state.createCustomProducts?.seasonalModelZip;
};
