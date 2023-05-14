<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import Fab from '$lib/components/Fab.svelte';
	import ProgressIndicator from '$lib/components/ProgressIndicator.svelte';
	import { NotificationType, addStock, addToast, addToastFromApiErrors } from '$lib/stores/stores';
	import { ApiResponseStatus } from '$lib/types/api/data-contracts';
	import type { Stock } from '$lib/types/model';
	import { mapStockResponseToModel } from '$lib/utils/mapper';
	import FaSearchDollar from 'svelte-icons/fa/FaSearchDollar.svelte';
	import type { PageData } from './$types';
	import StockCard from './StockCard.svelte';

	export let data: PageData;
	let stocks: Stock[];
	data.streamed.data.then((response) => {
		if (response.status === ApiResponseStatus.SUCCESS && response.data !== undefined) {
			stocks =
				response.data.stocks
					?.filter(
						(stock) =>
							stock.assetClass !== undefined &&
							stock.currency !== undefined &&
							stock.displayTickerSymbol !== undefined &&
							stock.name !== undefined
					)
					.map(mapStockResponseToModel) ?? [];
		} else if (response.status === ApiResponseStatus.FAIL && response.errors !== undefined) {
			addToastFromApiErrors(response.errors);
		} else {
			addToast('Internal server error', NotificationType.ERROR);
		}
	});

  function handleSelected(event: CustomEvent<Stock>) {
    addStock(event.detail);
    if (browser) {
      goto("/stocks/stock/edit");
    }
  }
</script>

{#await data.streamed.data}
	<ProgressIndicator />
{:then}
	{#if stocks.length <= 0}
		<div class="flex flex-col justify-center items-center p-8 h-screen">
			<span class="icon-xl mb-6"><FaSearchDollar /></span>
			<h1 class="text-6xl font-bold mb-4">No Stocks?</h1>
			<p class="text-xl">Add one with the "+" button now</p>
		</div>
	{:else}
		<div class="p-8">
			<h1 class="font-extrabold text-4xl mb-8">Stocks</h1>

			<div class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
				{#each stocks as stock}
					<StockCard {stock} on:selected={handleSelected}/>
				{/each}
			</div>
		</div>
	{/if}
	<Fab href="/stocks/stock/search" />
{/await}
