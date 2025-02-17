import type { Prisma } from '@prisma/client'
import type { NodeType } from '@prisma/client'

export const CONST_NODETYPES_TO_SVELTEFLOW = {
    EVENT: 'scene',
    GROUP: 'parent-group',
}

export interface CreateNodeDto {
    type: NodeType
    title?: string

    // Position et taille
    positionX: number
    positionY: number
    width: number
    height: number

    outgoingIds?: number[]
    incomingIds?: number[]

    // Relations
    sceneId?: number

    // Pour les nodes de type GROUP
    parentId?: number
    childrenIds?: number[]

    properties: Prisma.InputJsonValue
}
