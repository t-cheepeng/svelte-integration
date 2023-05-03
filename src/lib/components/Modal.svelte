<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let id: string;
	export let modalTitle: string;
	export let modalContent: string;
	export let primaryActionText: string;
	export let secondaryActionText: string | undefined = undefined;
	export let isOpen: boolean;

	const dispatch = createEventDispatcher();

	function confirmPrimary() {
		dispatch('primary');
	}

	function confirmSecondary() {
		dispatch('secondary');
	}
</script>

<input type="checkbox" {id} class="modal-toggle" />
<div class="modal modal-bottom sm:modal-middle" class:modal-open={isOpen}>
	<div class="modal-box">
		<h3 class="font-bold text-lg">{modalTitle}</h3>
		<p class="py-4">{modalContent}</p>
		<div class="modal-action">
			{#if secondaryActionText}
				<button class="btn btn-outline" on:click={confirmSecondary}>{secondaryActionText}</button>
			{/if}
			<button class="btn btn-primary" on:click={confirmPrimary}>{primaryActionText}</button>
		</div>
	</div>
</div>
