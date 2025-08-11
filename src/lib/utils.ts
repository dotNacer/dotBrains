import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

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
