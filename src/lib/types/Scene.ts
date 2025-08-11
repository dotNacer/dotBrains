import type { DtoOmit } from '$lib/utils'
import type { Scene as PrismaScene, Node as PrismaNode, Edge as PrismaEdge } from '@prisma/client'

export type Scene = PrismaScene & {
	nodes: PrismaNode[]
	edges: PrismaEdge[]
}

export type SceneDto = DtoOmit<Scene, 'nodes' | 'edges'>

export interface CreateSceneDto {
	title: string
	description: string
	characterIds?: number[]
}
