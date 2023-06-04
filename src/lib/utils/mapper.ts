import {
  StockResponseAssetClass,
  TradeResponseTradeType,
  type AccountResponse,
  type GroupMappingResponse,
  type StockResponse,
  type TradeResponse
} from '$lib/types/api/data-contracts';
import type { Account, GroupAccount, Stock, Trade } from '$lib/types/model';

export const mapTradeResponseToModel = (trade: TradeResponse): Trade => {
	return {
		tradeType: trade.tradeType ?? TradeResponseTradeType.BUY,
		tradeTs: trade.tradeTs ?? '1970-01-01T00:00:00.000Z',
		fee: trade.fee ?? '0',
		stockName: trade.name ?? '',
		numOfUnits: trade.numOfUnits ?? 0,
		pricePerUnit: trade.pricePerUnit ?? '0'
	};
};

export const mapStockResponseToModel = (stock: StockResponse): Stock => {
	return {
		assetClass: stock.assetClass as StockResponseAssetClass,
		currency: stock.currency as string,
		displayTickerSymbol: stock.displayTickerSymbol as string,
		name: stock.name as string
	};
};

export const mapAccountResponseToModel = (account: AccountResponse): Account => {
	return {
		id: account.id,
		accountName: account.name,
		costBasis: account.costBasis ?? '0',
		currentValue: (
			Number.parseFloat(account.cash ?? '0') + Number.parseFloat(account.assetValue ?? '0')
		).toString(),
		currency: account.currency,
		groups: [],
		accountType: account.accountType
	};
};

export const mapGroupMappingResponseToModel = (
	groupMapping: GroupMappingResponse,
	allAccounts: Account[]
): GroupAccount => {
	return {
    id: groupMapping.id ?? -1,
		name: groupMapping.name ?? '',
		currency: groupMapping.currency ?? '',
		accountsInGroup:
			groupMapping.accountIdUnderGroup?.map((accountId) =>
				allAccounts.find((account) => account.id === accountId)
			) ?? []
	};
};
