<script lang="ts">
	import "../app.css"
	import favicon from "$lib/assets/favicon.svg"
	import Navbar from "$lib/islands/Navbar.svelte"

	let { children } = $props()

</script>

<svelte:head>
	<title>Home | Piminov</title>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="w-screen h-screen dotted-bg relative overflow-hidden">
	<Navbar />
	{@render children?.()}
</div>
