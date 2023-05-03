<script>
  import Toast from '$lib/components/Toast.svelte';
  import '$lib/global.css';
  import FooterNav from './FooterNav.svelte';
</script>

<div class="mb-20">
  <Toast/>
  <slot />
</div>

<FooterNav/>