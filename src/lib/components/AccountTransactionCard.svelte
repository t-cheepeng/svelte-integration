<script lang="ts">
	import { allAccounts } from '$lib/stores/stores';
	import {
	  AccountTransactionsTransactionType,
	  type AccountTransactions
	} from '$lib/types/api/data-contracts';
	import {
	  convertFullTimestampToReadableDateTime,
	  convertToReadableMonetary
	} from '$lib/utils/utils';
	import FaExchangeAlt from 'svelte-icons/fa/FaExchangeAlt.svelte';
	import FaRegQuestionCircle from 'svelte-icons/fa/FaRegQuestionCircle.svelte';
	import MdFileDownload from 'svelte-icons/md/MdFileDownload.svelte';
	import MdFileUpload from 'svelte-icons/md/MdFileUpload.svelte';

	export let transaction: AccountTransactions;
	$: toAccount = $allAccounts.find((acc) => acc.id === transaction.accountIdTo)?.accountName;
</script>

<div class="card w-full bg-neutral mb-6">
	<div class="card-body text-neutral-content grid grid-cols-12 gap-2">
		<span class="icon-md col-span-1 flex items-center self-center">
			{#if transaction.transactionType === AccountTransactionsTransactionType.DEPOSIT}
				<span class="text-success">
					<MdFileDownload />
				</span>
			{:else if transaction.transactionType === AccountTransactionsTransactionType.WITHDRAW}
				<span class="text-error">
					<MdFileUpload />
				</span>
			{:else if transaction.transactionType === AccountTransactionsTransactionType.TRANSFER}
				<span class="text-accent">
					<FaExchangeAlt />
				</span>
			{:else}
				<span class="text-gray">
					<FaRegQuestionCircle />
				</span>
			{/if}
		</span>
		<div
			class="flex-row justify-evenly"
			class:col-span-8={transaction.transactionType === AccountTransactionsTransactionType.TRANSFER}
			class:col-span-9={transaction.transactionType !== AccountTransactionsTransactionType.TRANSFER}
		>
			<p class="text-xl font-extrabold">{transaction.transactionType}</p>
			{#if toAccount !== undefined}
				<p>Receiving Account: {toAccount}</p>
			{/if}
			{#if transaction.transactionType === AccountTransactionsTransactionType.TRANSFER && transaction.exchangeRate}
				<p>Rate: {transaction.exchangeRate}</p>
			{/if}
			<p>
				Transacted on: {convertFullTimestampToReadableDateTime(transaction.transactionTs ?? '')}
			</p>
		</div>
		<div
			class="items-center flex"
			class:col-span-3={transaction.transactionType === AccountTransactionsTransactionType.TRANSFER}
			class:col-span-2={transaction.transactionType !== AccountTransactionsTransactionType.TRANSFER}
		>
			<p class="text-2xl font-medium">
				{convertToReadableMonetary(
					`${
						transaction.transactionType === AccountTransactionsTransactionType.DEPOSIT
							? '+'
							: transaction.transactionType === AccountTransactionsTransactionType.WITHDRAW
							? '-'
							: ''
					}${transaction.amount}`
				)}
				{#if transaction.transactionType === AccountTransactionsTransactionType.TRANSFER}
					→
					{convertToReadableMonetary(
						((transaction.amount ?? 0) * (transaction.exchangeRate ?? 0)).toString()
					)}
				{/if}
			</p>
		</div>
	</div>
</div>
