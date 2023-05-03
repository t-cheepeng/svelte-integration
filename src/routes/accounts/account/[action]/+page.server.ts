import type { EmtpyKnownApiResponse } from '$lib/types/api';
import type { Api } from '$lib/types/api/ApiRoute';
import { CreateAccountRequestAccountType } from '$lib/types/api/data-contracts';
import { CURRENCIES } from '$lib/utils/constants';
import { ApiType, Fetcher, HttpMethod, type FetchResponse } from '$lib/utils/fetcher';
import { error, fail } from '@sveltejs/kit';
import type { Actions } from '../$types';

export function load({params}) {
  if (!["create", "edit"].includes(params.action)) {
    throw error(404);
  }
  return params;
}

export const actions = {
	default: async (event) => {
		const formData = await event.request.formData();

		const accType = formData.get('accountType');
    const currency = formData.get('denomination');
    const accName =  formData.get('accountName');
    const balance = formData.get('balance');

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

    if (accName === undefined || accName === null) {
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
			};
    }
    const cashInCents = balance?.toString() ?? '0';

		const createAccountRequest: Api.CreateAccount.RequestBody = {
			accountType: accType.toString() as CreateAccountRequestAccountType,
			currency: currency.toString(),
			description: formData.get('description')?.toString(),
			name: accName.toString(),
			cashInCents: Number.parseInt(cashInCents)
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
	}
} satisfies Actions;
