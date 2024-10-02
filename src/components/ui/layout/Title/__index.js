import {connect} from '@gisatcz/ptr-state';

import Presentation from './presentation';
import Action from '../../../../state/Action';
import Select from '../../../../state/Select';

const mapStateToProps = state => {
	return {
		title: Select.views.getActive(state)?.data?.nameDisplay,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		openOverlay: () => {
			dispatch(Action.components.set('IntroOverlay', 'open', true));
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Presentation);
