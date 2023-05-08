import type { StockResponseAssetClass, TradeResponseTradeType } from "./api/data-contracts";

export interface Account {
  id: number;
  accountName: string;
  costBasis: number;
  currentValue: number;
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
  fee: number;
  stockName: string;
  numOfUnits: number;
  pricePerUnit: number;
}