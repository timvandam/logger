import { EOL } from 'os'
import { createWriteStream } from 'fs'

const message = Symbol('message')
interface Message {
	message: string
	[key: string]: unknown
	[message]: boolean
}

interface Transport {
	transport(msg: Message): void
}

class Logger {
	private transports: Transport[] = []

	public addTransport(transport: Transport): void {
		this.transports.push(transport)
	}

	protected getMessage(...args: unknown[]): Message {
		const msg = args.reduce<Message>(
			(msg, arg) => {
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
				return msg
			},
			{ [message]: true, message: '' }
		)
		msg.message = msg.message.slice(0, -1)
		return msg
	}

	public log(...args: unknown[]): void {
		const msg = this.getMessage(...args)
		this._log(msg)
	}

	public _log(msg: Message): void {
		for (const transport of this.transports) {
			transport.transport(msg)
		}
	}
}

class ConsoleTransport implements Transport {
	private stdout = createWriteStream('', { fd: 1 })

	constructor(protected format: string) {}

	protected transformMessage(msg: Message): string {
		let result = this.format
		let matches = new Set<string>()
		while ((matches = new Set(result.match(/(\$[a-zA-Z_]+)/g))).size) {
			for (const match of matches) {
				const property = match.slice(1)
				result = result.replace(new RegExp(`\\$${property}`, 'g'), String(msg?.[property]))
			}
		}
		return result
	}

	public transport(msg: Message): void {
		this.stdout.write(this.transformMessage(msg) + EOL)
	}
}

const TimestampLogger = (Logger: LoggerConstructor) =>
	class extends Logger {
		_log(msg: Message): void {
			msg.timestamp = new Date()
			super._log(msg)
		}
	}

const PidLogger = (Logger: LoggerConstructor) =>
	class extends Logger {
		_log(msg: Message): void {
			msg.pid = process.pid
			super._log(msg)
		}
	}

const LogLevelLogger = (Logger: LoggerConstructor) => {
	const levels = ['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'] as const

	class LogLevelLogger extends Logger {}

	type LogLevels = { [k in typeof levels[number]]: (...args: unknown[]) => void }
	interface LogLevelLogger extends LogLevels {}

	for (const level of levels) {
		LogLevelLogger.prototype[level] = function (this: LogLevelLogger, ...args: unknown[]): void {
			const msg = this.getMessage(...args)
			msg.level = level
			this._log(msg)
		}
	}

	return LogLevelLogger
}

type LoggerConstructor = new (...args: unknown[]) => Logger
type LoggerConstructorConstructor = (Logger: LoggerConstructor) => LoggerConstructor
type Last<T extends unknown[]> = T extends [...infer H, infer T] ? T : never
function compose<T extends LoggerConstructorConstructor[]>(...loggers: T): InstanceType<ReturnType<Last<T>>> {
	const CustomLogger = loggers.reduceRight((FinalLogger, Extendable) => Extendable(FinalLogger), Logger)
	return new CustomLogger() as InstanceType<ReturnType<Last<T>>>
}

const logger = compose(TimestampLogger, PidLogger, LogLevelLogger)
console.log(logger)
logger.addTransport(new ConsoleTransport('[$timestamp] [$pid] [$level] $message'))
logger.info('hello', 'world')
logger.log('hello', 'world', { level: 'silly' })
logger.info('hello', 'world')
console.log('world', 'hello')

// TODO: Clean up
// TODO: Enhance the Message type to for instance have { level: '...' } auto suggest etc
