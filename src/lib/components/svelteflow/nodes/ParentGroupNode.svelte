<script lang="ts">
    import {
        Handle,
        Position,
        NodeResizer,
        type NodeProps,
    } from '@xyflow/svelte'

    let { id, data, selected, width, height } = $props() as NodeProps
</script>

<NodeResizer
    minWidth={100}
    minHeight={30}
    isVisible={selected}
    handleClass="!w-2 !h-2 !bg-background !border-2 !border-border"
    lineClass="!border !border-border"
/>
<div
    class="node relative border border-border bg-secondary flex flex-col w-full h-full justify-center items-center"
>
    {width}
    {height}
    <h1 class="text-lg font-bold px-4 py-2">
        {data.group_name}
    </h1>
    <Handle type="target" position={Position.Left} class="classic-handle" />
    <Handle type="source" position={Position.Right} class="classic-handle" />
</div>
