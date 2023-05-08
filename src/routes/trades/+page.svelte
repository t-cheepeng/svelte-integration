<script lang="ts">
	import ProgressIndicator from '$lib/components/ProgressIndicator.svelte';
	import TradeCard from '$lib/components/TradeCard.svelte';
	import { NotificationType, addToast, addToastFromApiErrors } from '$lib/stores/stores.js';
	import { ApiResponseStatus, TradeResponseTradeType } from '$lib/types/api/data-contracts.js';
	import type { Trade } from '$lib/types/model.js';

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
{/await}
