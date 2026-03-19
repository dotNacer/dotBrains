<script lang="ts">
	import '../app.css'
	import { Toaster } from '$lib/components/ui/sonner/index.js'
	let { children } = $props()
	import { page } from '$app/stores'
	import Navbar from '$lib/components/ui/Navbar.svelte'
</script>

<div class="bg-background text-foreground flex min-h-screen">
	<Navbar />

	<!-- Contenu principal -->
	<div class={`flex-1 p-4`}>
		<Toaster />
		{@render children()}
	</div>
</div>
