import type { LoadEvent, RequestEvent } from '@sveltejs/kit';

export enum ApiType {
	Account,
	Group,
	Stock
}

export enum HttpMethod {
	GET = 'GET',
	POST = 'POST',
	PUT = 'PUT',
	PATCH = 'PATCH',
	DELETE = 'DELETE',
	OPTIONS = 'OPTIONS'
}

export interface FetchResponse<T> extends Omit<Response, 'json'> {
  json: () => Promise<T>
}

export class Fetcher {
	private event?: LoadEvent | RequestEvent;

	constructor(event?: LoadEvent | RequestEvent) {
		this.event = event;
	}

	async fetchFor(
		apiType: ApiType,
		method: HttpMethod,
		urlParams?: string,
		headers?: Record<string, string>,
    body?: BodyInit | null | undefined
	): Promise<Response> {
		let internalUri = '/api';
		switch (apiType) {
			case ApiType.Account:
				internalUri += '/account';
				break;
			case ApiType.Group:
				internalUri += '/group';
				break;
			case ApiType.Stock:
				internalUri += '/stock';
				break;
		}

		if (urlParams !== undefined) {
			internalUri += `/${urlParams}`;
		}

		const defaultHeaders = {
			'Content-Type': 'application/json',
      'Accept': 'application/json'
		};
		const combinedHeaders = {
			...headers,
			...defaultHeaders
		};
    
    const fetchToUse = this.event ? this.event.fetch : fetch;

		return fetchToUse(internalUri, {
			method: method.toString(),
			headers: combinedHeaders,
      body: body
		});
	}
}
