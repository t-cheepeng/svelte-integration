<script lang="ts">
	export let label: string;
	export let placeholder: string;
	export let textareaName: string;
	export let required = false;
  export let maxlength = 999999;
  export let value = "";
  export let disabled = false;
</script>

<div class="form-control mb-8">
	<label class="label" for={label}>
		<span class="label-text text-xl font-bold">{label}{required ? '*' : ''}</span>
	</label>
	<textarea class="textarea textarea-bordered h-full" {placeholder} name={textareaName} {required} {maxlength} {value} {disabled}/>
</div>
