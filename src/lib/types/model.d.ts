import type { StockResponseAssetClass, TradeResponseTradeType } from "./api/data-contracts";

export interface Account {
  id: number;
  accountName: string;
  costBasis: number;
  currentValue: string;
  currency: string;
  groups: string[];
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

export interface Group {
  name: string;
  currency: string;
  accountsInGroup: number[];
}

export interface GroupAccount {
	name: string;
	currency: string;
	accountsInGroup: Account[];
}