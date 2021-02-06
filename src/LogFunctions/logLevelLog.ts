import { LogArgument, LogFunction } from './LogFunction'
import { CombinedObjects, compose, ExtendedMessage } from '../compose'

// This simply exists to provide level type support. Setting the actual type should be done elsewhere (eg via createLogLevels)
const levels = ['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'] as const
type LogLevelMessage = { level: typeof levels[number] }

export function createLogLevels<
	T extends readonly LogFunction[],
	P extends Partial<ExtendedMessage<T>> & LogLevelMessage
>(
	loggers: T
): {
	[level in typeof levels[number]]: <Z extends readonly LogArgument[]>(
		...args: Z
	) => ExtendedMessage<T> & CombinedObjects<Z> & LogLevelMessage
} {
	return {
		silly: compose(loggers, { level: 'silly' } as P),
		info: compose(loggers, { level: 'info' } as P),
		http: compose(loggers, { level: 'http' } as P),
		verbose: compose(loggers, { level: 'verbose' } as P),
		error: compose(loggers, { level: 'error' } as P),
		warn: compose(loggers, { level: 'warn' } as P),
		debug: compose(loggers, { level: 'debug' } as P),
	} as ReturnType<typeof createLogLevels>
}
