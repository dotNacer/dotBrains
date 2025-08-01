<script lang="ts">
	import { SvelteFlowProvider } from '@xyflow/svelte'
	import Flow from '$lib/components/svelteflow/Flow.svelte'
	import type { PageData } from './$types'

	let { data } = $props<{ data: PageData }>()

	const INITIAL_NODES = [
		{
			id: '-2',
			type: 'parent-group',
			position: { x: 0, y: 0 },
			width: 350,
			height: 210,
			data: {
				group_name: 'GroupName',
			},
		},
	]
</script>

<!-- You need the SvelteFlowProvider so you can useSvelteFlow  -->
<SvelteFlowProvider>
	<Flow
		characters={data.characters}
		scenes={data.scenes}
		db_nodes={data.nodes}
		db_edges={data.edges}
	/>
</SvelteFlowProvider>
