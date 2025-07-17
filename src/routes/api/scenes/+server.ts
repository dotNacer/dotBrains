import { json } from '@sveltejs/kit'
import type { RequestEvent } from './$types'
import prisma from '$lib/server/prisma'

export async function DELETE({ url }: RequestEvent) {
    const id = url.searchParams.get('id')
    if (!id) {
        return new Response(JSON.stringify({ error: 'ID is required' }), {
            status: 400,
        })
    }

    console.log('deleting scene', id)

    try {
        // Vérifier si la scène existe avant de la supprimer
        const scene = await prisma.scene.findUnique({
            where: {
                id: parseInt(id),
            },
        })

        if (!scene) {
            return new Response(JSON.stringify({ error: 'Scene not found' }), {
                status: 404,
            })
        }

        await prisma.scene.delete({
            where: {
                id: parseInt(id),
            },
        })
        return json({ message: 'Scene deleted successfully' })
    } catch (error) {
        console.error('Error deleting scene:', error)
        return new Response(
            JSON.stringify({ error: 'Failed to delete scene' }),
            {
                status: 500,
            }
        )
    }
}
