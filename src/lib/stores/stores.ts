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

export const accountToEdit = writable<Account | undefined>();
export function editAccount(account: Account) {
  accountToEdit.set(account);
}

export function removeEditAccount() {
  accountToEdit.set(undefined);
}