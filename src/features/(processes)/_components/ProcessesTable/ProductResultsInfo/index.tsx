import { TextParagraph } from '@features/(shared)/_layout/_components/Content/TextParagraph';
import { TextLink } from '@features/(shared)/_layout/_components/Content/TextLink';

import './style.css';

const ProductResultsInfo = () => {
	return (
		<div className="worldCereal-ProductResultsInfo">
			<TextParagraph>
				For comprehensive details regarding the results, please refer to the documentation.<br />
				<TextLink url="https://worldcereal.github.io/worldcereal-documentation/vdm/launch.html">
					WorldCereal Documentation Portal
				</TextLink>
			</TextParagraph>
		</div>
	);
};

export default ProductResultsInfo;
