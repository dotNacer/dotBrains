<script lang="ts">
    import { Handle, Position, type NodeProps } from '@xyflow/svelte'
    import { onMount } from 'svelte'
    import type { Scene } from '$lib/types/Scene'
    import { Badge } from '$lib/components/ui/badge'
    // Les infos sont déclarées ici, imaginons qu'on ai besoin d'un id ou autre
    let { data, id, positionAbsoluteX, positionAbsoluteY } =
        $props() as NodeProps

    let scene = data.scene as Scene
</script>

<div
    class="node relative border border-border bg-card px-4 py-2 w-80 space-y-2"
>
    <!-- Ajout de l'ID du nœud -->
    {#if scene}
        <h1 class="text-lg font-bold">{scene.title ? scene.title : 'Scene'}</h1>
        <p class="text-sm">{scene.description ? scene.description : ''}</p>
        <div class="flex flex-wrap gap-2">
            {#each scene.characters as character}
                <a href={`/characters/${character.character.id}`}>
                    <Badge variant="outline">{character.character.name}</Badge>
                </a>
            {/each}
        </div>
    {/if}
    {#if !scene}
        <p>Scene pas existante</p>
    {/if}

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
