import type { ApiError } from '$lib/types/api/data-contracts';
import type { Account, SearchResult, Stock } from '$lib/types/model';
import { writable } from 'svelte/store';

export enum NotificationType {
  SUCCESS,
  WARNING,
  ERROR
}

export interface Notification {
  message: string;
  type: NotificationType;
}

export const notifications = writable<Notification[]>([]);

export function addToast(message: string, notifType: NotificationType) {
	notifications.update((state) => [{ message: message, type: notifType }, ...state]);
  setTimeout(removeToast, 3000);
}

export function removeToast() {
	notifications.update((state) => {
		return [...state.slice(0, state.length - 1)];
	});
}

export function addToastFromApiErrors(errors: ApiError[] | undefined) {
  errors?.forEach((error) => addToast(error.message, NotificationType.ERROR));
}

export const accountToEdit = writable<Account | undefined>();
export function editAccount(account: Account) {
  accountToEdit.set(account);
}

export function removeEditAccount() {
  accountToEdit.set(undefined);
}

export const stockSearchResult = writable<SearchResult | undefined>();
export function addStockSearchResult(searchResult: SearchResult) {
  stockSearchResult.set(searchResult);
}

export function removeStockSearchResult() {
  stockSearchResult.set(undefined);
}

export const stock = writable<Stock>();
export function addStock(stockToAdd: Stock) {
  stock.set(stockToAdd);
}