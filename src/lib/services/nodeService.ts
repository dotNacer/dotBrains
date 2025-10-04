import type { CreateNodeDto } from '$lib/types/Node'
import prisma from '$lib/server/prisma'
import type { Node as PrismaNode, Prisma } from '@prisma/client'
import { tryCatch } from '$lib/utils'

export const nodeService = {
	getById: async (nodeId: string) => {
		const { data, error } = await tryCatch<PrismaNode | null>(
			prisma.node.findUnique({
				where: { id: nodeId },
			})
		)
		if (error) throw error
		return data
	},
	create: async (node: CreateNodeDto) => {
		const { data, error } = await tryCatch<PrismaNode>(
			prisma.node.create({
				data: node,
			})
		)
		if (error) throw error
		return data
	},
	update: async (node: PrismaNode) => {
		const { data, error } = await tryCatch<PrismaNode>(
			prisma.node.update({
				where: { id: node.id },
				data: node,
			})
		)
		if (error) throw error
		return data
	},
	updatePartial: async (nodeId: string, updates: Prisma.NodeUncheckedUpdateInput) => {
		const { data, error } = await tryCatch<PrismaNode>(
			prisma.node.update({
				where: { id: nodeId },
				data: updates,
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
