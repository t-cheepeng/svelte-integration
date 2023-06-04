import type {
  AccountResponseAccountType,
  AccountTransactions,
  ExternalSearchResponseApiUsed,
  StockResponseAssetClass,
  TradeResponseTradeType
} from './api/data-contracts';

export interface Account {
	id: number;
	accountName: string;
	costBasis: string;
	currentValue: string;
	currency: string;
	groups: GroupAccount[];
  accountType: AccountResponseAccountType;
}

export interface Stock {
	assetClass: StockResponseAssetClass;
	currency: string;
	displayTickerSymbol: string;
	name: string;
}

export interface SearchResult {
	stockName: string;
	currency: string;
	exchange: string;
	ticker: string;
	stockClass: string;
	exchangeCountry: string;
	searchScore: number;
	apiUsed: ExternalSearchResponseApiUsed;
}

export interface Trade {
	tradeType: TradeResponseTradeType;
	tradeTs: string;
	fee: string;
	stockName: string;
	numOfUnits: number;
	pricePerUnit: string;
}

export interface GroupAccount {
  id: number;
	name: string;
	currency: string;
	accountsInGroup: (Account | undefined)[];
}

export type AccountActivity = AccountTransactions | Trade;

export interface PagedTransactionAccount {
	account: Account;
	transactions: AccountTransactions[];
	trades: Trade[];
  allActivity: AccountActivity[];
	hasNextPageForTransactions: boolean;
	nextPageForTransactions: number;
	hasNextPageForTrade: boolean;
	nextPageForTrade: number;
}
