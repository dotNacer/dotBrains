import type { CreateNodeDto } from './../types/Node'
import prisma from '$lib/server/prisma'
import type { Node as PrismaNode, Prisma } from '@prisma/client'
import { tryCatch } from '@/utils'

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
}
