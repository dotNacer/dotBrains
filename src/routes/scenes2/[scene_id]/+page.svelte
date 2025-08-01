<script lang="ts">
	import { onMount } from 'svelte'
	import type { PageData } from './$types'

	let { data } = $props<{ data: PageData }>()

	onMount(async () => {
		console.log(data.scene)
	})
</script>

<p>Scène {data.scene.id}</p>
<p>{data.scene.name}</p>
<p>{data.scene.description}</p>
<p>Nombre de nodes {data.scene.nodes.length}</p>
<p>Nombre d'edges {data.scene.edges.length}</p>

{#each data.scene.nodes as node}
	<p>{node.id}</p>
{/each}

{#each data.scene.edges as edge}
	<p>{edge.id}</p>
{/each}
