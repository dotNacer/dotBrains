import { type Node as PrismaNode, type Edge as PrismaEdge, NodeType } from '@prisma/client'
import type { Node as FlowNode, Edge as FlowEdge } from '@xyflow/svelte'

export function formatDBEdges(edges: PrismaEdge[]): FlowEdge[] {
	return edges.map((edge) => ({
		id: edge.id,
		type: edge.type,
		source: edge.sourceId,
		target: edge.targetId,
		animated: edge.animated,
		label: edge.label ?? undefined,
	}))
}

export function formatDBNodes(nodes: PrismaNode[]): FlowNode[] {
	return nodes.map((node) => ({
		id: node.id,
		type: node.type,
		position: { x: node.positionX, y: node.positionY },
		width: node.width,
		height: node.height,
		data: getNodeData(node),
	}))
}

function getNodeData(node: PrismaNode): {} {
	switch (node.type) {
		case NodeType.EVENT:
			return {
				title: node.title,
			}
		case NodeType.GROUP:
			return {
				title: node.title,
			}
		default:
			return {
				title: node.title,
			}
	}
}
