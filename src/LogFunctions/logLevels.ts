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
	const x = levels.map((level) => [level, compose(loggers, { level })])
	return Object.fromEntries(x)
}
