import { z } from 'zod'

export const formSchema = z.object({
    title: z.string().min(1, 'Le titre est requis'),
    description: z.string().min(1, 'La description est requise'),
    characterIds: z.array(z.number()).default([]),
})

export type FormSchema = typeof formSchema
