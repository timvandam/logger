import { Transport } from './Transport'
import { Message } from '../LogFunctions/Message'
import { createWriteStream } from 'fs'
import { EOL } from 'os'
import { decycle } from 'cycle'

export function fileTransport<T extends Message>(path: string): Transport<T> {
	const stdout = createWriteStream(path, { flags: 'a' })
	return (msg: T) => stdout.write(JSON.stringify(decycle(msg)) + EOL)
}
