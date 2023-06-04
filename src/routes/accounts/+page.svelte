<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import AccountCard from '$lib/components/AccountCard.svelte';
	import AccountTransactionCard from '$lib/components/AccountTransactionCard.svelte';
	import Fab from '$lib/components/Fab.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import ProgressIndicator from '$lib/components/ProgressIndicator.svelte';
	import TradeCard from '$lib/components/TradeCard.svelte';
	import {
	  NotificationType,
	  addToast,
	  editAccount,
	  setAllAccounts,
	  setAllGroups,
	  transact
	} from '$lib/stores/stores';
	import type { EmtpyKnownApiResponse, KnownApiResponse } from '$lib/types/api';
	import {
	  ApiResponseStatus,
	  type AccountActivityPageResponse,
	  type AccountTransactions,
	  type TradeResponse
	} from '$lib/types/api/data-contracts';
	import type { AccountActivity, PagedTransactionAccount } from '$lib/types/model';
	import { ApiType, Fetcher, HttpMethod, type FetchResponse } from '$lib/utils/fetcher';
	import { isTrade } from '$lib/utils/guard';
	import { mapTradeResponseToModel } from '$lib/utils/mapper';
	import { sleep } from '$lib/utils/utils';
	import FaExchangeAlt from 'svelte-icons/fa/FaExchangeAlt.svelte';
	import FaObjectUngroup from 'svelte-icons/fa/FaObjectUngroup.svelte';
	import FaOdnoklassniki from 'svelte-icons/fa/FaOdnoklassniki.svelte';
	import FaRegObjectUngroup from 'svelte-icons/fa/FaRegObjectUngroup.svelte';
	import GiPayMoney from 'svelte-icons/gi/GiPayMoney.svelte';
	import GiReceiveMoney from 'svelte-icons/gi/GiReceiveMoney.svelte';
	import IoIosArrowDown from 'svelte-icons/io/IoIosArrowDown.svelte';
	import IoIosDoneAll from 'svelte-icons/io/IoIosDoneAll.svelte';
	import MdDeleteForever from 'svelte-icons/md/MdDeleteForever.svelte';
	import MdEdit from 'svelte-icons/md/MdEdit.svelte';
	import type { PageData } from './$types';
	import type { AccountPageData } from './+page';

	export let data: PageData;
	let accountWithTransaction: PagedTransactionAccount[] = [];
	let selectedAccount: boolean[] = [];
	let isOpen: boolean = false;
	let isDeleteLoading: boolean = false;
	let isLoading: boolean = false;
	$: selected = $page.url.hash;
	$: {
		const idxOfSelected = accountWithTransaction.findIndex(
			(acc) => acc.account.id.toString() === selected.substring(1)
		);
		selectedAccount = selectedAccount.map((_) => false);
		if (idxOfSelected >= 0) {
			selectedAccount[idxOfSelected] = true;
		}
	}
	$: {
		const idxOfSelected = selectedAccount.findIndex((isSelected) => isSelected);
		if (idxOfSelected < 0 && selectedAccount.length > 0) {
			window.location.hash = '#' + accountWithTransaction[0].account.id;
			selectedAccount = [...selectedAccount];
			selectedAccount[0] = true;
		}
	}
	data.streamed.data.then((response) => {
		if (response.status === ApiResponseStatus.SUCCESS && response.data !== undefined) {
			const responseAccounts: AccountPageData = response.data;
			accountWithTransaction = responseAccounts.accountTransactions;
			setAllGroups(responseAccounts.groups);
			setAllAccounts(accountWithTransaction.map((responseAccount) => responseAccount.account));
			selectedAccount = accountWithTransaction.map((_) => false);
			if (selectedAccount.length > 0) {
				selectedAccount[0] = true;
			}
		} else if (response.status === ApiResponseStatus.FAIL && response.errors !== undefined) {
			response.errors.forEach((error) => addToast(error.message, NotificationType.ERROR));
		} else {
			addToast('Internal server error', NotificationType.ERROR);
		}
	});

	async function handleDelete() {
		isDeleteLoading = true;
		await sleep(500);
		const selectedIdx = selectedAccount.findIndex((isSelected) => isSelected);
		const curSelectedAccount = accountWithTransaction[selectedIdx];
		const fetcher = new Fetcher();
		const deleteResponse = (await fetcher.fetchFor(
			ApiType.Account,
			HttpMethod.DELETE,
			curSelectedAccount.account.id.toString()
		)) as FetchResponse<EmtpyKnownApiResponse>;

		const deleteResponseJson = await deleteResponse.json();

		if (deleteResponseJson.status === ApiResponseStatus.SUCCESS) {
			accountWithTransaction = accountWithTransaction.filter(
				(account) => account.account.id !== curSelectedAccount.account.id
			);
			selectedAccount = selectedAccount.filter((isSelected) => !isSelected);
			addToast('Account deleted', NotificationType.SUCCESS);
		} else {
			addToast('Failed to delete account', NotificationType.ERROR);
			deleteResponseJson.errors?.forEach((error) =>
				addToast(error.message, NotificationType.ERROR)
			);
		}
		isDeleteLoading = false;
		isOpen = false;
	}

	function navToAction(action: string) {
		return () => {
			const selectedIdx = selectedAccount.findIndex((isSelected) => isSelected);
			editAccount(accountWithTransaction[selectedIdx].account);
			if (browser) {
				goto('/accounts/account/' + action);
			}
		};
	}

	function navToTransact(type: string) {
		const nav = () => {
			const idx = selectedAccount.findIndex((isSelected) => isSelected);
			transact(accountWithTransaction[idx].account);
			if (browser) {
				goto('/accounts/transact/' + type);
			}
		};
		return nav;
	}

	async function loadMore() {
		isLoading = true;
		const accountToLoadFor: PagedTransactionAccount =
			accountWithTransaction[selectedAccount.findIndex((selected) => selected)];

		const fetcher = new Fetcher();
		const nextPageFetch = (await fetcher.fetchFor(
			ApiType.Account,
			HttpMethod.GET,
			`history/${accountToLoadFor.account.id.toString()}?tradePage=${
				accountToLoadFor.hasNextPageForTrade ? accountToLoadFor.nextPageForTrade.toString() : '-1'
			}&transactionPage=${
				accountToLoadFor.hasNextPageForTransactions
					? accountToLoadFor.nextPageForTransactions.toString()
					: '-1'
			}`
		)) as FetchResponse<KnownApiResponse<AccountActivityPageResponse>>;
		const nextPageResponse = await nextPageFetch.json();

		if (
			nextPageResponse.status === ApiResponseStatus.SUCCESS &&
			nextPageResponse.data !== undefined
		) {
			const nextPageData: AccountActivityPageResponse = nextPageResponse.data;
			accountToLoadFor.hasNextPageForTrade = nextPageData.hasNextPageForTrade ?? false;
			accountToLoadFor.hasNextPageForTransactions = nextPageData.hasNextPageForTransaction ?? false;
			accountToLoadFor.nextPageForTrade = nextPageData.nextPageNumForTrade ?? -1;
			accountToLoadFor.nextPageForTransactions = nextPageData.nextPageNumForTransaction ?? -1;

			const newTrades: TradeResponse[] = nextPageData.accountTradesInCurrentPage ?? [];
			const newTransactions: AccountTransactions[] =
				nextPageData.accountTransactionsInCurrentPage ?? [];
			newTrades.forEach((newTrade) =>
				accountToLoadFor.trades.push(mapTradeResponseToModel(newTrade))
			);
			newTransactions.forEach((newTransaction) =>
				accountToLoadFor.transactions.push(newTransaction)
			);

			const newActivities: AccountActivity[] = [
				...accountToLoadFor.trades,
				...accountToLoadFor.transactions
			];
			newActivities.sort((activity, other) => {
				const activityTime = (isTrade(activity) ? activity.tradeTs : activity.transactionTs) ?? '';
				const otherTime = (isTrade(other) ? other.tradeTs : other.transactionTs) ?? '';
				return new Date(activityTime) < new Date(otherTime) ? 1 : -1;
			});
			newActivities.forEach((newActivity) => accountToLoadFor.allActivity.push(newActivity));

			accountWithTransaction = [...accountWithTransaction];
		} else if (
			nextPageResponse.status === ApiResponseStatus.FAIL &&
			nextPageResponse.errors !== undefined
		) {
			nextPageResponse.errors.forEach((error) => addToast(error.message, NotificationType.ERROR));
		} else {
			addToast('Internal server error', NotificationType.ERROR);
		}
		isLoading = false;
	}
