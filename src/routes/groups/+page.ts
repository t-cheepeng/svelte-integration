import type { KnownApiResponse } from "$lib/types/api";
import { ApiType, Fetcher, HttpMethod } from "$lib/utils/fetcher";
import type { PageLoad } from "./$types";

export const load = (async (event) => {
    const fetcher = new Fetcher(event);
    const response = (await fetcher.fetchFor(ApiType.Group, HttpMethod.GET, "")) as KnownApiResponse<>;
}) satisfies PageLoad;