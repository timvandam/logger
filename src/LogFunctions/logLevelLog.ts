import { LogFunction } from './LogFunction'
import { compose } from '../compose'

export function createLogLevels<T extends readonly LogFunction[]>(loggers: T) {
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
