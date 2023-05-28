import type { EmtpyKnownApiResponse } from '$lib/types/api';
import { TradeStockRequestTradeType, type TradeStockRequest } from '$lib/types/api/data-contracts';
import { ApiType, Fetcher, HttpMethod, type FetchResponse } from '$lib/utils/fetcher';
import { verifyNotBlank } from '$lib/utils/verifier';
import { fail } from '@sveltejs/kit';
import moment from 'moment';
import { FormFields } from './form';

export const actions = {
	trade: async (event) => {
		const formData = await event.request.formData();

		const timestamp = formData.get(FormFields.TIMESTAMP);
		const tradeType = formData.get(FormFields.TRADE_TYPE);
		const numOfUnits = formData.get(FormFields.UNITS);
		const price = formData.get(FormFields.PRICE_PER_UNIT_IN_MILLI);
		const name = formData.get(FormFields.NAME);
		const accountId = formData.get(FormFields.ACCOUNT_ID);
		const feeInMilli = formData.get(FormFields.FEE_IN_MILLI);

		const verfResult = verifyNotBlank([
			timestamp,
			tradeType,
			numOfUnits,
			price,
			name,
			accountId
		]);
		const displayFieldName = [
			'Trade date',
			'Trade type',
			'Units traded',
			'Price per unit',
			'Stock',
			'Account'
		];
		for (let i = 0; i < verfResult.length; i++) {
			if (!verfResult[i]) {
				return fail(400, { errorMsg: `${displayFieldName[i]} cannot be empty` });
			}
		}

		const verfTs = timestamp as FormDataEntryValue;
		const verfType = tradeType as FormDataEntryValue;
		if (
			!Object.values(TradeStockRequestTradeType)
				.map((type) => type.toString())
				.includes(verfType.toString())
		) {
			return fail(400, { errorMsg: 'Trade type must be one of [BUY, SELL, DIVIDEND]' });
		}
		const verfUnits = numOfUnits as FormDataEntryValue;
		const verfName = name as FormDataEntryValue;
		const verfAccountId = accountId as FormDataEntryValue;
    const verfPrice = price as FormDataEntryValue;

		const tradeStockRequest: TradeStockRequest = {
			timestamp: moment(verfTs.toString()).valueOf(),
			tradeType: verfType.toString() as TradeStockRequestTradeType,
			numOfUnits: Number.parseInt(verfUnits.toString()),
      price: verfPrice.toString(),
			accountId: Number.parseInt(verfAccountId.toString()),
			name: verfName.toString()
		};

		if (feeInMilli !== null) {
			const feeString = (feeInMilli as FormDataEntryValue).toString();
			tradeStockRequest.fee = feeString;
		}

		const fetcher = new Fetcher(event);
		const response = await fetcher.fetchFor(
			ApiType.Stock,
			HttpMethod.POST,
			'trade',
			{},
			JSON.stringify(tradeStockRequest)
		) as FetchResponse<EmtpyKnownApiResponse>;

    return await response.json();
	}
};
