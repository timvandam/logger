import { baseLog } from './LogFunctions/baseLog'
import { timestampLog } from './LogFunctions/timestampLog'
import { pidLog } from './LogFunctions/pidLog'
import { createLogLevels, LevelOverride } from './LogFunctions/logLevels'
import { compose, TransportForLoggers } from './LogFunctions/compose'
import ConsoleTransport from './Transport/ConsoleTransport'
import * as util from 'util'
import { EOL } from 'os'

const loggers = [baseLog, timestampLog, pidLog] as const
const consoleTransport: TransportForLoggers<typeof loggers> = new ConsoleTransport((msg) =>
	util.format('[%s] [%d] %s', msg.timestamp, msg.pid, msg.message, EOL)
)

const log = compose(loggers, [consoleTransport])

// log('hello world!')
// log('hello world!')
// log('hello world!')

// console.log('done')

const consoleTransportLevels: TransportForLoggers<typeof loggers, LevelOverride> = new ConsoleTransport((msg) =>
	util.format('[%s] [%d] [%s] %s', msg.timestamp, msg.pid, msg.level, msg.message, EOL)
)

const { silly, info } = createLogLevels(loggers, [consoleTransportLevels])

silly('a', 'b', 'c', { a: 'b' }, 'd', { c: 'd' })
info('a', 'b', 'c', { a: 'b' }, 'd', { c: 'd' })
log('a', 'b', 'c', { a: 'b' }, 'd', { c: 'd' })
