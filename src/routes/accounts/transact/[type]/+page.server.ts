import type { EmtpyKnownApiResponse } from '$lib/types/api.js';
import type {
  AccountTransactionRequest,
  AccountTransactionRequestTransactionType
} from '$lib/types/api/data-contracts.js';
import { ApiType, Fetcher, HttpMethod, type FetchResponse } from '$lib/utils/fetcher.js';
import { verifyNotBlank } from '$lib/utils/verifier.js';
import { error, fail } from '@sveltejs/kit';
import { FormFields } from './form.js';

export function load({ params }) {
	if (!['deposit', 'withdraw', 'transfer'].includes(params.type)) {
		throw error(404);
	}
	return params;
}

export const actions = {
	transact: async (event) => {
		const formData = await event.request.formData();

		const transactionType = formData.get(FormFields.TRANSACTION_TYPE);
		const accountIdFrom = formData.get(FormFields.ACCOUNT_ID_FROM);
		const accountIdTo = formData.get(FormFields.ACCOUNT_ID_TO);
		const amountInCents = formData.get(FormFields.AMOUNT_IN_CENTS);
		const exchangeRateInMilli = formData.get(FormFields.EXCHANGE_RATE_IN_MILLI);

		const verfResult = verifyNotBlank([transactionType, accountIdFrom, amountInCents]);
		const displayFieldName = ['Transaction type', 'Account', 'Amount'];
		for (let i = 0; i < verfResult.length; i++) {
			if (!verfResult[i]) {
				return fail(400, { errorMsg: `${displayFieldName[i]} cannot be empty` });
			}
		}

		const verfTransType = transactionType as FormDataEntryValue;
		const verfIdFrom = accountIdFrom as FormDataEntryValue;
		const verfAmt = amountInCents as FormDataEntryValue;

		const transactAccountRequest: AccountTransactionRequest = {
			accountIdFrom: Number.parseInt(verfIdFrom.toString()),
			amount: verfAmt.toString(),
			transactionType: verfTransType
				.toString()
				.toUpperCase() as AccountTransactionRequestTransactionType
		};
		if (accountIdTo !== null) {
			transactAccountRequest.accountIdTo = Number.parseInt(accountIdTo.toString());
		}

		if (exchangeRateInMilli !== null) {
			transactAccountRequest.exchangeRate = exchangeRateInMilli.toString()
		}

		const fetcher = new Fetcher(event);
		const result = (await fetcher.fetchFor(
			ApiType.Account,
			HttpMethod.POST,
			'transact',
			{},
			JSON.stringify(transactAccountRequest)
		)) as FetchResponse<EmtpyKnownApiResponse>;
		return await result.json();
	}
};
