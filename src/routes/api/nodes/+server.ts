import { json } from '@sveltejs/kit'
import { PrismaClient } from '@prisma/client'
import type { RequestEvent } from './$types'

const prisma = new PrismaClient()

export async function POST({ request }: RequestEvent) {
    const data = await request.json()

    try {
        const node = await prisma.node.create({
            data: {
                positionX: data.positionX,
                positionY: data.positionY,
                sceneId: data.sceneId,
                properties: data.properties,
            },
        })
        return json(node)
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

export async function DELETE({ url }: RequestEvent) {
    const id = url.searchParams.get('id')
    if (!id) {
        return new Response(JSON.stringify({ error: 'ID is required' }), {
            status: 400,
        })
    }

    try {
        const node = await prisma.node.delete({
            where: { id: parseInt(id) },
            include: {
                scene: true,
                outgoing: true,
                incoming: true,
            },
        })
        return json(node)
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

export async function PATCH({ request }: RequestEvent) {
    const data = await request.json()
    const { id, ...updateData } = data

    try {
        const node = await prisma.node.update({
            where: { id: parseInt(id) },
            data: {
                positionX: updateData.positionX,
                positionY: updateData.positionY,
                sceneId: updateData.sceneId,
                properties: updateData.properties,
            },
            include: {
                scene: true,
                outgoing: true,
                incoming: true,
            },
        })
        return json(node)
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
