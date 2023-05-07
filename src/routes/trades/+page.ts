import type { KnownApiResponse } from '$lib/types/api';
import type { TradesResponse } from '$lib/types/api/data-contracts';
import { ApiType, Fetcher, HttpMethod, type FetchResponse } from '$lib/utils/fetcher';
import type { PageLoad } from './$types';

export const load = (async (event) => {
	const fetcher = new Fetcher(event);
	const response = (await fetcher.fetchFor(ApiType.Stock, HttpMethod.GET, "trade")) as FetchResponse<
		KnownApiResponse<TradesResponse>
	>;

	return {
		streamed: {
			data: response.json()
		}
	};
}) satisfies PageLoad;
