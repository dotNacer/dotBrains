import { z } from 'zod'
import type { CreateCharacterDto } from '$lib/types/Character'

// Le schema correspond maintenant au DTO de création
export const formSchema = z.object({
    name: z.string().min(2).max(50),
    description: z.string().min(10).max(500),
    sceneIds: z.array(z.number()).default([]),
}) satisfies z.ZodType<CreateCharacterDto>

export type FormSchema = typeof formSchema
