<script lang="ts">
	import Fab from '$lib/components/Fab.svelte';
	import ProgressIndicator from '$lib/components/ProgressIndicator.svelte';
	import MdGroupWork from 'svelte-icons/md/MdGroupWork.svelte';

  
</script>

{#await data.streamed.data}
	<ProgressIndicator />
{:then}
	{#if [].length <= 0}
		<div class="flex flex-col justify-center items-center p-8 h-screen">
			<span class="icon-xl mb-6"><MdGroupWork /></span>
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

			{#each [] as a}
				<div />
			{/each}
		</div>
	{/if}
	<Fab href="/trades/trade" />
{/await}
