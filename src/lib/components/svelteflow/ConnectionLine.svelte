<script lang="ts">
    import { useConnection, getSmoothStepPath } from '@xyflow/svelte'

    const connection = useConnection()

    // Make the destructured values reactive with $derived
    let { from, to, fromPosition, toPosition } = $derived($connection)

    // Separate path calculation into its own $derived
    let path = $derived(
        from && to
            ? getSmoothStepPath({
                  sourceX: from.x,
                  sourceY: from.y,
                  sourcePosition: fromPosition ?? undefined,
                  targetX: to.x,
                  targetY: to.y,
                  targetPosition: toPosition ?? undefined,
              })[0]
            : null,
    )
</script>

{#if path}
    <path
        fill="none"
        stroke-width={1.5}
        class="animated stroke-muted-foreground"
        d={path}
    />
    <circle
        cx={$connection.to?.x}
        cy={$connection.to?.y}
        fill="#fff"
        r={3}
        class="stroke-muted-foreground"
        stroke-width={1.5}
    />
{/if}
