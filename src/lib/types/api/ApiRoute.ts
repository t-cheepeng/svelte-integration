/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import {
	AccountResponse,
	AccountsResponse,
	ApiResponse,
	CreateAccountAccountGroupRequest,
	CreateAccountGroupRequest,
	CreateAccountRequest,
	CreateStockRequest,
	GroupMappingsResponse,
	PatchAccountRequest,
	PatchStockRequest,
	SearchResponseData,
	StockResponse,
	StocksResponse,
	TradesResponse,
	TradeStockRequest
} from './data-contracts';

export namespace Api {
	/**
	 * No description
	 * @tags stock-controller
	 * @name TradeStock
	 * @summary Add a stock trade for account
	 * @request POST:/api/stock/trade
	 * @response `200` `ApiResponse` Stock trade is added for account successfully
	 * @response `400` `ApiResponse` Bad request
	 * @response `422` `ApiResponse` Request is understood but entity is not created due to other errors
	 * @response `500` `ApiResponse` Internal server error
	 */
	export namespace TradeStock {
		export type RequestParams = {};
		export type RequestQuery = {};
		export type RequestBody = TradeStockRequest;
		export type RequestHeaders = {};
		export type ResponseBody = ApiResponse;
	}

	/**
	 * No description
	 * @tags stock-controller
	 * @name CreateStock
	 * @summary Create a stock and ticker to api mappings
	 * @request POST:/api/stock/create
	 * @response `200` `ApiResponse` Stock and ticker to api mapping is created successfully
	 * @response `400` `ApiResponse` Bad request
	 * @response `422` `ApiResponse` Request is understood but entity is not created due to other errors
	 * @response `500` `ApiResponse` Internal server error
	 */
	export namespace CreateStock {
		export type RequestParams = {};
		export type RequestQuery = {};
		export type RequestBody = CreateStockRequest;
		export type RequestHeaders = {};
		export type ResponseBody = ApiResponse;
	}

	/**
	 * No description
	 * @tags account-group-controller
	 * @name GroupAccount
	 * @summary Group an account under account group
	 * @request POST:/api/group/group
	 * @response `200` `ApiResponse` Account is grouped under account group successfully
	 * @response `400` `ApiResponse` Bad request
	 * @response `422` `ApiResponse` Request is understood but entity is not created due to other errors
	 * @response `500` `ApiResponse` Internal server error
	 */
	export namespace GroupAccount {
		export type RequestParams = {};
		export type RequestQuery = {};
		export type RequestBody = CreateAccountAccountGroupRequest;
		export type RequestHeaders = {};
		export type ResponseBody = ApiResponse;
	}

	/**
	 * No description
	 * @tags account-group-controller
	 * @name CreateAccountGroup
	 * @summary Create an account group
	 * @request POST:/api/group/create
	 * @response `200` `ApiResponse` Account group is created successfully
	 * @response `400` `ApiResponse` Bad request
	 * @response `422` `ApiResponse` Request is understood but entity is not created due to other errors
	 * @response `500` `ApiResponse` Internal server error
	 */
	export namespace CreateAccountGroup {
		export type RequestParams = {};
		export type RequestQuery = {};
		export type RequestBody = CreateAccountGroupRequest;
		export type RequestHeaders = {};
		export type ResponseBody = ApiResponse;
	}

	/**
	 * No description
	 * @tags account-controller
	 * @name CreateAccount
	 * @summary Create an account
	 * @request POST:/api/account/create
	 * @response `200` `ApiResponse` Account is created successfully
	 * @response `400` `ApiResponse` Bad request
	 * @response `422` `ApiResponse` Request is understood but entity is not created due to other errors
	 * @response `500` `ApiResponse` Internal server error
	 */
	export namespace CreateAccount {
		export type RequestParams = {};
		export type RequestQuery = {};
		export type RequestBody = CreateAccountRequest;
		export type RequestHeaders = {};
		export type ResponseBody = ApiResponse;
	}

