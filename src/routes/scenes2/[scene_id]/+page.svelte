<script lang="ts">
	import type { PageData } from './$types'
	import Flow from '$lib/components/svelteflow/Flow.svelte'
	import { SvelteFlowProvider } from '@xyflow/svelte'

	let { data } = $props<{ data: PageData }>()
</script>

<SvelteFlowProvider>
	<Flow scene={data.scene} baseNodes={data.nodes} baseEdges={data.edges} />
</SvelteFlowProvider>
