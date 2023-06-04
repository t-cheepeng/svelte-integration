import type { EmtpyKnownApiResponse } from '$lib/types/api';
import type { Api } from '$lib/types/api/ApiRoute';
import {
  CreateStockRequestAssetClass,
  ExternalSearchResponseApiUsed,
  PatchStockRequestAssetClass
} from '$lib/types/api/data-contracts';
import { ApiType, Fetcher, HttpMethod, type FetchResponse } from '$lib/utils/fetcher';
import { verifyNotBlank } from '$lib/utils/verifier';
import { error, fail } from '@sveltejs/kit';
import { FormFields } from './form';

interface TickerToApi {
	displayTickerSymbol?: string;
	apiUsed?: ExternalSearchResponseApiUsed;
}

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
		const tickerToApiMapping: TickerToApi[] = [];
		const formIterator = formData.entries();
		let formIteratorResult = formIterator.next();
		while (formIteratorResult.done !== undefined && !formIteratorResult.done) {
			const key = formIteratorResult.value[0];
			if (!key.startsWith(FormFields.tickerToApiMapping)) {
				formIteratorResult = formIterator.next();
				continue;
			}

			const [_, idxString, field] = key.split('.');
			const idx = Number.parseInt(idxString);
			if (tickerToApiMapping[idx] === undefined) {
				const tickerToApiMappingObj: TickerToApi = {};
				if (field === FormFields.displayTickerSymbol) {
					tickerToApiMappingObj.displayTickerSymbol = formIteratorResult.value[1].toString();
				} else {
					tickerToApiMappingObj.apiUsed =
						formIteratorResult.value[1].toString() as ExternalSearchResponseApiUsed;
				}
				tickerToApiMapping[idx] = tickerToApiMappingObj;
			} else {
				const tickerToApiMappingObj = tickerToApiMapping[idx];
				if (field === FormFields.displayTickerSymbol) {
					tickerToApiMappingObj.displayTickerSymbol = formIteratorResult.value[1].toString();
				} else {
					tickerToApiMappingObj.apiUsed =
						formIteratorResult.value[1].toString() as ExternalSearchResponseApiUsed;
				}
			}

			formIteratorResult = formIterator.next();
		}

		if (tickerToApiMapping.length === 0) {
			return fail(400, { errorMsg: `Ticker to API cannot be empty` });
		}

		const verfResult = verifyNotBlank([stockName, currency, assetClass]);
		const displayFieldName = ['Stock name', 'Currency', 'Asset class', 'Ticker symbol', 'API'];
		for (let i = 0; i < verfResult.length; i++) {
			if (!verfResult[i]) {
				return fail(400, { errorMsg: `${displayFieldName[i]} cannot be empty` });
			}
		}

		const verfStockName = stockName as FormDataEntryValue;
		const verfCurrency = currency as FormDataEntryValue;
		const notBlankAsset = assetClass as FormDataEntryValue;

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
		const apiTickers: Record<string, string> = {};
		tickerToApiMapping.forEach((tickerToApi) => {
			if (tickerToApi.apiUsed !== undefined && tickerToApi.displayTickerSymbol !== undefined) {
				apiTickers[tickerToApi.apiUsed] = tickerToApi.displayTickerSymbol;
			}
		});

		const createStockRequest: Api.CreateStock.RequestBody = {
			name: verfStockName.toString(),
			currency: verfCurrency.toString(),
			assetClass: verfAsset,
			apiTickers: apiTickers,
			displayTickerSymbol: tickerToApiMapping[0].displayTickerSymbol ?? 'NO.SYMBOL'
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
