<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import DropdownLabelTop from '$lib/components/DropdownLabelTop.svelte';
	import InputGroupLabelTop from '$lib/components/InputGroupLabelTop.svelte';
	import {
	  NotificationType,
	  addToast,
	  addToastFromApiErrors,
	  allAccounts,
	  transactAccount
	} from '$lib/stores/stores';
	import { ApiResponseStatus } from '$lib/types/api/data-contracts.js';
	import { MILLI_INPUT_STEPS } from '$lib/utils/constants.js';
	import { convertToReadableMonetary } from '$lib/utils/utils.js';
	import FaCashRegister from 'svelte-icons/fa/FaCashRegister.svelte';
	import { FormFields } from './form.js';

	export let data;
	export let form;
	let actionMessage: string;
	let amtChange: string = '0';
	let exchangeRate: string = '0';
	let fromFinalAmt: string = '0';
	let toFinalAmt: string = '0';
	let selectedAccId: string | undefined = undefined;
	let toStartAmt: string = '0';

	$: accounts = $allAccounts;
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
	$: fromFinalAmt = convertToReadableMonetary(transactableAccount?.currentValue ?? '0');
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
		if (selectedAccId !== undefined) {
			toStartAmt = convertToReadableMonetary(
				accounts.find((acc) => acc.id.toString() === selectedAccId)?.currentValue ?? '0'
			);
			toFinalAmt = toStartAmt;
		}
	}
	$: {
		if (amtChange === '' || (type === 'Transfer' && exchangeRate === '')) {
			fromFinalAmt = convertToReadableMonetary(transactableAccount?.currentValue ?? '0');
			toFinalAmt = convertToReadableMonetary(
				accounts.find((acc) => acc.id.toString() === selectedAccId)?.currentValue ?? '0'
			);
		} else {
			const changedAmt = Number.parseFloat(amtChange);
			if (type === 'Deposit') {
				const depositedAmt =
					Number.parseFloat(transactableAccount?.currentValue ?? '0') + changedAmt;
				fromFinalAmt = depositedAmt.toFixed(2);
			} else if (type === 'Withdraw') {
				const withdrawnAmt =
					Number.parseFloat(transactableAccount?.currentValue ?? '0') - changedAmt;
				fromFinalAmt = withdrawnAmt.toFixed(2);
			} else {
				if (exchangeRate !== '0') {
					const rate = Number.parseFloat(exchangeRate);
					const finalAmt = Number.parseFloat(transactableAccount?.currentValue ?? '0') - changedAmt;
					fromFinalAmt = finalAmt.toFixed(2);
					const calcFinalAmt = Number.parseFloat(toStartAmt) + changedAmt * rate;
					toFinalAmt = calcFinalAmt.toFixed(2);
				}
			}
		}
	}

	function handleAmountInput(event) {
		amtChange = event?.target?.value ?? '0';
	}

	function handleExchangeRateInput(event) {
		exchangeRate = event?.target?.value ?? '0';
	}

	function handleSelectionChange(event) {
		selectedAccId = event?.target?.value;
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
				{#if type === 'Transfer'}
					<div class="grid grid-cols-2 gap-4">
						<InputGroupLabelTop
							required
							label="Transfer From"
							subLabel="From"
							placeholder="XYZ Brokers"
							value={transactableAccount.accountName}
							readonly
						/>
						<DropdownLabelTop
							required
							label="Transfer To"
							selectName={FormFields.ACCOUNT_ID_TO}
							options={accounts
								.filter((acc) => acc.accountName !== transactableAccount?.accountName)
								.map((account) => account.accountName)}
							values={accounts
								.filter((acc) => acc.accountName !== transactableAccount?.accountName)
								.map((account) => account.id.toString())}
							on:change={handleSelectionChange}
						/>
					</div>
				{:else}
					<InputGroupLabelTop
						required
						label="Account"
						subLabel="Name"
						placeholder="XYZ Brokers"
						value={transactableAccount.accountName}
						readonly
					/>
				{/if}
				{#if type === 'Transfer'}
					<div class="grid grid-cols-2 gap-4">
						<InputGroupLabelTop
							required
							label="Amount"
							subLabel="Amount"
							placeholder="0"
							inputName={FormFields.AMOUNT_IN_CENTS}
							type="number"
							on:input={handleAmountInput}
						/>
						<InputGroupLabelTop
							required
							label="Exchange Rate (From → To)"
							subLabel="Rate"
							placeholder="0"
							inputName={FormFields.EXCHANGE_RATE_IN_MILLI}
							type="number"
							step={MILLI_INPUT_STEPS}
							on:input={handleExchangeRateInput}
						/>
					</div>
				{:else}
					<InputGroupLabelTop
						required
						label="Amount"
						subLabel="Amount"
						placeholder="0"
						inputName={FormFields.AMOUNT_IN_CENTS}
						type="number"
						on:input={handleAmountInput}
					/>
				{/if}

				{#if type === 'Transfer'}
					<div class="grid grid-cols-2">
						<div class="flex items-center flex-col">
							<p class="text-2xl mb-2">Account From</p>
							<p class="text-xl font-bold">
								{convertToReadableMonetary(transactableAccount.currentValue) + ' → ' + fromFinalAmt}
							</p>
						</div>
						<div class="flex items-center flex-col">
							<p class="text-2xl mb-2">Account To</p>
							<p class="text-xl font-bold">
								{toStartAmt + ' → ' + toFinalAmt}
							</p>
						</div>
					</div>
				{:else}
					<div class="flex items-center flex-col">
						<p class="text-2xl mb-2">Change in account value</p>
						<p class="text-xl font-bold">
							{convertToReadableMonetary(transactableAccount.currentValue) + ' → ' + fromFinalAmt}
						</p>
					</div>
				{/if}

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
