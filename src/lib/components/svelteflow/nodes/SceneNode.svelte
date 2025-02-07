<script lang="ts">
    import { Handle, Position, type NodeProps } from '@xyflow/svelte'
    import type { Scene } from '$lib/types/Scene'
    import { Badge } from '$lib/components/ui/badge'
    import SceneNodeInfos from '../SceneNodeInfos.svelte'
    SceneNodeInfos
    // Les infos sont déclarées ici, imaginons qu'on ai besoin d'un id ou autre
    let { data, id, positionAbsoluteX, positionAbsoluteY } =
        $props() as NodeProps

    let scene = data.scene as Scene
</script>

<div class="node relative border border-border bg-card flex flex-row group">
    <!-- Ajout de l'ID du nœud -->
    {#if scene}
        <div class="flex flex-col w-96">
            <div class="flex flex-row w-full justify-between">
                <h1 class="text-lg font-bold px-4 py-2">
                    {scene.title ? scene.title : 'Scene'}
                </h1>

                <div>
                    <SceneNodeInfos {scene} />
                </div>
            </div>
            <div class="px-4 py-2">
                <p class="text-sm">
                    {scene.description ? scene.description : ''}
                </p>
                <div class="flex flex-wrap gap-2">
                    {#each scene.characters as character}
                        <a href={`/characters/${character.character.id}`}>
                            <Badge variant="outline"
                                >{character.character.name}</Badge
                            >
                        </a>
                    {/each}
                </div>
            </div>
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
