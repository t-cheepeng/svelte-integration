<script lang="ts">
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Divider from '$lib/components/Divider.svelte';
	import DropdownLabelTop from '$lib/components/DropdownLabelTop.svelte';
	import InputGroupLabelTop from '$lib/components/InputGroupLabelTop.svelte';
	import TextAreaGroupLabelTop from '$lib/components/TextAreaGroupLabelTop.svelte';
	import {
	  NotificationType,
	  accountToEdit,
	  addToast,
	  allGroups,
	  removeEditAccount
	} from '$lib/stores/stores.js';
	import { ApiResponseStatus } from '$lib/types/api/data-contracts.js';
	import type { GroupAccount } from '$lib/types/model';
	import { CURRENCIES } from '$lib/utils/constants';
	import { convertToReadableMonetary } from '$lib/utils/utils';
	import MdAccountBalance from 'svelte-icons/md/MdAccountBalance.svelte';
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	import GroupCard from '../../../groups/GroupCard.svelte';
	import { FormFields } from './form';

	export let form;
	export let data;
	const MODE_TO_READABLE: Record<string, string> = {
		edit: 'Edit',
		create: 'Add',
		group: 'Group',
		ungroup: 'Ungroup'
	};
	const MODE_TO_DESCRIPTION: Record<string, string> = {
		edit: 'Keep track of your transactions in this account',
		create: 'Keep track of your transactions in this account',
		group: 'Group this account together with other accounts to aggregate transactions',
		ungroup: 'Ungroup this account to remove the aggregations from the group'
	};

	$: mode = data.action;
	$: account = $accountToEdit;
	$: groups = $allGroups ?? [];
	$: groupsUnderAccount = account === undefined ? [] : account.groups;
	let groupsToBeRemoved: GroupAccount[] = [];

	$: {
		if (form?.errorMsg !== undefined) {
			addToast(form?.errorMsg, NotificationType.ERROR);
		}

		if (mode === 'ungroup') {
			if (form?.length !== undefined) {
				let isError = false;
				form?.forEach((response) => {
					if (response.status === ApiResponseStatus.FAIL) {
						response.errors?.forEach((error) => addToast(error.message, NotificationType.ERROR));
						isError = true;
					}
				});
				if (!isError) {
					const actionText = MODE_TO_READABLE[mode].toLowerCase() + 'ed';
					addToast(`Account ${actionText} successfully`, NotificationType.SUCCESS);
					if (browser) {
						goto('/accounts');
					}
				}
			}
		}

		if (form?.status === ApiResponseStatus.FAIL) {
			form?.errors?.map((error) => addToast(error.message, NotificationType.ERROR));
		}

		if (form?.status === ApiResponseStatus.SUCCESS) {
			const actionText = MODE_TO_READABLE[mode].toLowerCase() + 'ed';
			addToast(`Account ${actionText} successfully`, NotificationType.SUCCESS);
			if (browser) {
				goto('/accounts');
			}
		}
	}

	function handleUngroup(event: CustomEvent<GroupAccount>) {
		const groupToUngroup = event.detail;
		const idxToUngroup = groupsUnderAccount.findIndex((group) => groupToUngroup.id === group.id);
		if (idxToUngroup < 0) {
			return;
		}

		groupsToBeRemoved = [...groupsToBeRemoved, groupsUnderAccount[idxToUngroup]];
		groupsUnderAccount = [
			...groupsUnderAccount.slice(0, idxToUngroup),
			...groupsUnderAccount.slice(idxToUngroup + 1)
		];
	}

	function handleUndoUngroup(event: CustomEvent<GroupAccount>) {
		const groupToUndo = event.detail;
		const idxToUndo = groupsToBeRemoved.findIndex((group) => groupToUndo.id === group.id);
		if (idxToUndo < 0) {
			return;
		}

		groupsUnderAccount = [...groupsUnderAccount, groupsToBeRemoved[idxToUndo]];
		groupsToBeRemoved = [
			...groupsToBeRemoved.slice(0, idxToUndo),
			...groupsToBeRemoved.slice(idxToUndo + 1)
		];
	}

	const [send, receive] = crossfade({
		duration: (d) => Math.sqrt(d * 200),

		fallback(node) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 500,
				easing: quintOut,
				css: (t) => `
        transform: ${transform} scale(${t});
      `
			};
		}
	});
</script>

