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

export interface ApiError {
	code: string;
	message: string;
}

export interface ApiResponse {
	status: ApiResponseStatus;
	errors?: ApiError[];
	data?: ResponseData;
}

export type ResponseData = object;

export interface TradeStockRequest {
	/**
	 * @format int64
	 * @min 1
	 */
	timestamp: number;
	tradeType: TradeStockRequestTradeType;
	/** @format int32 */
	numOfUnits: number;
	/** @format int32 */
	pricePerUnitInMilli: number;
	name?: string;
	/** @format int32 */
	accountId: number;
	/** @format int32 */
	feeInMilli?: number;
	/** @format int32 */
	buyId?: number;
}

export interface CreateStockRequest {
	name?: string;
	currency?: string;
	assetClass: CreateStockRequestAssetClass;
	apiTickers: Record<string, string>;
	/**
	 * @minLength 0
	 * @maxLength 20
	 */
	displayTickerSymbol: string;
}

export interface CreateAccountAccountGroupRequest {
	/** @format int32 */
	accountId?: number;
	/** @format int32 */
	accountGroupId?: number;
}

export interface CreateAccountGroupRequest {
	name?: string;
	currency?: string;
}

export interface CreateAccountRequest {
	accountType: CreateAccountRequestAccountType;
	currency?: string;
	/**
	 * @minLength 0
	 * @maxLength 65535
	 */
	description?: string;
	name?: string;
	/** @format int32 */
	cashInCents?: number;
}

export interface PatchStockRequest {
	name?: string;
	currency?: string;
	assetClass?: PatchStockRequestAssetClass;
	displayTickerSymbol?: string;
}

export interface PatchAccountRequest {
	/** @format int32 */
	id?: number;
	/**
	 * @minLength 0
	 * @maxLength 255
	 */
	name?: string;
	/**
	 * @minLength 0
	 * @maxLength 65535
	 */
	description?: string;
}

export interface StockResponse {
	name?: string;
	currency?: string;
	assetClass?: StockResponseAssetClass;
	displayTickerSymbol?: string;
}

export interface ExternalSearchResponse {
	stockName?: string;
	currencyGuess?: {
		currencyCode?: string;
		displayName?: string;
		symbol?: string;
		/** @format int32 */
		defaultFractionDigits?: number;
		/** @format int32 */
		numericCode?: number;
		numericCodeAsString?: string;
	};
	exchange?: string;
	ticker?: string;
	stockClass?: string;
	exchangeCountry?: string;
	/** @format double */
	searchScore?: number;
	apiUsed?: ExternalSearchResponseApiUsed;
}

export interface SearchResponseData {
	searchResponses?: ExternalSearchResponse[];
}

export interface StocksResponse {
	stocks?: StockResponse[];
}

export interface AccountResponse {
	/** @format int32 */
	id: number;
	accountType: AccountResponseAccountType;
	currency: string;
	description?: string;
	name: string;
	/** @format int32 */
	cashInCents?: number;
}

export interface AccountsResponse {
	accounts: AccountResponse[];
}

export enum ApiResponseStatus {
	SUCCESS = 'SUCCESS',
	FAIL = 'FAIL',
	PENDING = 'PENDING'
}

export enum TradeStockRequestTradeType {
	BUY = 'BUY',
	SELL = 'SELL',
	DIVIDEND = 'DIVIDEND'
}

export enum CreateStockRequestAssetClass {
	ETF = 'ETF',
	EQUITY = 'EQUITY',
	BOND = 'BOND',
	CRYPTOCURRENCY = 'CRYPTOCURRENCY'
}

export enum CreateAccountRequestAccountType {
	INVESTMENT = 'INVESTMENT',
	BUDGET = 'BUDGET'
}

export enum PatchStockRequestAssetClass {
	ETF = 'ETF',
	EQUITY = 'EQUITY',
	BOND = 'BOND',
	CRYPTOCURRENCY = 'CRYPTOCURRENCY'
}

export enum StockResponseAssetClass {
	ETF = 'ETF',
	EQUITY = 'EQUITY',
	BOND = 'BOND',
	CRYPTOCURRENCY = 'CRYPTOCURRENCY'
}

export enum ExternalSearchResponseApiUsed {
	YAHOO_FINANCE = 'YAHOO_FINANCE',
	RAW_URL = 'RAW_URL'
}

export enum AccountResponseAccountType {
	INVESTMENT = 'INVESTMENT',
	BUDGET = 'BUDGET'
}
