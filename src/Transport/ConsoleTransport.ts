import Transport from './Transport'
import { Message } from '../LogFunctions/Message'
import { Writable } from 'stream'
import { createWriteStream } from 'fs'
import * as util from 'util'
import { EOL } from 'os'

export default class ConsoleTransport<T extends Message> implements Transport<T> {
	protected stdout: Writable = createWriteStream('', { fd: 1 })

	constructor(protected format: (msg: T) => string = (msg: T) => util.format(...Object.values(msg), EOL)) {}

	transport(msg: T): void {
		this.stdout.write(this.format(msg))
	}
}
