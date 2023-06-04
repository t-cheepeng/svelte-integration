import type { KnownApiResponse } from '$lib/types/api';
import {
  ApiResponseStatus,
  type AccountActivityPageResponse,
  type AccountsResponse,
  type ApiError,
  type GroupMappingsResponse
} from '$lib/types/api/data-contracts';
import type { GroupAccount, PagedTransactionAccount } from '$lib/types/model';
import { ApiType, Fetcher, HttpMethod, type FetchResponse } from '$lib/utils/fetcher';
import { isTrade } from '$lib/utils/guard';
import {
  mapAccountResponseToModel,
  mapGroupMappingResponseToModel,
  mapTradeResponseToModel
} from '$lib/utils/mapper';
import type { PageLoad } from './$types';

export interface AccountPageData {
  accountTransactions: PagedTransactionAccount[];
  groups: GroupAccount[];
}

export const load = (async (event) => {
	const fetcher = new Fetcher(event);
	const accountResponse = (await fetcher.fetchFor(
		ApiType.Account,
		HttpMethod.GET
	)) as FetchResponse<KnownApiResponse<AccountsResponse>>;
	const response = await accountResponse.json();

	const accountTransactions: PagedTransactionAccount[] = [];
  let groups: GroupAccount[] = [];
	let status: ApiResponseStatus = ApiResponseStatus.SUCCESS;
	let errors: ApiError[] = [];
	if (response.status === ApiResponseStatus.SUCCESS && response.data !== undefined) {
		const responseAccounts: AccountsResponse = response.data;
		const accounts = responseAccounts.accounts.map(mapAccountResponseToModel);

		// Fetch groupings for accounts
		const allGroups = (await fetcher.fetchFor(
			ApiType.Group,
			HttpMethod.GET,
			'map/all'
		)) as FetchResponse<KnownApiResponse<GroupMappingsResponse>>;
		const allGroupsResponse = await allGroups.json();

		if (
			allGroupsResponse.status === ApiResponseStatus.SUCCESS &&
			allGroupsResponse.data !== undefined
		) {
			const groupData: GroupMappingsResponse = allGroupsResponse.data;
			const groupModel = groupData.groupMappings?.map((groupMapping) =>
				mapGroupMappingResponseToModel(groupMapping, accounts)
			);
      groups = groupModel ?? [];
			accounts.forEach((account) => {
				const groupsAccountBelongTo = groupModel?.filter(
					(group) =>
						group.accountsInGroup.find((accGroup) => accGroup?.id === account.id) !== undefined
				);
				account.groups = groupsAccountBelongTo ?? [];
			});
		}

		// Fetch historical activities for accounts
		for (let i = 0; i < accounts.length; i++) {
			const account = accounts[i];
			const accTransactionResponse = (await fetcher.fetchFor(
				ApiType.Account,
				HttpMethod.GET,
				`history/${account.id}?tradePage=0&transactionPage=0`
			)) as FetchResponse<KnownApiResponse<AccountActivityPageResponse>>;
			const accTransactionData = await accTransactionResponse.json();

			const accountTransaction: PagedTransactionAccount = {
				account: account,
				hasNextPageForTransactions: false,
				nextPageForTransactions: -1,
				hasNextPageForTrade: false,
				nextPageForTrade: -1,
				transactions: [],
				trades: [],
				allActivity: []
			};

			if (
				accTransactionData.status === ApiResponseStatus.SUCCESS &&
				accTransactionData.data !== undefined
			) {
				accountTransaction.hasNextPageForTransactions =
					accTransactionData.data.hasNextPageForTransaction ?? false;
				accountTransaction.nextPageForTransactions =
					accTransactionData.data.nextPageNumForTransaction ?? -1;
				accountTransaction.hasNextPageForTrade =
					accTransactionData.data.hasNextPageForTrade ?? false;
				accountTransaction.nextPageForTrade = accTransactionData.data.nextPageNumForTrade ?? -1;

				accountTransaction.transactions =
					accTransactionData.data.accountTransactionsInCurrentPage ?? [];
				accountTransaction.trades = (accTransactionData.data.accountTradesInCurrentPage ?? []).map(
					mapTradeResponseToModel
				);

				accountTransaction.allActivity = [
					...accountTransaction.transactions,
					...accountTransaction.trades
				];
				accountTransaction.allActivity.sort((activity, other) => {
					const activityTime =
						(isTrade(activity) ? activity.tradeTs : activity.transactionTs) ?? '';
					const otherTime = (isTrade(other) ? other.tradeTs : other.transactionTs) ?? '';
					return new Date(activityTime) < new Date(otherTime) ? 1 : -1;
				});
			}

			accountTransactions.push(accountTransaction);
		}
	} else if (response.status === ApiResponseStatus.FAIL && response.errors !== undefined) {
		status = ApiResponseStatus.FAIL;
		errors = response.errors;
	} else {
		status = ApiResponseStatus.FAIL;
		errors = [{ code: '500', message: 'Internal server error' }];
	}

	const returnedPromise: Promise<KnownApiResponse<AccountPageData>> = new Promise(
		(resolve) =>
			resolve({
				status: status,
				errors: errors,
				data: {
          accountTransactions: accountTransactions,
          groups: groups
        }
			})
	);

	return {
		streamed: {
			data: returnedPromise
		}
	};
}) satisfies PageLoad;
