import { json } from '@sveltejs/kit'
import { PrismaClient } from '@prisma/client'
import type { RequestEvent } from './$types'

const prisma = new PrismaClient()
