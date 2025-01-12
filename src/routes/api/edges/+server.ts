import { json } from '@sveltejs/kit'
import { PrismaClient } from '@prisma/client'
import type { RequestEvent } from './$types'

const prisma = new PrismaClient()

export async function POST({ request }: RequestEvent) {
    const data = await request.json()

    try {
        const edge = await prisma.edge.create({
            data: {
                fromNode: { connect: { id: data.fromNodeId } },
                toNode: { connect: { id: data.toNodeId } },
                type: data.type,
                animated: data.animated,
                label: data.label,
                conditions: data.conditions,
                properties: data.properties,
            },
            include: {
                fromNode: true,
                toNode: true,
            },
        })
        return json(edge)
    } catch (error) {
        console.error('Error creating edge:', error)
        return new Response(
            JSON.stringify({ error: 'Failed to create edge' }),
            {
                status: 500,
            },
        )
    }
}

export async function GET({ url }: RequestEvent) {
    const fromNodeId = url.searchParams.get('fromNodeId')
    const toNodeId = url.searchParams.get('toNodeId')

    try {
        if (fromNodeId && toNodeId) {
            const edge = await prisma.edge.findUnique({
                where: {
                    fromNodeId_toNodeId: {
                        fromNodeId: parseInt(fromNodeId),
                        toNodeId: parseInt(toNodeId),
                    },
                },
                include: {
                    fromNode: true,
                    toNode: true,
                },
            })
            return json(edge)
        }

        const edges = await prisma.edge.findMany({
            include: {
                fromNode: true,
                toNode: true,
            },
        })
        return json(edges)
    } catch (error) {
        console.error('Error fetching edges:', error)
        return new Response(
            JSON.stringify({ error: 'Failed to fetch edges' }),
            {
                status: 500,
            },
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
        const edge = await prisma.edge.delete({
            where: { id: parseInt(id) },
            include: {
                fromNode: true,
                toNode: true,
            },
        })
        return json(edge)
    } catch (error) {
        console.error('Error deleting edge:', error)
        return new Response(
            JSON.stringify({ error: 'Failed to delete edge' }),
            {
                status: 500,
            },
        )
    }
}

export async function PATCH({ request }: RequestEvent) {
    const data = await request.json()
    const { id, ...updateData } = data

    try {
        const edge = await prisma.edge.update({
            where: { id: parseInt(id) },
            data: {
                fromNode: updateData.fromNodeId
                    ? { connect: { id: updateData.fromNodeId } }
                    : undefined,
                toNode: updateData.toNodeId
                    ? { connect: { id: updateData.toNodeId } }
                    : undefined,
                type: updateData.type,
                animated: updateData.animated,
                label: updateData.label,
                conditions: updateData.conditions,
                properties: updateData.properties,
            },
            include: {
                fromNode: true,
                toNode: true,
            },
        })
        return json(edge)
    } catch (error) {
        console.error('Error updating edge:', error)
        return new Response(
            JSON.stringify({ error: 'Failed to update edge' }),
            {
                status: 500,
            },
        )
    }
}
