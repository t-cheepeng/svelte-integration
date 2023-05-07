<script lang="ts">
	import { NotificationType, addToast, addToastFromApiErrors } from '$lib/stores/stores.js';
	import { ApiResponseStatus } from '$lib/types/api/data-contracts.js';

	export let data;
	let trades;

	$: data.streamed.data.then((response) => {
		if (response.status === ApiResponseStatus.SUCCESS && response.data !== undefined) {
			trades = response.data;
		} else if (response.status === ApiResponseStatus.FAIL) {
			addToastFromApiErrors(response.errors);
		} else {
			addToast('Internal server error', NotificationType.ERROR);
		}
	});
  $: console.log(trades);
</script>

<h1 class="font-extrabold text-4xl mb-8">Trades</h1>
