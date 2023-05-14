<script lang="ts">
	export let label: string;
	export let options: string[];
	export let selectName: string;
	export let required = false;
	export let disabled = false;
	export let value: string | undefined = undefined;
	export let values: string[] | undefined = undefined;
</script>

<div class="form-control mb-8">
	<label class="label" for={label}>
		<span class="label-text text-xl font-bold">{label}{required ? '*' : ''}</span>
	</label>
	<select
		class="select select-bordered w-96"
		id={label}
		name={selectName}
		{required}
		{disabled}
		on:selectionchange
	>
		<option disabled selected={value === undefined} />
		{#each options as option, idx}
			<option
				disabled={disabled && value !== (values === undefined ? option : values[idx])}
				selected={value === (values === undefined ? option : values[idx])}
				value={values === undefined ? option : values[idx]}>{option}</option
			>
		{/each}
	</select>
</div>
