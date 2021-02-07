import { LogArgument, LogFunction } from './LogFunction'
import { ArrayValues } from '../types/ArrayValues'
import { compose, ExtendedMessage } from './compose'

const levels = ['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'] as const

export function createLogLevels<T extends readonly LogFunction[]>(
	loggers: T
): {
	readonly [L in ArrayValues<typeof levels>]: <Z extends LogArgument[]>(...args: Z) => ExtendedMessage<T> & { level: L }
} {
	return {
		silly: compose(loggers, { level: 'silly' } as const),
		info: compose(loggers, { level: 'info' } as const),
		http: compose(loggers, { level: 'http' } as const),
		verbose: compose(loggers, { level: 'verbose' } as const),
		error: compose(loggers, { level: 'error' } as const),
		warn: compose(loggers, { level: 'warn' } as const),
		debug: compose(loggers, { level: 'debug' } as const),
	} as const
}
