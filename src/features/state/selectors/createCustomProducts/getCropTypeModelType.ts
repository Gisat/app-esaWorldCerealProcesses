import { WorldCerealState, CreateCustomProductsCropTypeModelTypeModel } from '@features/state/state.models';

export const getCropTypeModelType_customProducts = (state: WorldCerealState): CreateCustomProductsCropTypeModelTypeModel | undefined => {
	return state.createCustomProducts?.cropTypeModelType;
};
