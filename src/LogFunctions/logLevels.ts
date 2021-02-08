import { LogArgument, LogFunction } from './LogFunction'
import { ArrayValues } from '../types/ArrayValues'
import { compose, TransportForLoggers } from './compose'

const levels = ['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'] as const

export type LevelOverride = { level: ArrayValues<typeof levels> } & Record<string, unknown>

// TODO: Override
export function createLogLevels<O extends LevelOverride, L extends readonly LogFunction[]>(
	loggers: L,
	transports: TransportForLoggers<L, O>[]
): {
	readonly [L in ArrayValues<typeof levels>]: (...args: LogArgument[]) => void
} {
	return {
		silly: compose(loggers, transports, { level: 'silly' }),
		info: compose(loggers, transports, { level: 'info' }),
		http: compose(loggers, transports, { level: 'http' }),
		verbose: compose(loggers, transports, { level: 'verbose' }),
		error: compose(loggers, transports, { level: 'error' }),
		warn: compose(loggers, transports, { level: 'warn' }),
		debug: compose(loggers, transports, { level: 'debug' }),
	} as const
}
