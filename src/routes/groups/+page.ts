import type { KnownApiResponse } from '$lib/types/api';
import {
  ApiResponseStatus,
  type AccountResponse,
  type ApiError,
  type GroupMappingsResponse
} from '$lib/types/api/data-contracts';
import type { Account, GroupAccount } from '$lib/types/model';
import { ApiType, Fetcher, HttpMethod, type FetchResponse } from '$lib/utils/fetcher';
import type { PageLoad } from './$types';

export const load = (async (event) => {
	const groupAccounts: GroupAccount[] = [];
	let status: ApiResponseStatus = ApiResponseStatus.SUCCESS;
	let errors: ApiError[] = [];
	const fetcher = new Fetcher(event);
	const response = (await fetcher.fetchFor(
		ApiType.Group,
		HttpMethod.GET,
		'map/all'
	)) as FetchResponse<KnownApiResponse<GroupMappingsResponse>>;
	const groupData = await response.json();

	if (groupData.status === ApiResponseStatus.SUCCESS && groupData.data !== undefined) {
		const groups =
			groupData.data.groupMappings?.map((groupMapping) => {
				return {
					name: groupMapping.name ?? '',
					currency: groupMapping.currency ?? '',
					accountsInGroup: groupMapping.accountIdUnderGroup ?? []
				};
			}) ?? [];
		for (let i = 0; i < groups.length; i++) {
			const group = groups[i];
			const accounts: Account[] = [];
			for (let j = 0; j < group.accountsInGroup.length; j++) {
				const accountResponse = (await fetcher.fetchFor(
					ApiType.Account,
					HttpMethod.GET,
					`${group.accountsInGroup[j]}`
				)) as FetchResponse<KnownApiResponse<AccountResponse>>;
				const accountResJson = await accountResponse.json();
				if (
					accountResJson.status === ApiResponseStatus.SUCCESS &&
					accountResJson.data !== undefined
				) {
					accounts.push({
						id: group.accountsInGroup[i],
						accountName: accountResJson.data.name,
						costBasis: 0,
						currentValue: 0,
						currency: accountResJson.data.currency,
						groups: []
					});
				} else if (
					accountResJson.status === ApiResponseStatus.FAIL &&
					accountResJson.errors !== undefined
				) {
					status = ApiResponseStatus.FAIL;
					errors = accountResJson.errors;
				} else {
					status = ApiResponseStatus.FAIL;
					errors = [{ code: '500', message: 'Internal server error' }];
				}
			}
			groupAccounts.push({
				name: group.name,
				currency: group.currency,
				accountsInGroup: accounts
			});
		}
	} else if (groupData.status === ApiResponseStatus.FAIL && groupData.errors !== undefined) {
		status = ApiResponseStatus.FAIL;
		errors = groupData.errors;
	} else {
		status = ApiResponseStatus.FAIL;
		errors = [{ code: '500', message: 'Internal server error' }];
	}

	const returnedPromise: Promise<KnownApiResponse<GroupAccount[]>> = new Promise((resolve) =>
		resolve({
			status: status,
			errors: errors,
			data: groupAccounts
		})
	);

	return {
		streamed: {
			data: returnedPromise
		}
	};
}) satisfies PageLoad;
