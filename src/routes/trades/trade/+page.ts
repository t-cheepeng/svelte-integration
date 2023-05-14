import type { KnownApiResponse } from '$lib/types/api';
import {
  ApiResponseStatus,
  type AccountsResponse,
  type ApiError,
  type StocksResponse,
  type TradesResponse
} from '$lib/types/api/data-contracts';
import type { Account, Stock, Trade } from '$lib/types/model';
import { ApiType, Fetcher, HttpMethod, type FetchResponse } from '$lib/utils/fetcher';
import {
  mapAccountResponseToModel,
  mapStockResponseToModel,
  mapTradeResponseToModel
} from '$lib/utils/mapper';
import type { PageLoad } from '../$types';

export interface TradeFormData {
	stocks: Stock[];
	trades: Trade[];
	accounts: Account[];
}

export const load = (async (event) => {
	const fetcher = new Fetcher(event);
	const tradeResponse = (await fetcher.fetchFor(
		ApiType.Stock,
		HttpMethod.GET,
		'trade'
	)) as FetchResponse<KnownApiResponse<TradesResponse>>;
	const stockResponse = (await fetcher.fetchFor(ApiType.Stock, HttpMethod.GET)) as FetchResponse<
		KnownApiResponse<StocksResponse>
	>;
	const accountResponse = (await fetcher.fetchFor(
		ApiType.Account,
		HttpMethod.GET
	)) as FetchResponse<KnownApiResponse<AccountsResponse>>;

	const trades = await tradeResponse.json();
	const stocks = await stockResponse.json();
	const accounts = await accountResponse.json();

	let status: ApiResponseStatus = ApiResponseStatus.SUCCESS;
	let errors: ApiError[] = [];
	const data: TradeFormData = {
		stocks: [],
		trades: [],
		accounts: []
	};
	if (trades.status === ApiResponseStatus.FAIL) {
		status = ApiResponseStatus.FAIL;
		errors = errors.concat(trades.errors ?? []);
	}

	if (stocks.status === ApiResponseStatus.FAIL) {
		status = ApiResponseStatus.FAIL;
		errors = errors.concat(stocks.errors ?? []);
	}

	if (accounts.status === ApiResponseStatus.FAIL) {
		status = ApiResponseStatus.FAIL;
		errors = errors.concat(accounts.errors ?? []);
	}

	data.trades = trades.data?.trades?.map(mapTradeResponseToModel) ?? [];
	data.stocks = stocks.data?.stocks?.map(mapStockResponseToModel) ?? [];
	data.accounts = accounts.data?.accounts.map(mapAccountResponseToModel) ?? [];

	const promise: Promise<KnownApiResponse<TradeFormData>> = new Promise((resolve) => resolve({ status: status, errors: errors, data: data }));

	return {
		streamed: {
			data: promise
		}
	};
}) satisfies PageLoad;
