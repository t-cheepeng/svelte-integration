import type { EmtpyKnownApiResponse } from '$lib/types/api';
import type { Api } from '$lib/types/api/ApiRoute';
import {
  CreateStockRequestAssetClass,
  PatchStockRequestAssetClass
} from '$lib/types/api/data-contracts';
import { ApiType, Fetcher, HttpMethod, type FetchResponse } from '$lib/utils/fetcher';
import { verifyNotBlank } from '$lib/utils/verifier';
import { error, fail } from '@sveltejs/kit';
import { FormFields } from './form';

export function load({ params }) {
	if (!['create', 'edit'].includes(params.action)) {
		throw error(404);
	}

	return params;
}

export const actions = {
	create: async (event) => {
		const formData = await event.request.formData();

		const stockName = formData.get(FormFields.stockName);
		const currency = formData.get(FormFields.currency);
		const assetClass = formData.get(FormFields.assetClass);
		const displayTickerSymbol = formData.get(FormFields.displayTickerSymbol);

		const verfResult = verifyNotBlank([stockName, currency, assetClass, displayTickerSymbol]);
		const displayFieldName = ['Stock name', 'Currency', 'Asset class', 'Ticker symbol'];
		for (let i = 0; i < verfResult.length; i++) {
			if (!verfResult[i]) {
				return fail(400, { errorMsg: `${displayFieldName[i]} cannot be empty` });
			}
		}

		const verfStockName = stockName as FormDataEntryValue;
		const verfCurrency = currency as FormDataEntryValue;
		const notBlankAsset = assetClass as FormDataEntryValue;
		const verfTicker = displayTickerSymbol as FormDataEntryValue;

		if (
			notBlankAsset.toString() !== CreateStockRequestAssetClass.BOND &&
			notBlankAsset.toString() !== CreateStockRequestAssetClass.CRYPTOCURRENCY &&
			notBlankAsset.toString() !== CreateStockRequestAssetClass.EQUITY &&
			notBlankAsset.toString() !== CreateStockRequestAssetClass.ETF
		) {
			return fail(400, {
				errorMsg: 'Asset class must be one of ETF, BOND, EQUITY, CRYPTOCURRENCY'
			});
		}

		const verfAsset = notBlankAsset as CreateStockRequestAssetClass;
		const apiTickers = {
			YAHOO_FINANCE: verfTicker.toString()
		};

		const createStockRequest: Api.CreateStock.RequestBody = {
			name: verfStockName.toString(),
			currency: verfCurrency.toString(),
			assetClass: verfAsset,
			apiTickers: apiTickers,
			displayTickerSymbol: verfTicker.toString()
		};

		const fetcher = new Fetcher(event);
		const createResult = (await fetcher.fetchFor(
			ApiType.Stock,
			HttpMethod.POST,
			`create`,
			{},
			JSON.stringify(createStockRequest)
		)) as FetchResponse<EmtpyKnownApiResponse>;

		return await createResult.json();
	},

	edit: async (event) => {
		const formData = await event.request.formData();

		const stockName = formData.get(FormFields.stockName);
		const currency = formData.get(FormFields.currency);
		const assetClass = formData.get(FormFields.assetClass);

		const patchStockRequest: Api.PatchStock.RequestBody = {
			name: stockName?.toString(),
			currency: currency?.toString(),
			assetClass: assetClass?.toString() as PatchStockRequestAssetClass | undefined
		};

		const fetcher = new Fetcher(event);
		const response = (await fetcher.fetchFor(
			ApiType.Stock,
			HttpMethod.PATCH,
			'base',
			{},
			JSON.stringify(patchStockRequest)
		)) as FetchResponse<EmtpyKnownApiResponse>;
		return await response.json();
	}
};
