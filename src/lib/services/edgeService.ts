import type { CreateEdgeDto } from '$lib/types/Edge'
import prisma from '$lib/server/prisma'
import type { Edge as PrismaEdge, Prisma } from '@prisma/client'
import { tryCatch } from '$lib/utils'

export const edgeService = {
	getById: async (edgeId: string) => {
		const { data, error } = await tryCatch<PrismaEdge | null>(
			prisma.edge.findUnique({
				where: { id: edgeId },
			})
		)
		if (error) throw error
		return data
	},
	create: async (edge: CreateEdgeDto) => {
		const { data, error } = await tryCatch<PrismaEdge>(
			prisma.edge.create({
				data: edge,
			})
		)
		if (error) throw error
		return data
	},
	update: async (edge: PrismaEdge) => {
		const { data, error } = await tryCatch<PrismaEdge>(
			prisma.edge.update({
				where: { id: edge.id },
				data: edge as Prisma.EdgeUncheckedUpdateInput,
			})
		)
		if (error) throw error
		return data
	},
	updatePartial: async (edgeId: string, updates: Prisma.EdgeUncheckedUpdateInput) => {
		const { data, error } = await tryCatch<PrismaEdge>(
			prisma.edge.update({
				where: { id: edgeId },
				data: updates,
			})
		)
		if (error) throw error
		return data
	},

	delete: async (edgeId: string) => {
		const { data, error } = await tryCatch<PrismaEdge>(
			prisma.edge.delete({
				where: { id: edgeId },
			})
		)
		if (error) throw error
		return data
	},
}
