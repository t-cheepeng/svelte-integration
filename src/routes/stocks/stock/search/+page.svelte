<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import Divider from '$lib/components/Divider.svelte';
	import SearchBox from '$lib/components/SearchBox.svelte';
	import {
	  NotificationType,
	  addStockSearchResult,
	  addToast,
	  addToastFromApiErrors
	} from '$lib/stores/stores';
	import { ApiResponseStatus, ExternalSearchResponseApiUsed } from '$lib/types/api/data-contracts';
	import type { SearchResult } from '$lib/types/model';
	import FaDollarSign from 'svelte-icons/fa/FaDollarSign.svelte';
	import FaSearchMinus from 'svelte-icons/fa/FaSearchMinus.svelte';
	import { FormFields } from '../../form';
	import SearchResultCard from './SearchResultCard.svelte';

	export let form;
	let isSearchEmpty: boolean = true;
	let searchResults: SearchResult[] = [];
	let selectedSearchResults: SearchResult[] = [];

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

	function selectResult(selectionEvent: CustomEvent<SearchResult>) {
		const selectedSearch = selectionEvent.detail;

		const possibleIdx = selectedSearchResults.findIndex(
			(selectedResult) =>
				selectedResult.stockName === selectedSearch.stockName &&
				selectedResult.apiUsed === selectedSearch.apiUsed
		);

		if (possibleIdx >= 0) {
			selectedSearchResults = [
				...selectedSearchResults.slice(0, possibleIdx),
				...selectedSearchResults.slice(possibleIdx + 1)
			];
			console.log(selectedSearchResults);
			return;
		}

		const sameApiIdx = selectedSearchResults.findIndex(
			(selectedResult) => selectedResult.apiUsed === selectedSearch.apiUsed
		);
		if (sameApiIdx < 0) {
			selectedSearchResults = [...selectedSearchResults, selectedSearch];
			console.log(selectedSearchResults);
			return;
		}

		selectedSearchResults = [...selectedSearchResults];
		selectedSearchResults[sameApiIdx] = selectedSearch;
	}

	function handleTrack() {
		addStockSearchResult(selectedSearchResults);
		if (browser) {
			goto('/stocks/stock/create');
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
					Search for a stock to track. Use the search filter below to search for a stock that is
					trackable
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
			<div class="mt-4">
				<p class="text-lg font-bold">
					Select the stocks to add for tracking before scrolling to the bottom and clicking 'Track'
				</p>
			</div>
			{#each Object.values(ExternalSearchResponseApiUsed) as apiType}
				<div class="flex flex-col items-start justify-start mt-4">
					<h3 class="text-2xl font-bold">API: {apiType.replaceAll('_', ' ')}</h3>
          <Divider additionalClass="mt-0"/>
					<div class="flex flex-col gap-4 items-center self-center lg:grid lg:grid-cols-2 mb-4">
						{#each searchResults.filter((searchResult) => searchResult.apiUsed === apiType) as searchResult}
							<SearchResultCard
								{searchResult}
								on:selected={selectResult}
								isSelected={selectedSearchResults.find(
									(selectedResult) =>
										selectedResult.stockName === searchResult.stockName &&
										selectedResult.apiUsed === searchResult.apiUsed
								) !== undefined}
							/>
						{/each}
					</div>
				</div>
			{/each}

			<div class="flex items-center justify-center">
				<button on:click={handleTrack} class="btn btn-primary w-20">Track</button>
			</div>
		{/if}
	</div>
</div>
