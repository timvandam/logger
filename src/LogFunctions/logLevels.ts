import { LogArgument, LogFunction } from './LogFunction'
import { ArrayValues } from '../types/ArrayValues'
import { compose, TransportForLoggers } from './compose'

const levels = ['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'] as const
export type LogLevelMessage = { level: ArrayValues<typeof levels> }
const logLevelLog = (level: ArrayValues<typeof levels>): LogFunction<LogLevelMessage> => () => ({ level })

export function createLogLevels<L extends readonly LogFunction[]>(
	loggers: L,
	transports: TransportForLoggers<readonly [...L, ReturnType<typeof logLevelLog>]>[]
): {
	readonly [L in ArrayValues<typeof levels>]: (...args: LogArgument[]) => void
} {
	return {
		silly: compose([...loggers, logLevelLog('silly')], transports),
		info: compose([...loggers, logLevelLog('info')], transports),
		http: compose([...loggers, logLevelLog('http')], transports),
		verbose: compose([...loggers, logLevelLog('verbose')], transports),
		error: compose([...loggers, logLevelLog('error')], transports),
		warn: compose([...loggers, logLevelLog('warn')], transports),
		debug: compose([...loggers, logLevelLog('debug')], transports),
	} as const
}
