<script lang="ts">
	import TextBadge from '$lib/components/TextBadge.svelte';
	import type { Stock } from '$lib/types/model';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	export let stock: Stock;
</script>

<div
	class="card w-full bg-neutral shadow-xl"
	on:click={() => dispatch('selected', stock)}
	on:keypress={() => dispatch('keypress', stock)}
>
	<div class="card-body text-neutral-content grid grid-cols-4 items-start">
		<div class="col-span-3">
			<h1 class="text-2xl font-bold">{stock.displayTickerSymbol}</h1>
			<p class="text-lg">{stock.name}</p>
		</div>
		<div class="col-span-1 flex pt-2 flex-col gap-2 self-auto place-items-end">
			<TextBadge text={stock.currency} />
			<TextBadge text={stock.assetClass} badgeType="badge-accent" />
		</div>
	</div>
</div>
