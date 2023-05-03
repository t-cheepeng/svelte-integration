<script lang="ts">
	import { NotificationType, notifications } from '$lib/stores/stores';
	import { fly } from 'svelte/transition';
</script>

{#if $notifications}
	<div class="toast toast-top toast-end z-50">
		{#each $notifications as notification}
			<div out:fly={{ x: 200, duration: 500 }}>
				<div
					class="alert"
					class:alert-success={notification.type === NotificationType.SUCCESS}
					class:alert-warning={notification.type === NotificationType.WARNING}
					class:alert-error={notification.type === NotificationType.ERROR}
				>
					<div class="flex flex-col">
						<span>{notification.message}</span>
					</div>
				</div>
			</div>
		{/each}
	</div>
{/if}
