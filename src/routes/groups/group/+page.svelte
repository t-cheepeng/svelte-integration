<script>
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import DropdownLabelTop from '$lib/components/DropdownLabelTop.svelte';
	import InputGroupLabelTop from '$lib/components/InputGroupLabelTop.svelte';
	import { NotificationType, addToast, addToastFromApiErrors } from '$lib/stores/stores';
	import { ApiResponseStatus } from '$lib/types/api/data-contracts';
	import { CURRENCIES } from '$lib/utils/constants';
	import FaDollarSign from 'svelte-icons/fa/FaDollarSign.svelte';
	import { FormFields } from './form';

	export let form;

	$: {
		if (form?.errorMsg !== undefined) {
			addToast(form.errorMsg, NotificationType.ERROR);
			window.location.href = '/groups';
		}

		if (form?.status === ApiResponseStatus.SUCCESS) {
			addToast(`Group created successfully`, NotificationType.SUCCESS);
			if (browser) {
				goto('/groups');
			}
		} else if (form?.status === ApiResponseStatus.FAIL) {
			addToastFromApiErrors(form?.errors);
			window.location.href = '/groups';
		}
	}
</script>

<div class="p-8">
	<div class="flex flex-col">
		<div class="flex flex-row align-top">
			<span class="icon-lg mr-4"><FaDollarSign /></span>
			<div class="flex flex-col">
				<h1 class="text-4xl font-bold mb-2">Add Group</h1>
				<p class="text-lg">Add a group that accounts can be grouped under</p>
			</div>
		</div>
		<div class="divider" />

		<form method="POST" action={`?/create`}>
			<InputGroupLabelTop
				required
				label="Group Name"
				subLabel="Name"
				placeholder="SG Investments"
				inputName={FormFields.name}
        value=""
			/>
			<DropdownLabelTop
				required
				label="Currency"
				options={CURRENCIES}
				selectName={FormFields.currency}
        value=""
			/>
			<div class="divider" />
			<div class="grid grid-cols-2">
				<a class="btn btn-outline mx-4" href="/groups">Cancel</a>
				<button class="btn btn-primary mx-4" type="submit">Add group</button>
			</div>
		</form>
	</div>
</div>
