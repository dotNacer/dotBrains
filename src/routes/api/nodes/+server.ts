import { json } from '@sveltejs/kit'
import type { RequestEvent } from './$types'
import prisma from '$lib/server/prisma'

export async function GET({ url }: RequestEvent) {
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

export async function POST({ request }: RequestEvent) {
    const data = await request.json()
    //FIXME : Typer le type de data reçu, -> créer un Dto ?

    /* 
    dto {
    type : parmis une enum,
    position : XYPosition,
    sceneId : number,

    propertiers jsp si je le garde ?
    }
    */

    //FIXME : Wrapper dans le try catch
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