	/**
	 * No description
	 * @tags stock-controller
	 * @name PatchStock
	 * @summary Update a stock. All aspects of the stock can be updated
	 * @request PATCH:/api/stock/base
	 * @response `200` `ApiResponse` Stock is updated successfully
	 * @response `400` `ApiResponse` Bad request
	 * @response `422` `ApiResponse` Request is understood but entity is not created due to other errors
	 * @response `500` `ApiResponse` Internal server error
	 */
	export namespace PatchStock {
		export type RequestParams = {};
		export type RequestQuery = {};
		export type RequestBody = PatchStockRequest;
		export type RequestHeaders = {};
		export type ResponseBody = ApiResponse;
	}

	/**
	 * No description
	 * @tags account-controller
	 * @name PatchAccount
	 * @summary Update an account. Only the name and description can be updated
	 * @request PATCH:/api/account/update
	 * @response `200` `ApiResponse` Account is updated successfully
	 * @response `400` `ApiResponse` Bad request
	 * @response `422` `ApiResponse` Request is understood but entity is not created due to other errors
	 * @response `500` `ApiResponse` Internal server error
	 */
	export namespace PatchAccount {
		export type RequestParams = {};
		export type RequestQuery = {};
		export type RequestBody = PatchAccountRequest;
		export type RequestHeaders = {};
		export type ResponseBody = ApiResponse;
	}

	/**
	 * No description
	 * @tags stock-controller
	 * @name GetStock
	 * @summary Get a stock by its name
	 * @request GET:/api/stock/{stockName}
	 * @response `200` `StockResponse` Stock found
	 * @response `400` `ApiResponse` Bad request
	 * @response `404` `ApiResponse` Unable to find account or account is deleted
	 * @response `422` `ApiResponse` Request is understood but entity is not created due to other errors
	 * @response `500` `ApiResponse` Internal server error
	 */
	export namespace GetStock {
		export type RequestParams = {
			/**
			 * Name of the stock to get
			 * @example "Straits Times Index Fund ETF"
			 */
			stockName: string;
		};
		export type RequestQuery = {};
		export type RequestBody = never;
		export type RequestHeaders = {};
		export type ResponseBody = StockResponse;
	}

	/**
	 * No description
	 * @tags stock-controller
	 * @name DeleteStock
	 * @summary Delete a stock by its name
	 * @request DELETE:/api/stock/{stockName}
	 * @response `200` `AccountResponse` Stock deleted
	 * @response `400` `ApiResponse` Bad request
	 * @response `422` `ApiResponse` Request is understood but entity is not created due to other errors
	 * @response `500` `ApiResponse` Internal server error
	 */
	export namespace DeleteStock {
		export type RequestParams = {
			/**
			 * Name of the stock to delete
			 * @example "Straits Times Index Fund ETF"
			 */
			stockName: string;
		};
		export type RequestQuery = {};
		export type RequestBody = never;
		export type RequestHeaders = {};
		export type ResponseBody = AccountResponse;
	}

	/**
	 * No description
	 * @tags stock-controller
	 * @name GetAllTrades
	 * @summary Get all trades
	 * @request GET:/api/stock/trade/
	 * @response `200` `TradesResponse` Returns all trades in database or an empty list of nothing is in database.
	 * @response `400` `ApiResponse` Bad request
	 * @response `422` `ApiResponse` Request is understood but entity is not created due to other errors
	 * @response `500` `ApiResponse` Internal server error
	 */
	export namespace GetAllTrades {
		export type RequestParams = {};
		export type RequestQuery = {};
		export type RequestBody = never;
		export type RequestHeaders = {};
		export type ResponseBody = TradesResponse;
	}

	/**
	 * No description
	 * @tags stock-controller
	 * @name QueryExternalStockApi
	 * @summary Query a stock from external APIs
	 * @request GET:/api/stock/search/{query}
	 * @response `200` `SearchResponseData` Stock found in external APIs
	 * @response `400` `ApiResponse` Bad request
	 * @response `422` `ApiResponse` Request is understood but entity is not created due to other errors
	 * @response `500` `ApiResponse` Internal server error
	 */
	export namespace QueryExternalStockApi {
		export type RequestParams = {
			query: string;
		};
		export type RequestQuery = {};
		export type RequestBody = never;
		export type RequestHeaders = {};
		export type ResponseBody = SearchResponseData;
	}

