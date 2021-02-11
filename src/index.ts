import { baseLog } from './LogFunctions/baseLog'
import { timestampLog } from './LogFunctions/timestampLog'
import { pidLog } from './LogFunctions/pidLog'
import { compose } from './LogFunctions/compose'
import { consoleTransport } from './Transport/consoleTransport'
import * as util from 'util'
import { EOL } from 'os'
import { createLogLevels } from './LogFunctions/logLevels'

const loggers = [baseLog, timestampLog, pidLog] as const

const log = compose(loggers, [
	consoleTransport((msg) => util.format('[%s] [%d] %s', msg.timestamp, msg.pid, msg.message, EOL)),
	consoleTransport((msg) => util.format(msg.message, EOL)),
])

log('hello world!')
log('hello world!')
log('hello world!')

const { silly } = createLogLevels(loggers, [
	consoleTransport((msg) => util.format('[%s] [%d] [%s] %s', msg.timestamp, msg.pid, msg.level, msg.message, EOL)),
])

silly('hello world!')
