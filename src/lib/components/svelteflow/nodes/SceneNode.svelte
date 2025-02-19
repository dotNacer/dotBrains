<script lang="ts">
    import { Handle, Position, type NodeProps } from '@xyflow/svelte'
    import type { Scene } from '$lib/types/Scene'
    import { Badge } from '$lib/components/ui/badge'
    import SceneNodeInfos from '../SceneNodeInfos.svelte'
    import { NodeResizer } from '@xyflow/svelte'
    import { nodeService } from '$lib/services/nodeService'
    // Les infos sont déclarées ici, imaginons qu'on ai besoin d'un id ou autre
    let { data, id, selected, width, height } = $props() as NodeProps

    let scene = data.scene as Scene

    let resizeDebounceTimer: ReturnType<typeof setTimeout>

    const handleResizeEnd = (
        e: any,
        params: { width: number; height: number },
    ) => {
        clearTimeout(resizeDebounceTimer)
        resizeDebounceTimer = setTimeout(async () => {
            try {
                await nodeService.updateDimensions(
                    id,
                    params.width,
                    params.height,
                )
                console.log(
                    'Updated node dimensions:',
                    id,
                    params.width,
                    params.height,
                )
            } catch (error) {
                console.error('Error updating node dimensions:', error)
            }
        }, 1000)
    }
</script>

<NodeResizer
    minWidth={300}
    minHeight={150}
    isVisible={selected}
    handleClass="!w-2 !h-2 !bg-background !border-2 !border-border"
    lineClass="!border !border-border"
    onResizeEnd={handleResizeEnd}
/>
<div
    class="node relative border border-border bg-card flex flex-row group w-full h-full"
>
    <div class="flex flex-col gap-2 w-full h-full">
        <p class="text-lg text-muted-foreground">ID : {id}</p>
        {width}
        {height}
    </div>
    {#if scene}
        <p class="text-lg text-muted-foreground">ID scene : {scene.id}</p>
        <div class="flex flex-col w-full h-full">
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
        class="classic-handle"
    />
    <Handle
        id={`source-${id}`}
        type="source"
        position={Position.Right}
        class="classic-handle"
    />
</div>
