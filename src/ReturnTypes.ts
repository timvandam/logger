import { First } from './First'
import { SliceFirst } from './SliceFirst'

type Fn = (...args: unknown[]) => unknown

export type ReturnTypes<R extends readonly Fn[], S extends unknown[] = []> = R extends readonly []
	? S
	: ReturnTypes<SliceFirst<R>, [...S, ReturnType<First<R>>]>
