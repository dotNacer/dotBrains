<script lang="ts">
	import { NodeResizer, type NodeProps, Handle, Position } from '@xyflow/svelte'
	import { onMount } from 'svelte'
	import { fly } from 'svelte/transition'
	let { data, selected, width, height } = $props() as NodeProps
	import { blurAndFade } from '$lib/utils'
	let mounted = $state(false)

	onMount(() => {
		mounted = true
	})
</script>

{#if mounted}
	<NodeResizer minWidth={width} minHeight={height} isVisible={selected} />
	<div
		in:blurAndFade={{ y: -10, duration: 75 }}
		out:fly={{ y: 100, duration: 150 }}
		class="flex h-full w-full border bg-background p-2"
	>
		{data.title}
	</div>
	<Handle type="target" position={Position.Left} />
	<Handle type="source" position={Position.Right} />
{/if}
