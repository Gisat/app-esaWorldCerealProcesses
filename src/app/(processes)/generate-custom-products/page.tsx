import React, { Suspense } from 'react';
import CreateProductsStep1 from '@app/(processes)/generate-custom-products/steps/1/page';

export const dynamic = 'force-dynamic';

/**
 * Page component for the "Create Custom Products" section.
 *
 * This component serves as the entry point for the create custom products process,
 * rendering the first step of the process.
 *
 * @component
 * @async
 * @returns {JSX.Element} The rendered page component for the "Create Custom Products" section.
 */
export default async function CreateCustomProductsPage() {
	return <Suspense><CreateProductsStep1 /></Suspense>;
}
