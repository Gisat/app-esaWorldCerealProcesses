import './style.css';

const ProductValuesInfo = () => {
	return (
		<div className="worldCereal-ProductValuesInfo">
			<ul>
				<li>
					0 - the <b>negative class</b> (e.g. no-cropland in temporarycrops product, not maize in maize product)
				</li>
				<li>
					100 - the <b>positive class</b> (e.g. active in activecropland product, irrigated in irrigation product)
				</li>
				<li>
					254 - <b>no cropland</b> class in seasonal products
				</li>
				<li>
					255 - <b>no data</b>
				</li>
			</ul>
		</div>
	);
};

export default ProductValuesInfo;
