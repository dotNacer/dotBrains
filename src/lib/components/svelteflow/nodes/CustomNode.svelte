<script lang="ts">
    import { Handle, Position, type NodeProps } from '@xyflow/svelte'

    let { data } = $props() as NodeProps
</script>

<div
    class="relative border-[1px] border-slate-200 bg-white px-4 py-2 shadow-md"
>
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
