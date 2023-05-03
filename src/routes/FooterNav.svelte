<script lang="ts">
	import { page } from '$app/stores';
	import FaCoins from 'svelte-icons/fa/FaCoins.svelte';
	import IoIosCash from 'svelte-icons/io/IoIosCash.svelte';
	import MdAccountBalance from 'svelte-icons/md/MdAccountBalance.svelte';
	import MdDashboard from 'svelte-icons/md/MdDashboard.svelte';

	let curPath: string = '/';
	$: curPath = $page.url.pathname;
</script>

<nav class="btm-nav">
	<a class="bg-neutral" href="/dashboard" class:active={curPath.startsWith('/dashboard')}>
		<span class="icon-sm" ><MdDashboard /></span>
		<span class="btm-nav-label">Dashboard</span>
	</a>
	<a class="bg-neutral" href="/accounts" class:active={curPath.startsWith('/accounts')}>
		<span class="icon-sm"><MdAccountBalance /></span>
		<span class="btm-nav-label">Accounts</span>
	</a>
	<a class="bg-neutral" href="stocks" class:active={curPath.startsWith('/stocks')}>
		<span class="icon-sm"><IoIosCash /></span>
		<span class="btm-nav-label">Stocks</span>
	</a>
	<a class="bg-neutral" href="trades" class:active={curPath.startsWith('/trades')}>
		<span class="icon-sm"><FaCoins /></span>
		<span class="btm-nav-label">Trades</span>
	</a>
</nav>

<style>
	.active {
		color: hsl(var(--s));
	}
</style>
