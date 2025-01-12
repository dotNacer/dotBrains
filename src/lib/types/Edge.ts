import type { Prisma } from '@prisma/client'

export interface CreateEdgeDto {
    fromNodeId: number
    toNodeId: number
    type?: string
    animated?: boolean
    label?: string
    conditions?: Prisma.InputJsonValue
    properties?: Prisma.InputJsonValue
}
