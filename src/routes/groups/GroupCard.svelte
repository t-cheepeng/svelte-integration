<script lang="ts">
	import TextBadge from '$lib/components/TextBadge.svelte';
	import type { GroupAccount } from '$lib/types/model';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	export let group: GroupAccount;
</script>

<div
	class="card w-full bg-neutral shadow-xl"
	on:click={() => dispatch('selected', group)}
	on:keypress={() => dispatch('keypress', group)}
>
	<div class="card-body text-neutral-content grid grid-cols-4 items-start">
		<div class="col-span-3">
			<h1 class="text-2xl font-bold">{group.name}</h1>
      {#if group.accountsInGroup.length > 0}
        <h3 class="text-lg mt-4 font-semibold text-info">Accounts Under Group</h3>
        {#each group.accountsInGroup as accounts}
          <p>{accounts.accountName}</p>
        {/each}
      {/if}
		</div>
		<div class="col-span-1 flex pt-2 flex-col gap-2 self-auto place-items-end">
			<TextBadge text={group.currency} />
		</div>
	</div>
</div>