</script>

{#if isDeleteLoading || isLoading}
	<ProgressIndicator />
{/if}

{#await data.streamed.data}
	<ProgressIndicator />
{:then}
	{#if accountWithTransaction.length === 0}
		<div class="flex flex-col justify-center items-center p-8 h-screen">
			<span class="icon-xl mb-6"><FaOdnoklassniki /></span>
			<h1 class="text-6xl font-bold mb-4">No Account?</h1>
			<p class="text-xl">Create one with the "+" button now</p>
		</div>
	{:else}
		<div class="flex justify-center w-full gap-2">
			<div class="carousel p-8 w-full carousel-center">
				{#each accountWithTransaction as account}
					<div class="carousel-item w-full m-2" id={account.account.id.toString()}>
						<AccountCard account={account.account} />
					</div>
				{/each}
			</div>
		</div>

		<div class="flex flex-row justify-center mb-4 gap-2">
			{#each selectedAccount as selected, index}
				<a
					href="#{accountWithTransaction[index].account.id.toString()}"
					class="btn btn-xs"
					class:selected>{index + 1}</a
				>
			{/each}
		</div>

		<div class="flex justify-evenly p-10 mb-8">
			<button class="btn btn-circle btn-outline icon-lg" on:click={navToTransact('deposit')}>
				<span class="icon-lg mb-2"><GiPayMoney /></span>
				<p class="text-md">Deposit</p>
			</button>
			<button class="btn btn-circle btn-outline icon-lg" on:click={navToTransact('withdraw')}>
				<span class="icon-lg mb-2"><GiReceiveMoney /></span>
				<p class="text-md">Withdraw</p>
			</button>
			<button class="btn btn-circle btn-outline icon-lg" on:click={navToTransact('transfer')}>
				<span class="icon-lg mb-2"><FaExchangeAlt /></span>
				<p class="text-md">Transfer</p>
			</button>
			<button class="btn btn-circle btn-outline icon-lg" on:click={navToAction('group')}>
				<span class="icon-lg mb-2"><FaObjectUngroup /></span>
				<p class="text-md">Group</p>
			</button>
			{#if accountWithTransaction[selectedAccount.findIndex((selected) => selected)].account.groups.length !== 0}
				<button class="btn btn-circle btn-outline icon-lg" on:click={navToAction('ungroup')}>
					<span class="icon-lg mb-2"><FaRegObjectUngroup /></span>
					<p class="text-md">Ungroup</p>
				</button>
			{/if}
			<button class="btn btn-circle btn-outline icon-lg" on:click={navToAction('edit')}>
				<span class="icon-lg mb-2"><MdEdit /></span>
				<p class="text-md">Edit</p>
			</button>
			<button class="btn btn-circle btn-outline icon-lg" on:click={() => (isOpen = true)}>
				<span class="icon-lg mb-2"><MdDeleteForever /></span>
				<p class="text-md">Delete</p>
			</button>
		</div>

		<h1 class="text-5xl flex pl-8">Latest Activity</h1>

		<div class="mt-10 px-8 flex flex-col justify-center items-center">
			{#each accountWithTransaction[selectedAccount.findIndex((selected) => selected)].allActivity as activities}
				{#if isTrade(activities)}
					<TradeCard trade={activities} />
				{:else}
					<AccountTransactionCard transaction={activities} />
				{/if}
			{/each}
			{#if accountWithTransaction[selectedAccount.findIndex((selected) => selected)].hasNextPageForTrade || accountWithTransaction[selectedAccount.findIndex((selected) => selected)].hasNextPageForTransactions}
				<button class="btn btn-circle btn-outline icon-lg mb-6" on:click={loadMore}>
					<span class="icon-md mb-2"><IoIosArrowDown /></span>
					<p class="text-md">More</p>
				</button>
			{:else}
				<span class="icon-md mb-2"><IoIosDoneAll /></span>
				<p class="text-md">That's all the activities for this account!</p>
			{/if}
		</div>
	{/if}
{/await}

<Fab href="/accounts/account/create" />
<Modal
	id="confirm-delete"
	modalTitle="Confirm Delete?"
	modalContent={`Are you sure you wish to delete the account?`}
	primaryActionText="Delete"
	secondaryActionText="Cancel"
	{isOpen}
	on:secondary={() => {
		isOpen = false;
	}}
	on:primary={() => {
		handleDelete();
	}}
/>

<style>
	.selected {
		background-color: hsl(var(--s));
		color: hsl(var(--sc));
	}

	.btn-outline {
		border: 0;
	}

	.btn-outline:hover {
		background-color: hsl(var(--n) / var(--tw-bg-opacity));
		color: hsl(var(--nc) / var(--tw-text-opacity));
	}
</style>
