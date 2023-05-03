import type { KnownApiResponse } from '$lib/types/api';
import type { AccountsResponse } from '$lib/types/api/data-contracts';
import { ApiType, Fetcher, HttpMethod, type FetchResponse } from '$lib/utils/fetcher';
import type { PageLoad } from './$types';

export const load = (async (event) => {
	const fetcher = new Fetcher(event);
	const response = (await fetcher.fetchFor(ApiType.Account, HttpMethod.GET)) as FetchResponse<
		KnownApiResponse<AccountsResponse>
	>;
  
	return {
		streamed: {
			data: response.json()
		}
	};
}) satisfies PageLoad;
