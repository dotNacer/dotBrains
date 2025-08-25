import type { CreateNodeDto } from '$lib/types/Node'
import prisma from '$lib/server/prisma'
import type { Node as PrismaNode } from '@prisma/client'
import { tryCatch } from '$lib/utils'

export const nodeService = {
	create: async (node: CreateNodeDto) => {
		const { data, error } = await tryCatch<PrismaNode>(
			prisma.node.create({
				data: node,
			})
		)
		if (error) throw error
		return data
	},

	delete: async (nodeId: string) => {
		const { data, error } = await tryCatch<PrismaNode>(
			prisma.node.delete({
				where: { id: nodeId },
			})
		)
		if (error) throw error
		return data
	},
}
