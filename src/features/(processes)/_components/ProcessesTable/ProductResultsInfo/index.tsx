import { List, Text, Stack } from '@mantine/core';

import './style.css';

const ProductResultsInfo = () => {
	return (
		<Stack gap="sm" className="worldCereal-ProductResultsInfo">
			<Text fw={500} mt="sm" mb={4} c="var(--textPrimaryColor)">
				Each raster contains at least three bands:
			</Text>
			<List type="unordered" spacing="xs" withPadding>
				<List.Item>Band 1: classification – The classification label of the pixel.</List.Item>
				<List.Item>Band 2: confidence – The class-specific probability of the winning class.</List.Item>
				<List.Item>
					Band 3 and beyond: probability_xxx – Class-specific probabilities. The &quot;xxx&quot; indicates the
					associated class.
				</List.Item>
			</List>
		</Stack>
	);
};

export default ProductResultsInfo;
