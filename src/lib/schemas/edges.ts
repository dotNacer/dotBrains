import { z } from 'zod'
import { EdgeType, type Prisma } from '@prisma/client'

export const formSchema = z.object({
	fromNodeId: z.number(),
	toNodeId: z.number(),
	type: z.nativeEnum(EdgeType).default(EdgeType.smoothstep),
	animated: z.boolean().default(false),
	label: z.string().optional(),
	conditions: z.any() as unknown as z.ZodType<Prisma.InputJsonValue>,
	properties: z.any() as unknown as z.ZodType<Prisma.InputJsonValue>,
})
