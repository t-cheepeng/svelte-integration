<script lang="ts">
	import TextBadge from '$lib/components/TextBadge.svelte';
	import type { SearchResult } from '$lib/types/model';
	import { createEventDispatcher } from 'svelte';

	export let searchResult: SearchResult;
  export let isSelected: boolean = false;
  $: {
    console.log(searchResult, isSelected);
  }

	const dispatch = createEventDispatcher();
</script>

<div
	class="card w-full bg-neutral shadow-xl"
  class:bg-success={isSelected}
	on:click={() => dispatch('selected', searchResult)}
	on:keypress={() => dispatch('selectedByKeyPress', searchResult)}
>
	<div class="card-body text-neutral-content grid grid-cols-4" class:text-success-content={isSelected}>
		<div class="col-span-3 gap-1 flex flex-col">
			<h1 class="text-xl font-bold">
				{searchResult.stockName ? searchResult.stockName : 'No Stock Name'}
			</h1>
			<h3 class="text-lg">Ticker: {searchResult.ticker}</h3>
			<p>Exchange: {searchResult.exchange} in {searchResult.exchangeCountry}</p>
		</div>
		<div class="col-span-1 flex flex-col items-end pt-1 gap-2">
			<TextBadge text={searchResult.currency} />
			<TextBadge text={searchResult.stockClass} badgeType="badge-accent" />
		</div>
	</div>
</div>
