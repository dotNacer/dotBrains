import { json } from '@sveltejs/kit'
import type { RequestHandler, RequestEvent } from './$types'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST({ request }: RequestEvent) {
    const data = await request.json()

    try {
        const node = await prisma.node.create({
            data: {
                type: 'EVENT', // Par défaut pour un node de scène
                positionX: data.positionX,
                positionY: data.positionY,
                width: 300, // Valeur par défaut pour un node de scène
                height: 150, // Valeur par défaut pour un node de scène
                sceneId: data.sceneId,
                properties: data.properties,
            },
        })
        return json({ success: true, node })
    } catch (error) {
        console.error('Error creating node:', error)
        return new Response(
            JSON.stringify({ error: 'Failed to create node' }),
            {
                status: 500,
            }
        )
    }
}

export async function GET({ url }: RequestEvent) {
    const id = url.searchParams.get('id')

    try {
        if (id) {
            const node = await prisma.node.findUnique({
                where: {
                    id: parseInt(id),
                },
                include: {
                    scene: true,
                    outgoing: true,
                    incoming: true,
                },
            })
            return json(node)
        }

        const nodes = await prisma.node.findMany({
            include: {
                scene: true,
                outgoing: true,
                incoming: true,
            },
        })
        return json(nodes)
    } catch (error) {
        console.error('Error fetching nodes:', error)
        return new Response(
            JSON.stringify({ error: 'Failed to fetch nodes' }),
            {
                status: 500,
            }
        )
    }
}

export const DELETE: RequestHandler = async ({ url }) => {
    const id = url.searchParams.get('id')

    if (!id) {
        return new Response(JSON.stringify({ error: 'ID is required' }), {
            status: 400,
        })
    }

    try {
        await prisma.node.delete({
            where: { id: parseInt(id) },
        })

        return new Response(null, { status: 204 })
    } catch (error) {
        console.error('Error deleting node:', error)
        return new Response(
            JSON.stringify({ error: 'Failed to delete node' }),
            {
                status: 500,
            }
        )
    }
}

export const PATCH: RequestHandler = async ({ request }) => {
    const data = await request.json()
    const { id, width, height, positionX, positionY } = data

    if (!id) {
        return new Response(JSON.stringify({ error: 'ID is required' }), {
            status: 400,
        })
    }

    try {
        const updatedNode = await prisma.node.update({
            where: { id: parseInt(id) },
            data: {
                ...(width !== undefined && { width: parseFloat(width) }),
                ...(height !== undefined && { height: parseFloat(height) }),
                ...(positionX !== undefined && {
                    positionX: parseFloat(positionX),
                }),
                ...(positionY !== undefined && {
                    positionY: parseFloat(positionY),
                }),
            },
        })

        return json(updatedNode)
    } catch (error) {
        console.error('Error updating node:', error)
        return new Response(
            JSON.stringify({ error: 'Failed to update node' }),
            {
                status: 500,
            }
        )
    }
}
