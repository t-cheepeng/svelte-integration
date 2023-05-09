<script lang="ts">
	import Fab from '$lib/components/Fab.svelte';
	import ProgressIndicator from '$lib/components/ProgressIndicator.svelte';
	import TradeCard from '$lib/components/TradeCard.svelte';
	import { NotificationType, addToast, addToastFromApiErrors } from '$lib/stores/stores.js';
	import { ApiResponseStatus, TradeResponseTradeType } from '$lib/types/api/data-contracts.js';
	import type { Trade } from '$lib/types/model.js';
	import FaRegCreditCard from 'svelte-icons/fa/FaRegCreditCard.svelte';

	export let data;
	let trades: Trade[];

	$: data.streamed.data.then((response) => {
		if (response.status === ApiResponseStatus.SUCCESS && response.data !== undefined) {
			trades =
				response.data.trades?.map((trade) => {
					return {
						tradeType: trade.tradeType ?? TradeResponseTradeType.BUY,
						tradeTs: trade.tradeTs ?? '1970-01-01T00:00:00.000Z',
						fee: trade.fee ?? 0,
						stockName: trade.name ?? '',
						numOfUnits: trade.numOfUnits ?? 0,
						pricePerUnit: trade.pricePerUnit ?? 0
					};
				}) ?? [];
		} else if (response.status === ApiResponseStatus.FAIL) {
			addToastFromApiErrors(response.errors);
		} else {
			addToast('Internal server error', NotificationType.ERROR);
		}
	});
	$: console.log(trades);
</script>

{#await data.streamed.data}
	<ProgressIndicator />
{:then}
	{#if trades.length <= 0}
		<div class="flex flex-col justify-center items-center p-8 h-screen">
			<span class="icon-xl mb-6"><FaRegCreditCard /></span>
			<h1 class="text-6xl font-bold mb-4">No trades?</h1>
			<p class="text-xl">Add one with the "+" button now</p>
		</div>
	{:else}
		<div class="p-8">
			<div class="mb-8">
				<h1 class="font-extrabold text-4xl mb-2">Trades</h1>
				<p class="text-lg">
					View all your trades here. The amount in the trade is exclusive of any fees
				</p>
			</div>

			{#each trades as trade}
				<TradeCard {trade} />
			{/each}
		</div>
	{/if}
	<Fab href="/trades/trade" />
{/await}
