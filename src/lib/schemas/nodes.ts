import { z } from 'zod'
import { NodeType } from '@prisma/client'

export const createNodeSchema = z.object({
    type: z.nativeEnum(NodeType),
    title: z.string().optional().nullable(),
    positionX: z.number(),
    positionY: z.number(),
    width: z.number(),
    height: z.number(),
    parentId: z.string().optional().nullable(),
    sceneId: z.string(),
})

export type CreateNodeSchema = typeof createNodeSchema

export const updateNodeSchema = z.object({
    id: z.string(),
    sceneId: z.string(),
    data: createNodeSchema.partial().omit({ sceneId: true }),
})