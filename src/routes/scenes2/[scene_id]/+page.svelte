<script lang="ts">
	import '@xyflow/svelte/dist/style.css'
	import type { PageData } from './$types'
	import { SvelteFlow } from '@xyflow/svelte'
	import { nodeTypes, defaultEdgeOptions } from '$lib'

	let { data } = $props<{ data: PageData }>()
</script>

<div class="h-screen w-full">
	<SvelteFlow
		class="!bg-card"
		nodes={data.nodes}
		edges={data.edges}
		{nodeTypes}
		{defaultEdgeOptions}
		fitView
		fitViewOptions={{ padding: 2 }}
	/>
</div>
