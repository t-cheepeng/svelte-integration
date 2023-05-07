import type { StockResponseAssetClass } from "./api/data-contracts";

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