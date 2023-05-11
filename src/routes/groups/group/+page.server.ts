import type { EmtpyKnownApiResponse } from "$lib/types/api";
import type { Api } from "$lib/types/api/ApiRoute";
import { ApiType, Fetcher, HttpMethod, type FetchResponse } from "$lib/utils/fetcher";
import { verifyNotBlank } from "$lib/utils/verifier";
import { fail } from "@sveltejs/kit";
import { FormFields } from "./form";

export const actions = {
	create: async (event) => {
		const formData = await event.request.formData();

		const groupName = formData.get(FormFields.name);
		const currency = formData.get(FormFields.currency);

		const verfResult = verifyNotBlank([groupName, currency]);
		const displayFieldName = ['Group name', 'Currency'];
		for (let i = 0; i < verfResult.length; i++) {
			if (!verfResult[i]) {
				return fail(400, { errorMsg: `${displayFieldName[i]} cannot be empty` });
			}
		}

		const verfStockName = groupName as FormDataEntryValue;
		const verfCurrency = currency as FormDataEntryValue;

		const createGroupRequest: Api.CreateAccountGroup.RequestBody = {
			name: verfStockName.toString(),
			currency: verfCurrency.toString()
		};

		const fetcher = new Fetcher(event);
		const createResult = (await fetcher.fetchFor(
			ApiType.Group,
			HttpMethod.POST,
			`create`,
			{},
			JSON.stringify(createGroupRequest)
		)) as FetchResponse<EmtpyKnownApiResponse>;

		return await createResult.json();
	}
};