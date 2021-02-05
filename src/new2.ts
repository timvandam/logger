import { First } from './First'
import { SliceFirst } from './SliceFirst'

interface Message {}

type LogArgument = string | number | bigint | Record<string, unknown>
type LogFunction<T extends Record<string, unknown> = Record<string, unknown>> = (...args: LogArgument[]) => Message & T

type BaseLogMessage = { message: string } & Record<string, unknown>
const baseLog: LogFunction<BaseLogMessage> = (...args: LogArgument[]): Message & BaseLogMessage => {
	const msg = { message: '' }

	for (const arg of args) {
		switch (typeof arg) {
			case 'object':
				Object.assign(msg, arg)
				break

			case 'string':
			case 'number':
			case 'bigint':
				msg.message += arg + ' '
				break
		}
	}

	msg.message = msg.message.slice(0, -1)

	return msg
}

type CombinedObjects<
	T extends readonly unknown[],
	S extends Record<string, unknown> = Record<string, never>
> = T extends readonly []
	? S
	: CombinedObjects<SliceFirst<T>, First<T> extends Record<string, unknown> ? S & First<T> : S>

type TimestampLogMessage = { timestamp: Date }
const timestampLog: LogFunction<TimestampLogMessage> = (): Message & TimestampLogMessage => ({
	timestamp: new Date(),
})

type PidLogMessage = { pid: number }
const pidLog: LogFunction<PidLogMessage> = (): Message & PidLogMessage => ({
	pid: process.pid,
})

// This simply exists to provide level type support. Setting the actual type should be done elsewhere
const levels = ['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'] as const
type LogLevelMessage = { level: typeof levels[number] }
const logLevelLog: LogFunction<LogLevelMessage> = () => ({ level: 'info' }) // default level is info

function getLogLevelLoggers(log: LogFunction): Record<typeof levels[number], LogFunction> {
	const loggers: Record<string, LogFunction> = {}

	for (const level of levels) loggers[level] = (...args: LogArgument[]) => ({ ...log(...args), level })

	return loggers
}

type ExtendedMessage<T extends readonly LogFunction[], S extends Message = Message> = T extends readonly []
	? S
	: ExtendedMessage<SliceFirst<T>, S & ReturnType<First<T>>>

function compose<T extends readonly LogFunction[]>(...loggers: T) {
	return <Z extends readonly LogArgument[]>(...args: Z): ExtendedMessage<T> & CombinedObjects<Z> => {
		return loggers.reduce((msg, logger) => ({ ...msg, ...logger(...args) }), {}) as ExtendedMessage<T> &
			CombinedObjects<Z>
	}
}

const log = compose(baseLog, timestampLog, pidLog, logLevelLog)
const { error, debug, http, info, silly, verbose, warn } = getLogLevelLoggers(log)
const l = silly('hello', 'world', { a: 'b' }, { b: 'c' })

console.log(l)
