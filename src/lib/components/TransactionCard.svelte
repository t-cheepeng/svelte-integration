<script lang="ts">
	import FaRegQuestionCircle from 'svelte-icons/fa/FaRegQuestionCircle.svelte';
	import MdAddCircleOutline from 'svelte-icons/md/MdAddCircleOutline.svelte';
	import MdAttachMoney from 'svelte-icons/md/MdAttachMoney.svelte';
	import MdRemoveCircleOutline from 'svelte-icons/md/MdRemoveCircleOutline.svelte';

	export let type: 'BUY' | 'SELL' | 'DIVIDEND';
</script>

<div class="card w-full bg-neutral mb-6">
	<div class="card-body text-neutral-content grid grid-cols-12 gap-2">
		<span class="icon-md col-span-1 flex items-center">
			{#if type === 'BUY'}
				<span class="text-success">
					<MdAddCircleOutline />
				</span>
			{:else if type === 'SELL'}
				<span class="text-error">
					<MdRemoveCircleOutline />
				</span>
			{:else if type === 'DIVIDEND'}
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
			<p class="text-xl font-extrabold">A35 @ 0.014</p>
			<p>Avg Open Price: 0.0145</p>
		</div>
		<div class="col-span-2 items-center flex">
			<p class="text-2xl font-medium">+110.02</p>
		</div>
	</div>
</div>
