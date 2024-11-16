<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';

	let { data } = $props() as NodeProps;
</script>

<div class="rounded-md border-2 border-stone-400 bg-white px-4 py-2 shadow-md">
	<div class="flex">
		<div class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
			{data.emoji}
		</div>
		<div class="ml-2">
			<div class="text-lg font-bold">{data.name}</div>
			<div class="text-gray-500">{data.job}</div>
		</div>
	</div>
	<Handle
		type="target"
		position={Position.Left}
		class="w-16 rounded-none border-none !bg-teal-500"
	/>
	<Handle
		type="source"
		position={Position.Right}
		class="w-16 rounded-none border-none !bg-teal-500"
	/>
</div>
