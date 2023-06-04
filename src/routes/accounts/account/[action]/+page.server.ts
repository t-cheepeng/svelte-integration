import type { EmtpyKnownApiResponse } from '$lib/types/api';
import type { Api } from '$lib/types/api/ApiRoute';
import {
  CreateAccountRequestAccountType,
  type AccountAccountGroupRequest
} from '$lib/types/api/data-contracts';
import { CURRENCIES } from '$lib/utils/constants';
import { ApiType, Fetcher, HttpMethod, type FetchResponse } from '$lib/utils/fetcher';
import { verifyNotBlank } from '$lib/utils/verifier';
import { error, fail } from '@sveltejs/kit';
import type { Actions } from '../$types';
import { FormFields } from './form';

export function load({ params }) {
	if (!['create', 'edit', 'group', 'ungroup'].includes(params.action)) {
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
			cash: balance?.toString() ?? '0'
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
	},

	group: async (event) => {
		const formData = await event.request.formData();

		const groupId = formData.get(FormFields.GROUP);
		const accountId = formData.get(FormFields.ID);

		const verfResult = verifyNotBlank([groupId, accountId]);
		const displayFieldName = ['Group', 'Account'];
		for (let i = 0; i < verfResult.length; i++) {
			if (!verfResult[i]) {
				return fail(400, { errorMsg: `${displayFieldName[i]} cannot be empty` });
			}
		}

		const verfGroupId = groupId as FormDataEntryValue;
		const verfAccountId = accountId as FormDataEntryValue;
		const groupRequest: AccountAccountGroupRequest = {
			accountId: Number.parseInt(verfAccountId.toString()),
			accountGroupId: Number.parseInt(verfGroupId.toString())
		};

		const fetcher = new Fetcher(event);
		const groupResponse = (await fetcher.fetchFor(
			ApiType.Group,
			HttpMethod.POST,
			'group',
			undefined,
			JSON.stringify(groupRequest)
		)) as FetchResponse<EmtpyKnownApiResponse>;
		return await groupResponse.json();
	},

	ungroup: async (event) => {
		const formData = await event.request.formData();

		const groupIds = formData.getAll(FormFields.GROUP);
		const accountId = formData.get(FormFields.ID);

		const verfResult = verifyNotBlank([groupIds, accountId]);
		const displayFieldName = ['Group', 'Account'];
		for (let i = 0; i < verfResult.length; i++) {
			if (!verfResult[i]) {
				return fail(400, { errorMsg: `${displayFieldName[i]} cannot be empty` });
			}
		}

		const verfAccountId = accountId as FormDataEntryValue;

		const ungroupRequests: AccountAccountGroupRequest[] = groupIds.map((groupId) => {
			return {
				accountGroupId: Number.parseInt(groupId.toString()),
				accountId: Number.parseInt(verfAccountId.toString())
			};
		});

		const fetcher = new Fetcher(event);
		const allRequestPromises = Promise.all(
			ungroupRequests.map(async (ungroupRequest) => {
				const fetchResult = (await fetcher.fetchFor(
					ApiType.Group,
					HttpMethod.DELETE,
					'group',
					undefined,
					JSON.stringify(ungroupRequest)
        )) as FetchResponse<EmtpyKnownApiResponse>;
        return await fetchResult.json();
			})
		);
    return await allRequestPromises;
	}
} satisfies Actions;
