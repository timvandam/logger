import { First } from './First'
import { SliceFirst } from './SliceFirst'

interface Message {}

type LogArgument = string | number | bigint | Record<string, unknown>
type LogFunction<T extends Record<string, unknown> = Record<string, unknown>> = (...args: LogArgument[]) => Message & T

type BaseLogMessage = { message: string }
const baseLog: LogFunction<BaseLogMessage> = <Z extends LogArgument[]>(...args: Z): Message & BaseLogMessage => {
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

	return msg as Message & BaseLogMessage & CombinedObjects<Z>
}

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

type ExtendedMessage<T extends readonly LogFunction[], S extends Message = Message> = T extends readonly []
	? S
	: ExtendedMessage<SliceFirst<T>, S & ReturnType<First<T>>>

type CombinedObjects<T extends readonly unknown[], S extends Record<string, unknown> = {}> = T extends readonly []
	? S
	: CombinedObjects<SliceFirst<T>, First<T> extends Record<string, unknown> ? S & First<T> : S>

function compose<T extends readonly LogFunction[], P extends Partial<ExtendedMessage<T>>>(loggers: T, override?: P) {
	return <Z extends readonly LogArgument[]>(...args: Z): ExtendedMessage<T> & CombinedObjects<Z> =>
		loggers.reduce((msg, logger) => ({ ...msg, ...logger(...args), ...override }), {}) as ExtendedMessage<T> &
			CombinedObjects<Z>
}

type ListWithAtLeastOne<L extends readonly unknown[], Y, C extends readonly unknown[] = L> = C extends readonly []
	? readonly [Y, ...L]
	: First<C> extends Y
	? L
	: ListWithAtLeastOne<L, Y, SliceFirst<C>>

function createLogLevels<
	Z extends ListWithAtLeastOne<typeof loggers, LogFunction<LogLevelMessage>>,
	P extends Partial<ExtendedMessage<Z>>
>(loggers: Z) {
	return {
		silly: compose(loggers, { level: 'silly' } as P),
		info: compose(loggers, { level: 'info' } as P),
		http: compose(loggers, { level: 'http' } as P),
		verbose: compose(loggers, { level: 'verbose' } as P),
		error: compose(loggers, { level: 'error' } as P),
		warn: compose(loggers, { level: 'warn' } as P),
		debug: compose(loggers, { level: 'debug' } as P),
	}
}

const loggers = [baseLog, timestampLog, logLevelLog, pidLog] as const
const log = compose(loggers)

log('asd', 'asd', { a: 1 })

const { silly } = createLogLevels(loggers)

const l = silly('hello', 'world', { a: 'b' }, { b: 'c' })
console.log(l)
