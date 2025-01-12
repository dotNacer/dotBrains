import { z } from 'zod'
import type { Prisma } from '@prisma/client'

export const formSchema = z.object({
    fromNodeId: z.number(),
    toNodeId: z.number(),
    type: z.string().default('default'),
    animated: z.boolean().default(false),
    label: z.string().optional(),
    conditions: z.any() as unknown as z.ZodType<Prisma.InputJsonValue>,
    properties: z.any() as unknown as z.ZodType<Prisma.InputJsonValue>,
})
