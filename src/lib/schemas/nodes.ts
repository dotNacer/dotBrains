import { z } from 'zod'
import type { Prisma } from '@prisma/client'

export const formSchema = z.object({
    positionX: z.number(),
    positionY: z.number(),
    sceneId: z.number(),
    outgoingId: z.array(z.number()).default([]),
    incomingId: z.array(z.number()).default([]),
    properties: z.any() as unknown as z.ZodType<Prisma.InputJsonValue>,
})
