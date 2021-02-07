import { baseLog } from './LogFunctions/baseLog'
import { timestampLog } from './LogFunctions/timestampLog'
import { pidLog } from './LogFunctions/pidLog'
import { createLogLevels } from './LogFunctions/logLevels'
import { compose } from './LogFunctions/compose'
import ConsoleTransport from './Transport/ConsoleTransport'
import * as util from 'util'
import { EOL } from 'os'

const loggers = [baseLog, timestampLog, pidLog] as const
const log = compose(loggers)
const { silly, info } = createLogLevels(loggers)

// TODO: Add a transporter array to compose and createLogLevels
const transporter = new ConsoleTransport<ReturnType<typeof silly>>((msg) => {
	return util.format('[%s] [%d] [%s]', msg.timestamp, msg.pid, msg.level, msg.message, EOL)
})

transporter.transport(silly('hello', 'world'))

console.log('all done')

silly('a', 'b', 'c', { a: 'b' }, 'd', { c: 'd' })
info('a', 'b', 'c', { a: 'b' }, 'd', { c: 'd' })
log('a', 'b', 'c', { a: 'b' }, 'd', { c: 'd' })
