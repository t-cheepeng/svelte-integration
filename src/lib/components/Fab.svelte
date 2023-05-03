<script lang="ts">
	import FaPlus from 'svelte-icons/fa/FaPlus.svelte';

	export let href: string;
</script>

<a
	class="fixed z-50 bottom-20 right-8 w-16 h-16 rounded-full flex justify-center items-center text-primary-content bg-primary"
	{href}><span class="icon-sm"><FaPlus /></span></a
>
