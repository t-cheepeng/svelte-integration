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
	price: string;
	name?: string;
	/** @format int32 */
	accountId: number;
	fee?: string;
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

export interface AccountAccountGroupRequest {
	/** @format int32 */
	accountId?: number;
	/** @format int32 */
	accountGroupId?: number;
}

export interface CreateAccountGroupRequest {
	name?: string;
	currency?: string;
}

export interface AccountTransactionRequest {
	/** @format int32 */
	accountIdFrom?: number;
	/** @format int32 */
	accountIdTo?: number;
	amount: string;
	transactionType?: AccountTransactionRequestTransactionType;
	exchangeRate?: string;
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
	cash?: string;
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

export interface TradeResponse {
	/** @format date-time */
	tradeTs?: string;
	tradeType?: TradeResponseTradeType;
	/** @format int32 */
	numOfUnits?: number;
	pricePerUnit?: string;
	name?: string;
	/** @format int32 */
	account?: number;
	fee?: string;
	/** @format int32 */
	buyId?: number;
}

export interface TradesResponse {
	trades?: TradeResponse[];
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

export interface GroupMappingResponse {
	/** @format int32 */
	id?: number;
	name?: string;
	currency?: string;
	accountIdUnderGroup?: number[];
}

export interface GroupMappingsResponse {
	groupMappings?: GroupMappingResponse[];
}

export interface AccountResponse {
	/** @format int32 */
	id: number;
	accountType: AccountResponseAccountType;
	currency: string;
	description?: string;
	name: string;
	cash?: string;
	assetValue?: string;
	costBasis?: string;
}

export interface AccountActivityPageResponse {
	hasNextPageForTransaction?: boolean;
	/** @format int32 */
	nextPageNumForTransaction?: number;
	hasNextPageForTrade?: boolean;
	/** @format int32 */
	nextPageNumForTrade?: number;
	accountTransactionsInCurrentPage?: AccountTransactions[];
	accountTradesInCurrentPage?: TradeResponse[];
}

export interface AccountTransactions {
	/** @format int32 */
	id?: number;
	/** @format date-time */
	transactionTs?: string;
	/** @format int32 */
	accountIdFrom?: number;
	/** @format int32 */
	accountIdTo?: number;
	amount?: number;
	transactionType?: AccountTransactionsTransactionType;
	exchangeRate?: number;
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

export enum AccountTransactionRequestTransactionType {
	DEPOSIT = 'DEPOSIT',
	WITHDRAW = 'WITHDRAW',
	TRANSFER = 'TRANSFER'
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

export enum TradeResponseTradeType {
	BUY = 'BUY',
	SELL = 'SELL',
	DIVIDEND = 'DIVIDEND'
}

export enum ExternalSearchResponseApiUsed {
	ALPACA_MARKET = 'ALPACA_MARKET',
	SGX = 'SGX',
	YAHOO_FINANCE = 'YAHOO_FINANCE'
}

export enum AccountResponseAccountType {
	INVESTMENT = 'INVESTMENT',
	BUDGET = 'BUDGET'
}

export enum AccountTransactionsTransactionType {
	DEPOSIT = 'DEPOSIT',
	WITHDRAW = 'WITHDRAW',
	TRANSFER = 'TRANSFER'
}
