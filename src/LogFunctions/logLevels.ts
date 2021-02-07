import { LogArgument, LogFunction } from './LogFunction'
import { CombinedObjects, compose, ExtendedMessage } from '../compose'
import { ArrayValues } from '../ArrayValues'

const levels = ['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'] as const

export function createLogLevels<T extends readonly LogFunction[]>(
	loggers: T
): {
	readonly [L in ArrayValues<typeof levels>]: <Z extends LogArgument[]>(
		...args: Z
	) => ExtendedMessage<T> & CombinedObjects<Z> & { level: L }
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
