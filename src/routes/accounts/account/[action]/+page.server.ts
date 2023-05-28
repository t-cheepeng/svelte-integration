import type { EmtpyKnownApiResponse } from '$lib/types/api';
import type { Api } from '$lib/types/api/ApiRoute';
import { CreateAccountRequestAccountType } from '$lib/types/api/data-contracts';
import { CURRENCIES } from '$lib/utils/constants';
import { ApiType, Fetcher, HttpMethod, type FetchResponse } from '$lib/utils/fetcher';
import { error, fail } from '@sveltejs/kit';
import type { Actions } from '../$types';
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

		const accType = formData.get(FormFields.ACCOUNT_TYPE);
		const currency = formData.get(FormFields.DENOMINATION);
		const accName = formData.get(FormFields.ACCOUNT_NAME);
		const balance = formData.get(FormFields.BALANCE);

		if (accType === undefined || accType === null || accType.length <= 0) {
			return fail(400, {
				errorMsg: 'Account Type cannot be empty'
			});
		}

		if (!Object.values<string>(CreateAccountRequestAccountType).includes(accType.toString())) {
			return fail(400, {
				errorMsg: 'Account Type must be one of INVESTMENT or BUDGET'
			});
		}

		if (currency === undefined || currency === null) {
			return fail(400, {
				errorMsg: 'Currency cannot be empty'
			});
		}

		if (!CURRENCIES.includes(currency.toString())) {
			return fail(400, {
				errorMsg: 'Currency is unknown'
			});
		}

		if (accName === undefined || accName === null || accName.length <= 0) {
			return fail(400, {
				errorMsg: 'Account name cannot be empty'
			});
		}

		if (balance !== undefined && balance !== null) {
			// Only digits allowed in string
			if (!/^\d+$/.test(balance.toString())) {
				return fail(400, {
					errorMsg: 'Balance must be a postive integer'
				});
			}
		}

		const createAccountRequest: Api.CreateAccount.RequestBody = {
			accountType: accType.toString() as CreateAccountRequestAccountType,
			currency: currency.toString(),
			description: formData.get(FormFields.DESCRIPTION)?.toString(),
			name: accName.toString(),
			cash: balance?.toString() ?? "0"
		};
		const fetcher = new Fetcher(event);
		const response = (await fetcher.fetchFor(
			ApiType.Account,
			HttpMethod.POST,
			'create',
			{},
			JSON.stringify(createAccountRequest)
		)) as FetchResponse<EmtpyKnownApiResponse>;
		return await response.json();
	},

	edit: async (event) => {
		const formData = await event.request.formData();

		const accName = formData.get(FormFields.ACCOUNT_NAME);
		const desc = formData.get(FormFields.DESCRIPTION);
    const id = formData.get(FormFields.ID);

		if (accName === null || accName === undefined || accName.length <= 0) {
			return fail(400, {
				errorMsg: 'Account name cannot be empty'
			});
		}

    if (id === null || id === undefined || id.length <= 0) {
      return fail(400, {
				errorMsg: 'Seems like there is something wrong. Please try again'
			});
    }

		const patchAccountRequest: Api.PatchAccount.RequestBody = {
			id: Number.parseInt(id.toString()),
			name: accName.toString(),
			description: desc?.toString()
		};

		const fetcher = new Fetcher(event);
		const response = (await fetcher.fetchFor(
			ApiType.Account,
			HttpMethod.PATCH,
			'update',
			{},
			JSON.stringify(patchAccountRequest)
		)) as FetchResponse<EmtpyKnownApiResponse>;
		return await response.json();
	}
} satisfies Actions;
