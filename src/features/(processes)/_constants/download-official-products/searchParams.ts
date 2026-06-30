import { createSerializer, parseAsStringLiteral, parseAsString } from 'nuqs/server';
import formParams from './formParams';
import { DEFAULT_COLLECTION, DEFAULT_FORMAT } from '@features/(processes)/_constants/defaults';

const collectionValues = formParams.collection.options.map((o) => o.value) as [string, ...string[]];
const productValues = formParams.product.options.map((o) => o.value) as [string, ...string[]];
const formatValues = formParams.format.options.map((o) => o.value) as [
	string,
	...string[]
];

/**
 * Shared parser map. Used by:
 *  - useQueryStates (client components)
 *
 * Typing notes:
 *  - collection / format use .withDefault(...) -> return `string` (never null).
 *  - product / bbox / backgroundLayer have NO default -> return `string | null`.
 *    `null` means "not set"; setting to null removes the key from the URL.
 */
export const downloadOfficialProductsSearchParams = {
	collection: parseAsStringLiteral(collectionValues).withDefault(DEFAULT_COLLECTION),
	product: parseAsStringLiteral(productValues),
	format: parseAsStringLiteral(formatValues).withDefault(DEFAULT_FORMAT),
	bbox: parseAsString,
	backgroundLayer: parseAsString,
};

/**
 * Serializes a partial set of download-official-products URL state values into
 * a path + query string for a given route. Honours the same `clearOnDefault`
 * rules as `useQueryStates`, so values equal to their default are omitted.
 *
 * Usage:
 *   serializeDownloadOfficialProductsSearchParams('/path', { collection: '2021', product: 'X' })
 *   // => '/path?product=X'  (collection omitted because it equals its default)
 */
export const serializeDownloadOfficialProductsSearchParams = createSerializer(
	downloadOfficialProductsSearchParams
);
