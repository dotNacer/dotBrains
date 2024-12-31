import { z } from 'zod'

export const formSchema = z.object({
    name: z.string().min(2).max(50),
    description: z.string().min(10).max(500),
    sceneIds: z.array(z.number()).default([]),
})

export type FormSchema = typeof formSchema
