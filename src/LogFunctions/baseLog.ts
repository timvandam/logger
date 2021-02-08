import { LogArgument, LogFunction } from './LogFunction'
import { Message } from './Message'

type BaseLogMessage = { message: string }
export const baseLog: LogFunction<BaseLogMessage> = (...args: LogArgument[]): Message & BaseLogMessage => {
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

	return msg as Message & BaseLogMessage
}
