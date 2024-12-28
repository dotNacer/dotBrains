<script lang="ts">
    import { Handle, Position, type NodeProps } from '@xyflow/svelte'
    import { onMount } from 'svelte'

    // Les infos sont déclarées ici, imaginons qu'on ai besoin d'un id ou autre
    let { data, id, positionAbsoluteX, positionAbsoluteY } =
        $props() as NodeProps
</script>

<div
    class="relative border-[1px] border-slate-200 bg-white px-4 py-2 shadow-md"
>
    <!-- Ajout de l'ID du nœud -->
    <div class="text-xs text-gray-400 mb-2">ID: {id}</div>

    <div>
        Position
        {Math.round(positionAbsoluteX)}
        {Math.round(positionAbsoluteY)}
    </div>
    <div class="flex">
        <div class="flex items-center justify-center rounded-full bg-gray-100">
            {data.emoji}
        </div>
        <div class="ml-2">
            <div class="text-lg font-bold">{data.name}</div>
            <div class="text-gray-500">{data.job}</div>
        </div>
    </div>

    <Handle type="target" position={Position.Left} class="!w-2 !h-2 " />
    <Handle type="source" position={Position.Right} class="!w-2 !h-2  " />
</div>
