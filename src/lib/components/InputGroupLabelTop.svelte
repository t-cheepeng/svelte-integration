<script lang="ts">
	export let label: string;
	export let subLabel: string | undefined = undefined;
	export let placeholder: string = "";
	export let inputName: string | undefined = undefined;
	export let required = false;
	export let maxlength = 999999;
	export let type = 'text';
	export let positiveOnly = true;
	export let value: string | undefined = undefined;
	export let disabled = false;
	export let readonly = false;
  export let step = "0.01";
</script>

<div class="form-control mb-8">
	<label class="label" for={label}>
		<span class="label-text text-xl font-bold">{label}{required ? '*' : ''}</span>
	</label>
	<label class:input-group={subLabel !== undefined}>
    {#if subLabel !== undefined}
      <span class="bg-primary text-primary-content">{subLabel}</span>  
    {/if}
    <input
      id={label}
      {type}
      {placeholder}
      class="input input-bordered input-md w-full"
      name={inputName}
      {required}
      {maxlength}
      min={positiveOnly ? 0 : ''}
      {value}
      {disabled}
      {readonly}
      {step}
      on:input
    />
	</label>
</div>
