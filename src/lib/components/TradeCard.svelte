<script lang="ts">
	import { TradeResponseTradeType } from '$lib/types/api/data-contracts';
	import type { Trade } from '$lib/types/model';
	import { convertCentsToDollarAndCents, convertFullTimestampToReadableDateTime } from '$lib/utils/utils';
	import FaRegQuestionCircle from 'svelte-icons/fa/FaRegQuestionCircle.svelte';
	import MdAddCircleOutline from 'svelte-icons/md/MdAddCircleOutline.svelte';
	import MdAttachMoney from 'svelte-icons/md/MdAttachMoney.svelte';
	import MdRemoveCircleOutline from 'svelte-icons/md/MdRemoveCircleOutline.svelte';

	export let trade: Trade;
</script>

<div class="card w-full bg-neutral mb-6">
	<div class="card-body text-neutral-content grid grid-cols-12 gap-2">
		<span class="icon-md col-span-1 flex items-center self-center">
			{#if trade.tradeType === TradeResponseTradeType.BUY}
				<span class="text-success">
					<MdAddCircleOutline />
				</span>
			{:else if trade.tradeType === TradeResponseTradeType.SELL}
				<span class="text-error">
					<MdRemoveCircleOutline />
				</span>
			{:else if trade.tradeType === TradeResponseTradeType.DIVIDEND}
				<span class="text-accent">
					<MdAttachMoney />
				</span>
			{:else}
				<span class="text-neutral">
					<FaRegQuestionCircle />
				</span>
			{/if}
		</span>
		<div class="col-span-9 flex-row justify-evenly">
			<p class="text-xl font-extrabold">{trade.stockName}</p>
      <p>Traded at: {convertFullTimestampToReadableDateTime(trade.tradeTs)}</p>
			<p>Fee: {convertCentsToDollarAndCents(trade.fee)}</p>
		</div>
		<div class="col-span-2 items-center flex">
			<p class="text-2xl font-medium">
				{`${trade.tradeType === TradeResponseTradeType.SELL ? '+' : '-'}${convertCentsToDollarAndCents(trade.numOfUnits * trade.pricePerUnit)}`}
			</p>
		</div>
	</div>
</div>
