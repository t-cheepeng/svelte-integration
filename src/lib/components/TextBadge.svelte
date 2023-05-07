<script lang="ts">
  export let text: string;
  export let badgeType: string = "badge-secondary";
</script>


<span class={`badge ${badgeType}`}>{text}</span>