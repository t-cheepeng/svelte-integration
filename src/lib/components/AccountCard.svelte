<script lang="ts">
	export let account: Account;
</script>

<div class="card w-full bg-neutral shadow-xl">
	<div class="card-body text-neutral-content grid grid-cols-2">
		<div class="grid justify-between">
			<div>
				<h1 class="card-title">{account.accountName}</h1>
				<h2 class="card-normal">Cost Basis: {account.costBasis}</h2>
			</div>
			<div class="pt-16">
				<h1 class="card-title">{account.currentValue} (1.04%)</h1>
			</div>
		</div>
		<div class="grid justify-items-end content-start">
			<span class="badge badge-secondary">{account.currency}</span>
			<h1 class="card-title pt-3">Groups</h1>
			{#each account.groups as group}
				<p>{group}</p>
			{/each}
		</div>
	</div>
</div>
