<script lang="ts">
	import { NodeResizer, type NodeProps, Handle, Position } from '@xyflow/svelte'
	// Les infos sont déclarées ici, imaginons qu'on ai besoin d'un id ou autre
	let { data, selected, width, height } = $props() as NodeProps
</script>

<NodeResizer minWidth={width} minHeight={height} isVisible={selected} />
<div class="flex h-full w-full border bg-background p-2">{data.title}</div>
<Handle type="target" position={Position.Left} />
<Handle type="source" position={Position.Right} />
