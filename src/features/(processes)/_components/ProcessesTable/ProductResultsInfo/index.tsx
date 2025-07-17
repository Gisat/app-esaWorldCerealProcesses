import './style.css';

const ProductResultsInfo = () => {
	return (
		<div className="worldCereal-ProductResultsInfo">
			<ul>
				<li>Band 1: "classification": The classification label of the pixel.</li>
				<li>Band 2: "confidence": The class-specific probablity of the winning class.</li>
				<li>
					Band 3 and beyond: "probability_xxx": Class-specific probablities. The "xxx" indicates the associated class.
				</li>
			</ul>
		</div>
	);
};

export default ProductResultsInfo;
