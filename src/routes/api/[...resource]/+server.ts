import {
  ApiResponseStatus,
  type AccountAccountGroupRequest,
  type AccountTransactionRequest,
  type CreateAccountGroupRequest,
  type CreateAccountRequest,
  type CreateStockRequest,
  type PatchAccountRequest,
  type PatchStockRequest,
  type TradeStockRequest
} from '$lib/types/api/data-contracts';
import { AccountClient, GroupClient, StockClient } from '$lib/utils/clients';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const handleGetAccountEndpoints = async (remainingParams: string[], url: URL) => {
	const accClient = new AccountClient();

	if (remainingParams.length === 0) {
		return json(await accClient.getAllAccounts());
	}

	if (remainingParams[0] === 'history') {
		return json(
			await accClient.getHistory(
				{ accountId: Number.parseInt(remainingParams[1]) },
				{
					tradePage: Number.parseInt(url.searchParams.get('tradePage') ?? '0'),
					transactionPage: Number.parseInt(url.searchParams.get('transactionPage') ?? '0')
				}
			)
		);
	}

	if (remainingParams[0] !== undefined) {
		return json(await accClient.getAccount({ accountId: Number.parseInt(remainingParams[0]) }));
	}

	return serverError();
};

const handleGetStockEndpoints = async (remainingParams: string[]) => {
	const stockClient = new StockClient();
	let response;

	if (remainingParams[0] === 'search') {
		response = await stockClient.searchStock(remainingParams[1]);
	} else if (remainingParams[0] === 'trade' && remainingParams[1] === undefined) {
		response = await stockClient.getAllTrades();
	} else {
		response = await stockClient.getAllStocks();
	}
	return json(response);
};

const handleGetGroupEndpoints = async (remainingParams: string[]) => {
	const groupClient = new GroupClient();
	const response = await groupClient.getAllGroupMappings();
	return json(response);
};

export const GET = (async ({ params, url }) => {
	const [apiType, ...remainingParams] = params.resource.split('/');

	if (apiType === 'account') {
		return handleGetAccountEndpoints(remainingParams, url);
	} else if (apiType === 'stock') {
		return handleGetStockEndpoints(remainingParams);
	} else if (apiType === 'group') {
		return handleGetGroupEndpoints(remainingParams);
	} else {
		return serverError();
	}
}) satisfies RequestHandler;

export const DELETE = (async ({ params, request }) => {
	const [apiType, ...remainingParams] = params.resource.split('/');

	if (apiType === 'account') {
		const accClient = new AccountClient();
		let response;

		if (remainingParams[0] !== undefined) {
			response = await accClient.deleteAccount({ accountId: Number.parseInt(remainingParams[0]) });
		} else {
			return serverError();
		}

		return json(response);
	} else if (apiType === 'group') {
		const groupClient = new GroupClient();
		return json(
			await groupClient.ungroupAccount((await request.json()) as AccountAccountGroupRequest)
		);
	} else {
		return serverError();
	}
}) satisfies RequestHandler;

export const POST = (async ({ params, request }) => {
	const [apiType, ...remainingParams] = params.resource.split('/');

	if (apiType === 'account') {
		const accClient = new AccountClient();
		let response;

		if (remainingParams[0] === 'create') {
			const jsonBody = (await request.json()) as CreateAccountRequest;
			response = await accClient.createAccount(jsonBody);
			return json(response);
		} else if (remainingParams[0] === 'transact') {
			const jsonBody = (await request.json()) as AccountTransactionRequest;
			return json(await accClient.transactAccount(jsonBody));
		} else {
			return serverError();
		}
	} else if (apiType === 'stock') {
		const stockClient = new StockClient();
		let response;
		if (remainingParams[0] === 'trade') {
			response = await stockClient.tradeStock((await request.json()) as TradeStockRequest);
		} else if (remainingParams[0] === 'create') {
			response = await stockClient.createStock((await request.json()) as CreateStockRequest);
		} else {
			response = serverError();
		}

		return json(response);
	} else if (apiType === 'group') {
		const groupClient = new GroupClient();
		let response;
		if (remainingParams[0] === 'group') {
			response = await groupClient.groupAccount(
				(await request.json()) as AccountAccountGroupRequest
			);
		} else {
			response = await groupClient.createGroup((await request.json()) as CreateAccountGroupRequest);
		}

		return json(response);
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
	} else if (apiType === 'stock') {
		const stockClient = new StockClient();
		const response = await stockClient.patchStock((await request.json()) as PatchStockRequest);
		return json(response);
	}

	return serverError();
}) satisfies RequestHandler;

const serverError = () => {
	return json({
		status: ApiResponseStatus.FAIL,
		errors: [{ code: '500', message: 'Internal server error' }]
	});
};
