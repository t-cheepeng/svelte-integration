<script lang="ts">
	import FaSearch from 'svelte-icons/fa/FaSearch.svelte';
	export let searchInputName: string;
</script>

<div class="form-control">
	<div class="input-group">
		<input
			type="text"
			placeholder="Search…"
			class="input input-bordered w-full"
			name={searchInputName}
			required
		/>
		<button class="btn btn-square icon-md p-3">
			<FaSearch />
		</button>
	</div>
</div>
