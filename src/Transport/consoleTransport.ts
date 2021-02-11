import { Transport } from './Transport'
import { Message } from '../LogFunctions/Message'
import { createWriteStream } from 'fs'
import * as util from 'util'
import { EOL } from 'os'

export function consoleTransport<T extends Message>(format: (msg: T) => string): Transport<T> {
	const stdout = createWriteStream('', { fd: 1 })
	return (msg: T) => stdout.write(format(msg))
}
