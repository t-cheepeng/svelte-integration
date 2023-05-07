import type { KnownApiResponse } from '$lib/types/api.js';
import type { SearchResponseData } from '$lib/types/api/data-contracts.js';
import { ApiType, Fetcher, HttpMethod, type FetchResponse } from '$lib/utils/fetcher.js';
import { fail } from '@sveltejs/kit';
import { FormFields } from '../../form.js';

export const actions = {
	search: async (event) => {
		const formData = await event.request.formData();
    
		const searchItem = formData.get(FormFields.SEARCH);

		if (searchItem === null || searchItem === undefined || searchItem.length <= 0) {
			return fail(400, { errorMsg: 'Search field cannot be empty' });
		}

		const fetcher = new Fetcher(event);
		const searchResult = (await fetcher.fetchFor(
			ApiType.Stock,
			HttpMethod.GET,
			`search/${encodeURIComponent(searchItem.toString())}`
		)) as FetchResponse<KnownApiResponse<SearchResponseData>>;

    return await searchResult.json();
	}
};
