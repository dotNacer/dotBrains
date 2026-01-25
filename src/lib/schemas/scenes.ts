import { z } from 'zod'

export const createSceneSchema = z.object({
	name: z.string().min(1, 'Le nom est requis'),
	description: z.string().default(''),
})

export type CreateSceneSchema = z.infer<typeof createSceneSchema>