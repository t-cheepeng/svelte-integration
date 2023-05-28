<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import SearchBox from '$lib/components/SearchBox.svelte';
	import { NotificationType, addStockSearchResult, addToast, addToastFromApiErrors } from '$lib/stores/stores';
	import { ApiResponseStatus, ExternalSearchResponseApiUsed } from '$lib/types/api/data-contracts';
	import type { SearchResult } from '$lib/types/model';
	import FaDollarSign from 'svelte-icons/fa/FaDollarSign.svelte';
	import FaSearchMinus from 'svelte-icons/fa/FaSearchMinus.svelte';
	import { FormFields } from '../../form';
	import SearchResultCard from './SearchResultCard.svelte';

	export let form;
	let isSearchEmpty: boolean = true;
	let searchResults: SearchResult[] = [];

	$: {
		if (form?.errorMsg !== undefined) {
			addToast(form.errorMsg, NotificationType.ERROR);
		} else if (form?.status === ApiResponseStatus.SUCCESS && form?.data !== undefined) {
			searchResults =
				form.data.searchResponses?.map((response) => {
					return {
						stockName: response.stockName ?? '',
						currency: response.currencyGuess as string,
						exchange: response.exchange ?? '',
						ticker: response.ticker ?? '',
						stockClass: response.stockClass ?? '',
						exchangeCountry: response.exchangeCountry ?? '',
						searchScore: response.searchScore ?? 0,
						apiUsed: response.apiUsed ?? ExternalSearchResponseApiUsed.ALPACA_MARKET
					};
				}) ?? [];

			isSearchEmpty = searchResults.length <= 0;
		} else if (form?.status === ApiResponseStatus.FAIL && form?.errors !== undefined) {
			addToastFromApiErrors(form.errors);
		}
	}

  function selectResult(selectedResult: CustomEvent<SearchResult>) {
    addStockSearchResult(selectedResult.detail);
    if (browser) {
      goto("/stocks/stock/create")
    }
  }
</script>

<div class="p-8">
	<div class="flex flex-col">
		<div class="flex flex-row align-top">
			<span class="icon-lg mr-4"><FaDollarSign /></span>
			<div class="flex flex-col">
				<h1 class="text-4xl font-bold mb-2">Search for Stock</h1>
				<p class="text-lg">
					Search for a stock to track. Use the search filter below to search for a stock that is trackable
				</p>
			</div>
		</div>
		<div class="divider" />

		<form method="POST" action="?/search">
			<SearchBox searchInputName={FormFields.SEARCH} />
		</form>

		{#if isSearchEmpty}
			<div class="flex flex-col items-center self-center mt-10 gap-6">
				<span class="icon-lg"><FaSearchMinus /></span>
				<p class="text-xl font-bold ml-3">No results found</p>
			</div>
		{:else}
			<div class="flex flex-col gap-4 items-center self-center pt-8 lg:grid lg:grid-cols-2">
				{#each searchResults as searchResult}
					<SearchResultCard {searchResult} on:selected={selectResult}/>
				{/each}
			</div>
		{/if}
	</div>
</div>
