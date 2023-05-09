<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import AccountCard from '$lib/components/AccountCard.svelte';
	import Fab from '$lib/components/Fab.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import ProgressIndicator from '$lib/components/ProgressIndicator.svelte';
	import { NotificationType, addToast, editAccount } from '$lib/stores/stores';
	import type { EmtpyKnownApiResponse } from '$lib/types/api';
	import { ApiResponseStatus, type AccountsResponse } from '$lib/types/api/data-contracts';
	import type { Account } from '$lib/types/model';
	import { ApiType, Fetcher, HttpMethod, type FetchResponse } from '$lib/utils/fetcher';
	import { sleep } from '$lib/utils/utils';
	import FaObjectUngroup from 'svelte-icons/fa/FaObjectUngroup.svelte';
	import FaOdnoklassniki from 'svelte-icons/fa/FaOdnoklassniki.svelte';
	import FaRegObjectUngroup from 'svelte-icons/fa/FaRegObjectUngroup.svelte';
	import MdDeleteForever from 'svelte-icons/md/MdDeleteForever.svelte';
	import MdEdit from 'svelte-icons/md/MdEdit.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	let accounts: Account[] = [];
	let selectedAccount: boolean[] = [];
	let isOpen: boolean = false;
	let isDeleteLoading: boolean = false;
	$: selected = $page.url.hash;
	$: {
		const idxOfSelected = accounts.findIndex((acc) => acc.id.toString() === selected.substring(1));
		selectedAccount = selectedAccount.map((_) => false);
		if (idxOfSelected >= 0) {
			selectedAccount[idxOfSelected] = true;
		}
	}
	$: {
		const idxOfSelected = selectedAccount.findIndex((isSelected) => isSelected);
		if (idxOfSelected < 0 && selectedAccount.length > 0) {
			window.location.hash = '#' + accounts[0].id;
			selectedAccount = [...selectedAccount];
			selectedAccount[0] = true;
		}
	}
	data.streamed.data.then((response) => {
		if (response.status === ApiResponseStatus.SUCCESS && response.data !== undefined) {
			const responseAccounts: AccountsResponse = response.data;
			accounts = responseAccounts.accounts.map((account) => {
				return {
					id: account.id,
					accountName: account.name,
					costBasis: 0,
					currentValue: 0,
					currency: account.currency,
					groups: []
				};
			});
			selectedAccount = responseAccounts.accounts.map((_) => false);
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
		const curSelectedAccount = accounts[selectedIdx];
		const fetcher = new Fetcher();
		const deleteResponse = (await fetcher.fetchFor(
			ApiType.Account,
			HttpMethod.DELETE,
			curSelectedAccount.id.toString()
		)) as FetchResponse<EmtpyKnownApiResponse>;

		const deleteResponseJson = await deleteResponse.json();

		if (deleteResponseJson.status === ApiResponseStatus.SUCCESS) {
			accounts = accounts.filter((account) => account.id !== curSelectedAccount.id);
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

  function edit() {
    const selectedIdx = selectedAccount.findIndex(isSelected => isSelected);
    editAccount(accounts[selectedIdx]);
    if (browser) {
      goto("/accounts/account/edit");
    }
  }
</script>

{#if isDeleteLoading}
	<ProgressIndicator />
{/if}

{#await data.streamed.data}
	<ProgressIndicator />
{:then}
	{#if accounts.length === 0}
		<div class="flex flex-col justify-center items-center p-8 h-screen">
			<span class="icon-xl mb-6"><FaOdnoklassniki /></span>
			<h1 class="text-6xl font-bold mb-4">No Account?</h1>
			<p class="text-xl">Create one with the "+" button now</p>
		</div>
	{:else}
		<div class="flex justify-center w-full gap-2">
			<div class="carousel p-8 w-full carousel-center">
				{#each accounts as account}
					<div class="carousel-item w-full m-2" id={account.id.toString()}>
						<AccountCard {account} />
					</div>
				{/each}
			</div>
		</div>

		<div class="flex flex-row justify-center mb-4 gap-2">
			{#each selectedAccount as selected, index}
				<a href="#{accounts[index].id.toString()}" class="btn btn-xs" class:selected>{index + 1}</a>
			{/each}
		</div>

		<div class="flex justify-evenly p-10 mb-8">
			<button class="btn btn-circle btn-outline icon-lg">
				<span class="icon-lg mb-2"><FaObjectUngroup /></span>
				<p class="text-md">Group</p>
			</button>
			<button class="btn btn-circle btn-outline icon-lg">
				<span class="icon-lg mb-2"><FaRegObjectUngroup /></span>
				<p class="text-md">Ungroup</p>
			</button>
			<button class="btn btn-circle btn-outline icon-lg" on:click={edit}>
				<span class="icon-lg mb-2"><MdEdit /></span>
				<p class="text-md">Edit</p>
			</button>
			<button class="btn btn-circle btn-outline icon-lg" on:click={() => (isOpen = true)}>
				<span class="icon-lg mb-2"><MdDeleteForever /></span>
				<p class="text-md">Delete</p>
			</button>
		</div>

		<h1 class="text-5xl flex pl-8">Latest Trades</h1>

		<div class="mt-10 px-8">
      
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
