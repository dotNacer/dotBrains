import type { Prisma } from '@prisma/client'

export interface CreateNodeDto {
    positionX: number
    positionY: number
    sceneId?: number
    outgoingId?: number[]
    incomingId?: number[]
    properties: Prisma.InputJsonValue
}
