import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { cubicOut } from 'svelte/easing'
import type { TransitionConfig } from 'svelte/transition'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

// Types for the result object with discriminated union
type Success<T> = {
	data: T
	error: null
}

type Failure<E> = {
	data: null
	error: E
}

type Result<T, E = Error> = Success<T> | Failure<E>

// Main wrapper function
export async function tryCatch<T, E = Error>(promise: Promise<T>): Promise<Result<T, E>> {
	try {
		const data = await promise
		return { data, error: null }
	} catch (error) {
		// Normalize thrown values to Error objects
		let normalizedError: E
		if (error instanceof Error) {
			normalizedError = error as E
		} else if (error && typeof error === 'object' && 'message' in error) {
			// Object with message property
			normalizedError = error as E
		} else {
			// Wrap non-Error values in an Error object
			normalizedError = new Error(String(error)) as E
		}
		return { data: null, error: normalizedError }
	}
}

export type DtoOmit<T, Additional extends keyof T = never> = Omit<
	T,
	'id' | 'createdAt' | 'updatedAt' | Additional
>

type BlurAndFadeParams = {
	blur?: number

	x?: number

	y?: number

	duration?: number
}

export const blurAndFade = (
	node: Element,
	params: BlurAndFadeParams = { blur: 4, x: 0, y: 0, duration: 150 }
): TransitionConfig => {
	const style = getComputedStyle(node)
	const transform = style.transform === 'none' ? '' : style.transform

	const scaleConversion = (
		valueA: number,
		scaleA: [number, number],
		scaleB: [number, number]
	) => {
		const [minA, maxA] = scaleA
		const [minB, maxB] = scaleB
		const percentage = (valueA - minA) / (maxA - minA)
		const valueB = percentage * (maxB - minB) + minB
		return valueB
	}

	const styleToString = (style: Record<string, number | string | undefined>): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str
			return str + `${key}:${style[key]};`
		}, '')
	}

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const blur = scaleConversion(t, [0, 1], [params.blur ?? 4, 0])
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0])
			const y = scaleConversion(t, [0, 1], [params.y ?? -8, 0])

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0)`,
				filter: `blur(${blur}px)`,
				opacity: t,
			})
		},

		easing: cubicOut,
	}
}
