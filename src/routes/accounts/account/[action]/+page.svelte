<script lang="ts">
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import DropdownLabelTop from '$lib/components/DropdownLabelTop.svelte';
  import InputGroupLabelTop from '$lib/components/InputGroupLabelTop.svelte';
  import TextAreaGroupLabelTop from '$lib/components/TextAreaGroupLabelTop.svelte';
  import { NotificationType, accountToEdit, addToast, removeEditAccount } from '$lib/stores/stores.js';
  import { ApiResponseStatus } from '$lib/types/api/data-contracts.js';
  import { CURRENCIES } from '$lib/utils/constants';
  import MdAccountBalance from 'svelte-icons/md/MdAccountBalance.svelte';

  export let form;
  export let data;

  $: mode = data.action;
  $: account = $accountToEdit;

  $: {
    if (form?.errorMsg !== undefined) {
      addToast(form?.errorMsg, NotificationType.ERROR);
    }

    if (form?.status === ApiResponseStatus.FAIL) {
      form?.errors?.map(error => addToast(error.message, NotificationType.ERROR))
    }

    if (form?.status === ApiResponseStatus.SUCCESS) {
      addToast("Account created successfully", NotificationType.SUCCESS);
      if (browser) {
        goto("/accounts")
      }
    }
  }
</script>

<div class="p-8">
	<div class="flex flex-col">
		<div class="flex flex-row align-top">
			<span class="icon-lg mr-4"><MdAccountBalance /></span>
			<div class="flex flex-col">
				<h1 class="text-4xl font-bold mb-2">{mode === "create" ? "Add" : "Edit"} Account</h1>
				<p class="text-lg">Keep track of your transactions in this account</p>
			</div>
		</div>
		<div class="divider" />
		<form method="POST">
			<InputGroupLabelTop
				label="Account Name"
				subLabel="Name"
				placeholder="XYZ Broker"
				inputName="accountName"
				required
        maxlength={255}
        value={mode === "create" ? "" : account?.accountName ?? ""}
			/>
			<div class="grid grid-cols-2">
				<DropdownLabelTop
					label="Denomination"
					options={CURRENCIES}
					selectName="denomination"
					required
          value={mode === "create" ? "" : account?.currency ?? ""}
          disabled={mode === "edit"}
				/>
				<DropdownLabelTop
					label="Account Type"
					options={['INVESTMENT', 'BUDGET']}
					selectName="accountType"
					required
          value={mode === "create" ? "" : ""}
          disabled={mode === "edit"}
				/>
			</div>
			<div class="grid grid-cols-2">
				<span class="mr-14">
					<InputGroupLabelTop
						label="Starting Balance"
						subLabel="Balance"
						placeholder="10000"
						inputName="balance"
            type="number"
            value={mode === "create" ? '0' : account?.currentValue.toString() ?? '0'}
            disabled={mode === "edit"}
					/>
				</span>
				<DropdownLabelTop
					label="Group Under"
					options={['No group', 'Tiger', 'Moomoo']}
					selectName="group"
          value={mode === "create" ? "" : account?.groups[0] ?? "No group"}
          disabled={mode === "edit"}
				/>
			</div>
			<TextAreaGroupLabelTop
				label="Description"
				placeholder="Account description"
				textareaName="description"
        maxlength={65535}
        value={mode === "create" ? "" : account?.accountName ?? ""}
			/>
			<div class="divider" />
			<div class="grid grid-cols-2">
				<a class="btn btn-outline mx-4 mr-4" href="/accounts" on:click={removeEditAccount}>Cancel</a>
				<button class="btn btn-primary mx-4 mr-4" type="submit">{mode === "create" ? "Add" : "Edit"} Account</button>
			</div>
		</form>
	</div>
</div>