<!-- TODO: Make description be actual description -->
<div class="p-8">
	<div class="flex flex-col">
		<div class="flex flex-row align-top">
			<span class="icon-lg mr-4"><MdAccountBalance /></span>
			<div class="flex flex-col">
				<h1 class="text-4xl font-bold mb-2">{MODE_TO_READABLE[mode]} Account</h1>
				<p class="text-lg">{MODE_TO_DESCRIPTION[mode]}</p>
			</div>
		</div>
		<Divider />
		<form method="POST" action={`?/${mode}`} use:enhance>
			<InputGroupLabelTop
				label="Account Name"
				subLabel="Name"
				placeholder="XYZ Broker"
				inputName={FormFields.ACCOUNT_NAME}
				required
				maxlength={255}
				value={mode === 'create' ? '' : account?.accountName ?? ''}
				readonly={['group', 'ungroup'].includes(mode)}
			/>
			{#if ['create', 'edit'].includes(mode)}
				<div class="grid grid-cols-2">
					<DropdownLabelTop
						label="Denomination"
						options={CURRENCIES}
						selectName={FormFields.DENOMINATION}
						required
						value={mode === 'create' ? '' : account?.currency.trim()}
						disabled={mode === 'edit'}
					/>
					<DropdownLabelTop
						label="Account Type"
						options={['INVESTMENT', 'BUDGET']}
						selectName={FormFields.ACCOUNT_TYPE}
						required
						value={mode === 'create' ? '' : account?.accountType}
						disabled={mode === 'edit'}
					/>
				</div>
				<div class="grid grid-cols-2">
					<span class="mr-14">
						<InputGroupLabelTop
							label="Starting Balance"
							subLabel="Balance"
							placeholder="10000"
							inputName={FormFields.BALANCE}
							type="number"
							value={mode === 'create'
								? '0'
								: convertToReadableMonetary(account?.currentValue.toString() ?? '0')}
							disabled={mode === 'edit'}
						/>
					</span>
					<DropdownLabelTop
						label="Group Under"
						options={['No group', 'Tiger', 'Moomoo']}
						selectName={FormFields.GROUP}
						value={mode === 'create' ? '' : 'No group'}
						disabled={mode === 'edit'}
					/>
				</div>
				<TextAreaGroupLabelTop
					label="Description"
					placeholder="Account description"
					textareaName={FormFields.DESCRIPTION}
					maxlength={65535}
					value={mode === 'create' ? '' : account?.accountName ?? ''}
				/>
			{:else if mode === 'group'}
				<h3 class="text-xl font-semibold mt-10">
					You can only group accounts with the same currency together
				</h3>
				<Divider additionalClass="mt-0" />
				<div class="grid grid-cols-2">
					<DropdownLabelTop
						label="Account Denomination"
						options={CURRENCIES}
						selectName={FormFields.DENOMINATION}
						required
						value={account?.currency.trim()}
						disabled={true}
					/>
					<DropdownLabelTop
						label="Group Under"
						selectName={FormFields.GROUP}
						options={groups
							.filter((group) => group.currency.trim() === account?.currency.trim())
							.map((group) => `${group.name} (${group.currency.trim()})`)}
						values={groups
							.filter((group) => group.currency.trim() === account?.currency.trim())
							.map((group) => group.id.toString())}
						required
					/>
				</div>
			{:else if mode === 'ungroup' && account !== undefined}
				<h3 class="text-2xl font-bold mb-4">Current Groups Under Account</h3>
				<div class="grid grid-cols-2 gap-4">
					{#each groupsUnderAccount as group (group.id)}
						<span animate:flip in:receive={{ key: group.id }} out:send={{ key: group.id }}>
							<GroupCard {group} on:selected={handleUngroup} />
						</span>
					{/each}
				</div>
				<Divider additionalClass="my-10" />
				<h3 class="text-2xl font-bold mb-4">Groups To Be Removed From</h3>
				<div class="grid grid-cols-2 gap-4">
					{#each groupsToBeRemoved as group (group.id)}
						<span animate:flip in:receive={{ key: group.id }} out:send={{ key: group.id }}>
							<GroupCard {group} on:selected={handleUndoUngroup} />
							<input hidden type="hidden" name={FormFields.GROUP} value={group.id} />
						</span>
					{/each}
				</div>
			{/if}

			<div class="divider" />
			<div class="grid grid-cols-2">
				<a class="btn btn-outline mx-4 mr-4" href="/accounts" on:click={removeEditAccount}>Cancel</a
				>
				<button class="btn btn-primary mx-4 mr-4" type="submit"
					>{MODE_TO_READABLE[mode]} Account</button
				>
			</div>
			{#if mode !== 'create'}
				<input hidden type="hidden" name={FormFields.ID} value={account?.id} />
			{/if}
		</form>
	</div>
</div>
