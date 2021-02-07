import { Message } from './Message'
import { LogArgument, LogFunction } from './LogFunction'
import { SliceFirst } from '../types/SliceFirst'
import { First } from '../types/First'

export type ExtendedMessage<T extends readonly LogFunction[], S extends Message = Message> = T extends readonly []
	? S
	: ExtendedMessage<SliceFirst<T>, S & ReturnType<First<T>>>

export type CombinedObjects<T extends readonly unknown[], S extends Record<string, unknown> = {}> = T extends readonly [

]
	? S
	: CombinedObjects<SliceFirst<T>, First<T> extends Record<string, unknown> ? S & First<T> : S>

export function compose<T extends readonly LogFunction[], P extends Record<string, unknown>>(loggers: T, override?: P) {
	return <Z extends readonly LogArgument[]>(...args: Z) =>
		loggers.reduce((msg, logger) => ({ ...msg, ...logger(...args), ...override }), {}) as ExtendedMessage<T> &
			CombinedObjects<Z> &
			P
}
