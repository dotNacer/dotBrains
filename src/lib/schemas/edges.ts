import { z } from 'zod'
import { EdgeType } from '@prisma/client'

export const createEdgeSchema = z.object({
    sourceId: z.string(),
    targetId: z.string(),
    sceneId: z.string(),
    type: z.nativeEnum(EdgeType).default(EdgeType.smoothstep),
    animated: z.boolean().default(true),
    label: z.string().optional().nullable(),
})

export type CreateEdgeSchema = typeof createEdgeSchema

export const updateEdgeSchema = z.object({
    id: z.string(),
    sceneId: z.string(),
    data: createEdgeSchema.partial().omit({ sceneId: true, sourceId: true, targetId: true }),
})