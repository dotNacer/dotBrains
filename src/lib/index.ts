import type { NodeTypes } from '@xyflow/svelte'
import type { SvelteComponent } from 'svelte'
import CustomNode from '$lib/components/svelteflow/nodes/CustomNode.svelte'
import MenuNode from '$lib/components/svelteflow/nodes/MenuNode.svelte'
import SceneCreationNode from '$lib/components/svelteflow/nodes/SceneCreationNode.svelte'
import SceneNode from '$lib/components/svelteflow/nodes/SceneNode.svelte'
import ParentGroupNode from '$lib/components/svelteflow/nodes/ParentGroupNode.svelte'
export const nodeTypes: NodeTypes = {
    custom: CustomNode as unknown as typeof SvelteComponent,
    menu: MenuNode as unknown as typeof SvelteComponent,
    'scene-creation': SceneCreationNode as unknown as typeof SvelteComponent,
    scene: SceneNode as unknown as typeof SvelteComponent,
    'parent-group': ParentGroupNode as unknown as typeof SvelteComponent,
}
