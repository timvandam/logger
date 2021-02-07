import Transport from './Transport'
import { Message } from '../LogFunctions/Message'
import { Writable } from 'stream'
import { createWriteStream } from 'fs'

export default class ConsoleTransport<T extends Message> implements Transport<T> {
	protected stdout: Writable = createWriteStream('', { fd: 1 })

	constructor(protected format: (msg: T) => string) {}

	transport(msg: T): void {
		this.stdout.write(this.format(msg))
	}
}
