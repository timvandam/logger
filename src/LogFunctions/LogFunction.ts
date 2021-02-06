import { Message } from '../Message'

export type LogArgument = string | number | bigint | Record<string, unknown>
export type LogFunction<T extends Record<string, unknown> = Record<string, unknown>> = (
	...args: LogArgument[]
) => Message & T
