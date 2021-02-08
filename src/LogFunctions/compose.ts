import { Message } from './Message'
import { LogArgument, LogFunction } from './LogFunction'
import { SliceFirst } from '../types/SliceFirst'
import { First } from '../types/First'
import Transport from '../Transport/Transport'

export type ExtendedMessage<T extends readonly LogFunction[], S extends Message = Message> = T extends readonly []
	? S
	: ExtendedMessage<SliceFirst<T>, S & ReturnType<First<T>>>

export type TransportForLoggers<L extends readonly LogFunction[], O = unknown> = Transport<ExtendedMessage<L> & O>

export function compose<O extends Record<string, unknown>, L extends readonly LogFunction[]>(
	loggers: L,
	transports: TransportForLoggers<L, O>[],
	override: O = {} as O
) {
	return (...args: LogArgument[]): void => {
		const msg = loggers.reduce(
			(msg, logger) => ({ ...msg, ...logger(...args), ...override }),
			{}
		) as ExtendedMessage<L> & O

		transports.forEach((transport) => transport.transport(msg))
	}
}
