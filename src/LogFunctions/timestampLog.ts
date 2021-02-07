import { LogFunction } from './LogFunction'
import { Message } from './Message'

type TimestampLogMessage = { timestamp: Date }
export const timestampLog: LogFunction<TimestampLogMessage> = (): Message & TimestampLogMessage => ({
	timestamp: new Date(),
})
