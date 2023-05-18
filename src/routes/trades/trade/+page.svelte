<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import DropdownLabelTop from '$lib/components/DropdownLabelTop.svelte';
	import InputGroupLabelTop from '$lib/components/InputGroupLabelTop.svelte';
	import { NotificationType, addToast, addToastFromApiErrors } from '$lib/stores/stores.js';
	import { ApiResponseStatus, TradeStockRequestTradeType } from '$lib/types/api/data-contracts.js';
	import type { Account, Stock, Trade } from '$lib/types/model.js';
	import { MILLI_INPUT_STEPS } from '$lib/utils/constants.js';
	import {
	  convertMillicentsToDollarAndCents,
	  getMillicentsFromDollarAndCents
	} from '$lib/utils/utils.js';
	import moment from 'moment';
	import FaHandHoldingUsd from 'svelte-icons/fa/FaHandHoldingUsd.svelte';
	import { FormFields } from './form.js';

	export let data;
	export let form;
	let stocks: Stock[] = [];
	let trades: Trade[] = [];
	let accounts: Account[] = [];
	let unit: string = '0';
	let price: string = '0';
	let fee: string = '0';
	let withFee: string = '0';
	let withoutFee: string = '0';
	let feeAsPct: string = '0';

	data.streamed.data.then((response) => {
		if (response.status === ApiResponseStatus.SUCCESS) {
			stocks = response.data?.stocks ?? [];
			trades = response.data?.trades ?? [];
			accounts = response.data?.accounts ?? [];
		} else {
			addToastFromApiErrors(response.errors);
		}
	});

	$: {
		if (form?.errorMsg !== undefined) {
			addToast(form?.errorMsg, NotificationType.ERROR);
		}

		if (form?.status === ApiResponseStatus.SUCCESS) {
			addToast('Trade added successfully', NotificationType.SUCCESS);

			if (browser) {
				goto('/trades');
			}
		} else {
			addToastFromApiErrors(form?.errors);
		}
	}

	function handleUnit(event) {
		unit = event.target.value;
	}

	function handlePrice(event) {
		price = event.target.value;
	}

	function handleFee(event) {
		fee = event.target.value;
	}

	$: {
		if (unit === '') {
			unit = '0';
		}

		if (price === '') {
			price = '0';
		}

		if (fee === '') {
			fee = '0';
		}

		console.log(unit, price, fee);
		const totalAmt = getMillicentsFromDollarAndCents(price) * Number.parseInt(unit);
		const feeAmt = getMillicentsFromDollarAndCents(fee);
		withFee = convertMillicentsToDollarAndCents(totalAmt + feeAmt);
		withoutFee = convertMillicentsToDollarAndCents(totalAmt);
    if (totalAmt !== 0) {
      const feeOverTotal = feeAmt / (totalAmt + feeAmt);
      feeAsPct = (feeOverTotal * 100).toFixed(2);
    }
	}
</script>

<div class="p-8">
	<div class="flex flex-col">
		<div class="flex flex-row align-top">
			<span class="icon-lg mr-4"><FaHandHoldingUsd /></span>
			<div class="flex flex-col">
				<h1 class="text-4xl font-bold mb-2">Add Trade</h1>
				<p class="text-lg">Add a trade for a particular stock</p>
			</div>
		</div>
		<div class="divider" />

		<form method="POST" action={`?/trade`}>
			<div class="grid grid-cols-2 lg:grid-cols-3">
				<DropdownLabelTop
					required
					label="Trade Type"
					selectName={FormFields.TRADE_TYPE}
					options={Object.values(TradeStockRequestTradeType)}
				/>
				<DropdownLabelTop
					required
					label="Stock"
					selectName={FormFields.NAME}
					options={stocks.map((stock) => `${stock.name} (${stock.currency.trim()})`)}
					values={stocks.map((stock) => stock.name)}
				/>
				<DropdownLabelTop
					required
					label="Account"
					selectName={FormFields.ACCOUNT_ID}
					options={accounts.map((account) => `${account.accountName} (${account.currency.trim()})`)}
					values={accounts.map((account) => account.id.toString())}
				/>
				<InputGroupLabelTop
					required
					label="Trade Date"
					type="datetime-local"
					value={moment().format('YYYY-MM-DDTHH:MM')}
					step="60"
					inputName={FormFields.TIMESTAMP}
				/>
			</div>
			<div class="grid grid-cols-3 gap-10">
				<InputGroupLabelTop
					required
					label="Units Traded"
					subLabel="Units"
					step="1"
					inputName={FormFields.UNITS}
					type="number"
					placeholder="1"
					on:input={handleUnit}
				/>
				<InputGroupLabelTop
					required
					label="Price Per Unit"
					subLabel="Price"
					step={MILLI_INPUT_STEPS}
					type="number"
					inputName={FormFields.PRICE_PER_UNIT_IN_MILLI}
					placeholder="0.00000"
					on:input={handlePrice}
				/>
				<InputGroupLabelTop
					label="Fee"
					subLabel="Fee"
					step={MILLI_INPUT_STEPS}
					type="number"
					inputName={FormFields.FEE_IN_MILLI}
					placeholder="0.00000"
					on:input={handleFee}
				/>
			</div>
			<div class="flex flex-col items-center gap-2">
				<h5 class="text-2xl font-bold text-left">Amount traded</h5>
				<p class="text-xl">{'With Fee: $' + withFee}</p>
				<p class="text-xl">{'Without Fee: $' + withoutFee}</p>
				<p class="text-xl">{'Fee as Percentage: ' + feeAsPct + '%'}</p>
			</div>
			<div class="divider" />
			<div class="grid grid-cols-2">
				<a class="btn btn-outline mx-4" href="/trades">Cancel</a>
				<button class="btn btn-primary mx-4" type="submit">Add Trade</button>
			</div>
		</form>
	</div>
</div>
