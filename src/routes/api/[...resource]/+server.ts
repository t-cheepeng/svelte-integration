import { ApiResponseStatus, type CreateAccountRequest, type PatchAccountRequest } from "$lib/types/api/data-contracts";
import { AccountClient } from "$lib/utils/clients";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";


export const GET = (async ({params}) => {
  const [apiType, ...remainingParams] = params.resource.split('/');
	if (apiType === 'account') {
    const accClient = new AccountClient();
    let response;
    
    if (remainingParams[0] !== undefined) {
      response = await accClient.getAccount({accountId: Number.parseInt(remainingParams[0])})
    } else {
      response = await accClient.getAllAccounts();
    }
    
    return json(response);
	} else {
    return serverError();
  }
}) satisfies RequestHandler;

export const DELETE = (async ({params}) => {
  const [apiType, ...remainingParams] = params.resource.split('/');

  if (apiType === 'account') {
    const accClient = new AccountClient();
    let response;

    if (remainingParams[0] !== undefined) {
      response = await accClient.deleteAccount({accountId: Number.parseInt(remainingParams[0])})
    } else {
      return serverError();
    }

    return json(response);
  } else {
    return serverError();
  }
}) satisfies RequestHandler;

export const POST = (async ({params, request}) => {
  const [apiType, ...remainingParams] = params.resource.split('/');

  if (apiType === 'account') {
    const accClient = new AccountClient();
    let response;

    if (remainingParams[0] === "create") {
      const jsonBody = await request.json() as CreateAccountRequest;
      response = await accClient.createAccount(jsonBody);
      return json(response);
    } else {
      return serverError();
    }
  }

  return serverError();
}) satisfies RequestHandler;

export const PATCH = (async ({ params, request }) => {
	const [apiType, ...remainingParams] = params.resource.split('/');

	if (apiType === 'account') {
		const accClient = new AccountClient();
		let response;

		if (remainingParams[0] === 'update') {
			const jsonBody = (await request.json()) as PatchAccountRequest;
			response = await accClient.patchAccount(jsonBody);
			return json(response);
		} else {
			return serverError();
		}
	}

	return serverError();
}) satisfies RequestHandler;

const serverError = () => {
  return json({status: ApiResponseStatus.FAIL, errors: [{ code: '500', message: 'Internal server error' }]})
}