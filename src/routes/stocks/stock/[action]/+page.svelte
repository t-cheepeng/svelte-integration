<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import DropdownLabelTop from '$lib/components/DropdownLabelTop.svelte';
	import InputGroupLabelTop from '$lib/components/InputGroupLabelTop.svelte';
	import {
	  NotificationType,
	  addToast,
	  addToastFromApiErrors,
	  stock,
	  stockSearchResult
	} from '$lib/stores/stores';
	import { ApiResponseStatus } from '$lib/types/api/data-contracts';
	import { ASSET_CLASSES, CURRENCIES } from '$lib/utils/constants';
	import FaDollarSign from 'svelte-icons/fa/FaDollarSign.svelte';
	import { FormFields } from './form';

	export let data;
	export let form;

	$: mode = data.action;
	$: stockResult = $stockSearchResult;
	$: stockToEdit = $stock;
	$: {
		if (form?.errorMsg !== undefined) {
			addToast(form.errorMsg, NotificationType.ERROR);
			window.location.href = '/stocks';
		}

		if (form?.status === ApiResponseStatus.SUCCESS) {
			addToast(`Stock ${mode + "ed"} successfully`, NotificationType.SUCCESS);
			if (browser) {
				goto('/stocks');
			}
		} else if (form?.status === ApiResponseStatus.FAIL) {
			addToastFromApiErrors(form?.errors);
			window.location.href = '/stocks';
		}
	}
</script>

{#if (mode === 'create' && stockResult !== undefined) || (mode === 'edit' && stockToEdit !== undefined)}
	<div class="p-8">
		<div class="flex flex-col">
			<div class="flex flex-row align-top">
				<span class="icon-lg mr-4"><FaDollarSign /></span>
				<div class="flex flex-col">
					<h1 class="text-4xl font-bold mb-2">Add Stock</h1>
					<p class="text-lg">Confirm the details of the stock to add</p>
				</div>
			</div>
			<div class="divider" />

			<form method="POST" action={`?/${mode}`}>
				<InputGroupLabelTop
					required
					label="Stock Name"
					subLabel="Name"
					placeholder="QQQ"
					inputName={FormFields.stockName}
					value={mode === 'create' ? stockResult?.stockName.trim() : stockToEdit.name.trim()}
					readonly={mode === 'edit'}
				/>
				<div class="grid grid-cols-2">
					<DropdownLabelTop
						required
						label="Currency"
						options={CURRENCIES}
						selectName={FormFields.currency}
						value={mode === 'create'
							? stockResult?.currency.toUpperCase().trim()
							: stockToEdit.currency.toUpperCase().trim()}
					/>
					<DropdownLabelTop
						required
						label="Asset Class"
						selectName={FormFields.assetClass}
						value={mode === 'create'
							? stockResult?.stockClass.toUpperCase().trim()
							: stockToEdit.assetClass.toUpperCase().trim()}
						options={ASSET_CLASSES}
					/>
				</div>
				<InputGroupLabelTop
					required
					label="Ticker Symbol"
					subLabel="Symbol"
					placeholder="QQQ"
					inputName={FormFields.displayTickerSymbol}
					value={mode === 'create'
						? stockResult?.ticker.trim()
						: stockToEdit.displayTickerSymbol.trim()}
					readonly
				/>
				<div class="divider" />
				<div class="grid grid-cols-2">
					<a class="btn btn-outline mx-4" href="/stocks">Cancel</a>
					<button class="btn btn-primary mx-4" type="submit"
						>{mode === 'create' ? 'Add' : 'Edit'} Stock</button
					>
				</div>
			</form>
		</div>
	</div>
{/if}
