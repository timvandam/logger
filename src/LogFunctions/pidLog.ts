import { LogFunction } from './LogFunction'
import { Message } from './Message'

type PidLogMessage = { pid: number }
export const pidLog: LogFunction<PidLogMessage> = (): Message & PidLogMessage => ({
	pid: process.pid,
})
