<script lang="ts">
    import { Handle, Position, type NodeProps } from '@xyflow/svelte'
    import { onMount } from 'svelte'
    import type { Scene } from '$lib/types/Scene'
    // Les infos sont déclarées ici, imaginons qu'on ai besoin d'un id ou autre
    let { data, id, positionAbsoluteX, positionAbsoluteY } =
        $props() as NodeProps

    let scene = data.scene as Scene
</script>

<div class="node relative border border-border bg-card px-4 py-2">
    <!-- Ajout de l'ID du nœud -->
    <div class="text-xs text-muted-foreground mb-2">ID: {id}</div>
    {#if scene}
        <p>{scene.title ? scene.title : 'Scene'}</p>
    {/if}
    {#if !scene}
        <p>Scene pas existante</p>
    {/if}
    <div>
        Position
        {Math.round(positionAbsoluteX)}
        {Math.round(positionAbsoluteY)}
    </div>
    <div class="flex">
        <div class="flex items-center justify-center rounded-full bg-muted">
            {data.emoji}
        </div>
        <div class="ml-2">
            <div class="text-lg font-bold">{data.name}</div>
            <div class="text-sm text-muted-foreground">{data.job}</div>
        </div>
    </div>

    <Handle
        id={`target-${id}`}
        type="target"
        position={Position.Left}
        class="!w-2 !h-2 !rounded-none"
    />
    <Handle
        id={`source-${id}`}
        type="source"
        position={Position.Right}
        class="!w-2 !h-2 !rounded-none"
    />
</div>

<style>
    .node {
        transition: all 0.2s ease-in-out;
    }

    :global(.selected .node) {
        border: 1px solid #bababa;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    }
</style>
