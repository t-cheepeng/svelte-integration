import type { EmtpyKnownApiResponse, KnownApiResponse } from '$lib/types/api';
import type { Api } from '$lib/types/api/ApiRoute';
import type {
  AccountActivityPageResponse,
  AccountResponse,
  AccountsResponse,
  ApiResponse,
  GroupMappingsResponse,
  SearchResponseData,
  StocksResponse,
  TradesResponse
} from '$lib/types/api/data-contracts';
import { HttpMethod } from './fetcher';

export class Client {
	protected baseUrl = 'http://localhost:8080/api';

	async dispatchRequest(httpMethod: HttpMethod, body?: BodyInit | null | undefined) {
		const requestOptions: RequestInit = {
			method: httpMethod.toString(),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		};

		if (body !== undefined && body !== null) {
			requestOptions.body = body;
		}

		const response = await fetch(this.baseUrl, requestOptions);
		return (await response.json()) as ApiResponse;
	}
}

export class AccountClient extends Client {
	constructor() {
		super();
		this.baseUrl += '/account';
	}

	async createAccount(account: Api.CreateAccount.RequestBody) {
		this.baseUrl += '/create';
		return await this.dispatchRequest(HttpMethod.POST, JSON.stringify(account));
	}

	async getAccount(accountId: Api.GetAccount.RequestParams) {
		this.baseUrl += `/${accountId.accountId.toString()}`;
		const response = (await this.dispatchRequest(
			HttpMethod.GET
		)) as KnownApiResponse<AccountResponse>;
		return response;
	}

	async getAllAccounts() {
		this.baseUrl += '/';
		const response = (await this.dispatchRequest(
			HttpMethod.GET
		)) as KnownApiResponse<AccountsResponse>;
		return response;
	}

	async deleteAccount(accountId: Api.DeleteAccount.RequestParams) {
		this.baseUrl += `/${accountId.accountId.toString()}`;
		const response = await this.dispatchRequest(HttpMethod.DELETE);
		return response;
	}

	async patchAccount(patchAccount: Api.PatchAccount.RequestBody) {
		this.baseUrl += '/update';
		return await this.dispatchRequest(HttpMethod.PATCH, JSON.stringify(patchAccount));
	}

	async transactAccount(transactionRequest: Api.TransactAccount.RequestBody) {
		this.baseUrl += '/transact';
		return await this.dispatchRequest(HttpMethod.POST, JSON.stringify(transactionRequest));
	}

	async getHistory(
		historyRequestParams: Api.GetAccountHistory.RequestParams,
		historyRequestQuery: Api.GetAccountHistory.RequestQuery
	) {
		this.baseUrl += `/history/${historyRequestParams.accountId}?tradePage=${historyRequestQuery.tradePage}&transactionPage=${historyRequestQuery.transactionPage}`;
		return (await this.dispatchRequest(
			HttpMethod.GET
		)) as KnownApiResponse<AccountActivityPageResponse>;
	}
}

export class StockClient extends Client {
	constructor() {
		super();
		this.baseUrl += '/stock';
	}

	async getAllStocks() {
		this.baseUrl += '/';
		const response = (await this.dispatchRequest(
			HttpMethod.GET
		)) as KnownApiResponse<StocksResponse>;
		return response;
	}

	async searchStock(query: string) {
		this.baseUrl += `/search/${query}`;
		const response = (await this.dispatchRequest(
			HttpMethod.GET
		)) as KnownApiResponse<SearchResponseData>;
		return response;
	}

	async createStock(createStock: Api.CreateStock.RequestBody) {
		this.baseUrl += '/create';
		return (await this.dispatchRequest(
			HttpMethod.POST,
			JSON.stringify(createStock)
		)) as KnownApiResponse<EmtpyKnownApiResponse>;
	}

	async patchStock(patchStock: Api.PatchStock.RequestBody) {
		this.baseUrl += '/base';
		return (await this.dispatchRequest(
			HttpMethod.PATCH,
			JSON.stringify(patchStock)
		)) as KnownApiResponse<EmtpyKnownApiResponse>;
	}

	async getAllTrades() {
		this.baseUrl += '/trade/';
		return (await this.dispatchRequest(HttpMethod.GET)) as KnownApiResponse<TradesResponse>;
	}

	async tradeStock(tradeRequest: Api.TradeStock.RequestBody) {
		this.baseUrl += '/trade';
		return (await this.dispatchRequest(
			HttpMethod.POST,
			JSON.stringify(tradeRequest)
		)) as KnownApiResponse<EmtpyKnownApiResponse>;
	}
}

export class GroupClient extends Client {
	constructor() {
		super();
		this.baseUrl += '/group';
	}

	async getAllGroupMappings() {
		this.baseUrl += '/map/all';
		return (await this.dispatchRequest(HttpMethod.GET)) as KnownApiResponse<GroupMappingsResponse>;
	}

	async createGroup(createGroup: Api.CreateAccountGroup.RequestBody) {
		this.baseUrl += '/create';
		return (await this.dispatchRequest(
			HttpMethod.POST,
			JSON.stringify(createGroup)
		)) as KnownApiResponse<EmtpyKnownApiResponse>;
	}

	async groupAccount(groupAccount: Api.GroupAccount.RequestBody) {
		this.baseUrl += '/group';
		return (await this.dispatchRequest(
			HttpMethod.POST,
			JSON.stringify(groupAccount)
		)) as KnownApiResponse<EmtpyKnownApiResponse>;
	}

	async ungroupAccount(ungroupAccount: Api.UngroupAccount.RequestBody) {
		this.baseUrl += '/group';
		return (await this.dispatchRequest(
			HttpMethod.DELETE,
			JSON.stringify(ungroupAccount)
		)) as KnownApiResponse<EmtpyKnownApiResponse>;
	}
}
