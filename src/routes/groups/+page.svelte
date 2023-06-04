<script lang="ts">
	import Fab from '$lib/components/Fab.svelte';
	import ProgressIndicator from '$lib/components/ProgressIndicator.svelte';
	import { NotificationType, addToast, addToastFromApiErrors } from '$lib/stores/stores.js';
	import { ApiResponseStatus } from '$lib/types/api/data-contracts.js';
	import type { GroupAccount } from '$lib/types/model.js';
	import MdGroupWork from 'svelte-icons/md/MdGroupWork.svelte';
	import GroupCard from './GroupCard.svelte';

	export let data;
	let groups: GroupAccount[];

	data.streamed.data.then((response) => {
		if (response.status === ApiResponseStatus.SUCCESS && response.data !== undefined) {
			groups = response.data;
		} else if (response.status === ApiResponseStatus.FAIL && response.errors !== undefined) {
			addToastFromApiErrors(response.errors);
		} else {
			addToast('Internal server error', NotificationType.ERROR);
		}
	});
</script>

{#await data.streamed.data}
	<ProgressIndicator />
{:then}
	{#if groups.length <= 0}
		<div class="flex flex-col justify-center items-center p-8 h-screen">
			<span class="icon-xl mb-6"><MdGroupWork /></span>
			<h1 class="text-6xl font-bold mb-4">No groups?</h1>
			<p class="text-xl">Add one with the "+" button now</p>
		</div>
	{:else}
		<div class="p-8">
			<div class="mb-8">
				<h1 class="font-extrabold text-4xl mb-2">Groups</h1>
				<p class="text-lg">View all groups here. Select one to view each group in more detail</p>
			</div>

			<div class="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl: grid-cols-4 gap-4">
				{#each groups as group}			
          <GroupCard {group} />
				{/each}
			</div>
		</div>
	{/if}
	<Fab href="/groups/group" />
{/await}
