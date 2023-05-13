<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import InputGroupLabelTop from '$lib/components/InputGroupLabelTop.svelte';
	import {
	  NotificationType,
	  addToast,
	  addToastFromApiErrors,
	  transactAccount
	} from '$lib/stores/stores';
	import { ApiResponseStatus } from '$lib/types/api/data-contracts.js';
	import { convertCentsToDollarAndCents } from '$lib/utils/utils.js';
	import FaCashRegister from 'svelte-icons/fa/FaCashRegister.svelte';
	import { FormFields } from './form.js';

	export let data;
	export let form;
	let actionMessage: string;
	let amtChange: string = '0';
	let finalAmt: number = 0;

	$: type = data.type.slice(0, 1).toUpperCase() + data.type.slice(1).toLowerCase();
	$: {
		if (type === 'Deposit') {
			actionMessage = 'Deposit cash into the account';
		} else if (type === 'Withdraw') {
			actionMessage = 'Withdraw cash from the account';
		} else {
			actionMessage = 'Transfer cash between accounts';
		}
	}
	$: transactableAccount = $transactAccount;
	$: finalAmt = transactableAccount?.currentValue ?? 0;
	$: {
		if (form?.errorMsg) {
			addToast(form.errorMsg, NotificationType.ERROR);
		} else if (form?.status === ApiResponseStatus.SUCCESS) {
			addToast('Transaction successfully recorded', NotificationType.SUCCESS);
			if (browser) {
				goto('/accounts');
			}
		} else if (form?.status === ApiResponseStatus.FAIL && form?.errors != undefined) {
			addToastFromApiErrors(form.errors);
		}
	}
	$: {
		if (amtChange !== undefined) {
			if (amtChange === '') {
				finalAmt = transactableAccount?.currentValue ?? 0;
			} else {
				const amountInParts = amtChange.split('.');
				const changedAmt =
					amountInParts.length === 1
						? Number.parseInt(amountInParts[0]) * 100
						: Number.parseInt(amountInParts[0]) * 100 +
						  Number.parseInt(amountInParts[1].slice(0, 2));
				if (type === 'Deposit') {
					finalAmt = (transactableAccount?.currentValue ?? 0) + changedAmt;
				} else if (type === 'Withdraw') {
					finalAmt = (transactableAccount?.currentValue ?? 0) - changedAmt;
				}
			}
		}
	}

	function handleAmountInput(event) {
		amtChange = event?.target?.value ?? '0';
	}
</script>

{#if transactableAccount !== undefined}
	<div class="p-8">
		<div class="flex flex-col">
			<div class="flex flex-row align-top">
				<span class="icon-lg mr-4"><FaCashRegister /></span>
				<div class="flex flex-col">
					<h1 class="text-4xl font-bold mb-2">{type}</h1>
					<p class="text-lg">{actionMessage}</p>
				</div>
			</div>
			<div class="divider" />

			<form method="POST" action={`?/transact`}>
				<InputGroupLabelTop
					required
					label="Account"
					subLabel="Name"
					placeholder="XYZ Brokers"
					value={transactableAccount.accountName}
					readonly
				/>
				<InputGroupLabelTop
					required
					label="Amount"
					subLabel="Amount"
					placeholder="0"
					inputName={FormFields.AMOUNT_IN_CENTS}
					type="number"
					on:input={handleAmountInput}
				/>
				<div class="flex items-center flex-col">
					<p class="text-2xl mb-2">Change in account value</p>
					<p class="text-xl font-bold">
						{convertCentsToDollarAndCents(transactableAccount.currentValue) +
							' → ' +
							convertCentsToDollarAndCents(finalAmt)}
					</p>
				</div>
				<div class="divider" />
				<div class="grid grid-cols-2">
					<a class="btn btn-outline mx-4" href="/accounts">Cancel</a>
					<button class="btn btn-primary mx-4" type="submit">{`${type}`}</button>
				</div>
				<input
					hidden
					type="hidden"
					name={FormFields.ACCOUNT_ID_FROM}
					value={transactableAccount.id}
				/>
				<input hidden type="hidden" name={FormFields.TRANSACTION_TYPE} value={type} />
			</form>
		</div>
	</div>
{/if}
