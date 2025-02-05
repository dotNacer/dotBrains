<script lang="ts">
    import { useConnection } from '@xyflow/svelte'

    const connection = useConnection()

    let path = $derived.by(() => {
        const { from, to } = $connection
        return `M${from?.x},${from?.y} C ${to?.x} ${from?.y} ${from?.x} ${to?.y} ${to?.x},${to?.y}`
    })
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
        stroke={$connection.fromHandle?.id}
        stroke-width={1.5}
    />
{/if}