	/**
	 * No description
	 * @tags stock-controller
	 * @name GetAllStocks
	 * @summary Get all stocks
	 * @request GET:/api/stock/
	 * @response `200` `StocksResponse` Returns all stocks in database or an empty list of nothing is in database.
	 * @response `400` `ApiResponse` Bad request
	 * @response `422` `ApiResponse` Request is understood but entity is not created due to other errors
	 * @response `500` `ApiResponse` Internal server error
	 */
	export namespace GetAllStocks {
		export type RequestParams = {};
		export type RequestQuery = {};
		export type RequestBody = never;
		export type RequestHeaders = {};
		export type ResponseBody = StocksResponse;
	}

	/**
	 * No description
	 * @tags account-group-controller
	 * @name GetAllGroupsAndMapping
	 * @summary Get all groups and account to group mappings
	 * @request GET:/api/group/map/all
	 * @response `200` `GroupMappingsResponse` All groups and account to group mappings retrieved. Will return empty lists as well
	 * @response `400` `ApiResponse` Bad request
	 * @response `422` `ApiResponse` Request is understood but entity is not created due to other errors
	 * @response `500` `ApiResponse` Internal server error
	 */
	export namespace GetAllGroupsAndMapping {
		export type RequestParams = {};
		export type RequestQuery = {};
		export type RequestBody = never;
		export type RequestHeaders = {};
		export type ResponseBody = GroupMappingsResponse;
	}

	/**
	 * No description
	 * @tags account-controller
	 * @name GetAccount
	 * @summary Get an account by its ID
	 * @request GET:/api/account/{accountId}
	 * @response `200` `AccountResponse` Account found
	 * @response `400` `ApiResponse` Bad request
	 * @response `404` `ApiResponse` Unable to find account or account is deleted
	 * @response `422` `ApiResponse` Request is understood but entity is not created due to other errors
	 * @response `500` `ApiResponse` Internal server error
	 */
	export namespace GetAccount {
		export type RequestParams = {
			/**
			 * ID of the account to get
			 * @format int32
			 * @example 1
			 */
			accountId: number;
		};
		export type RequestQuery = {};
		export type RequestBody = never;
		export type RequestHeaders = {};
		export type ResponseBody = AccountResponse;
	}

	/**
	 * No description
	 * @tags account-controller
	 * @name DeleteAccount
	 * @summary Delete an account by its ID
	 * @request DELETE:/api/account/{accountId}
	 * @response `200` `ApiResponse` Account deleted
	 * @response `400` `ApiResponse` Bad request
	 * @response `422` `ApiResponse` Request is understood but entity is not created due to other errors
	 * @response `500` `ApiResponse` Internal server error
	 */
	export namespace DeleteAccount {
		export type RequestParams = {
			/**
			 * ID of the account to delete
			 * @format int32
			 * @example 1
			 */
			accountId: number;
		};
		export type RequestQuery = {};
		export type RequestBody = never;
		export type RequestHeaders = {};
		export type ResponseBody = ApiResponse;
	}

	/**
	 * No description
	 * @tags account-controller
	 * @name GetAllAccounts
	 * @summary Get all accounts
	 * @request GET:/api/account/
	 * @response `200` `AccountsResponse` Accounts found. List can be empty and still return 200. Deleted accounts are not returned
	 * @response `400` `ApiResponse` Bad request
	 * @response `422` `ApiResponse` Request is understood but entity is not created due to other errors
	 * @response `500` `ApiResponse` Internal server error
	 */
	export namespace GetAllAccounts {
		export type RequestParams = {};
		export type RequestQuery = {};
		export type RequestBody = never;
		export type RequestHeaders = {};
		export type ResponseBody = AccountsResponse;
	}
}
