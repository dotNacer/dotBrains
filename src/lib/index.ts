import type { NodeTypes } from '@xyflow/svelte'
import type { SvelteComponent } from 'svelte'
import CustomNode from '$lib/components/svelteflow/nodes/CustomNode.svelte'
import MenuNode from '$lib/components/svelteflow/nodes/MenuNode.svelte'

export const nodeTypes: NodeTypes = {
    custom: CustomNode as unknown as typeof SvelteComponent,
    menu: MenuNode as unknown as typeof SvelteComponent,
}
