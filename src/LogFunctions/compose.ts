import { Message } from './Message'
import { LogArgument, LogFunction } from './LogFunction'
import { SliceFirst } from '../types/SliceFirst'
import { First } from '../types/First'
import { Transport } from '../Transport/Transport'

export type ExtendedMessage<T extends readonly LogFunction[], S = Message> = T extends readonly []
	? S
	: ExtendedMessage<SliceFirst<T>, S & ReturnType<First<T>>>

export type TransportForLoggers<L extends readonly LogFunction[]> = Transport<ExtendedMessage<L>>

export function compose<L extends readonly LogFunction[]>(loggers: L, transports: TransportForLoggers<L>[]) {
	return (...args: LogArgument[]): void => {
		const msg = loggers.reduce((msg, logger) => ({ ...msg, ...logger(...args) }), {}) as ExtendedMessage<L>

		transports.forEach((transport) => transport(msg))
	}
}
