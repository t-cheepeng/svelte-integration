<script lang="ts">
	export let label: string;
	export let options: string[];
  export let selectName: string;
  export let required = false;
  export let disabled = false;
  export let value: string | undefined = undefined;
</script>

<div class="form-control mb-8">
	<label class="label" for={label}>
		<span class="label-text text-xl font-bold">{label}{required ? "*" : ""}</span>
	</label>
	<select class="select select-bordered w-96" id={label} name={selectName} {required} {disabled}>
    <option disabled selected={value === undefined}></option>
		{#each options as option}
			<option disabled={disabled && value !== option} selected={value === option} value={option}>{option}</option>
		{/each}
	</select>
</div>
