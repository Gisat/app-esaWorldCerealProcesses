import { WorldCerealState, CreateCustomProductsCroptypeHeadZipModel } from '@features/state/state.models';

export const getCroptypeHeadZip_customProducts = (state: WorldCerealState): CreateCustomProductsCroptypeHeadZipModel | undefined => {
	return state.createCustomProducts?.croptypeHeadZip;
};
