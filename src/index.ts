import { baseLog } from './LogFunctions/baseLog'
import { timestampLog } from './LogFunctions/timestampLog'
import { pidLog } from './LogFunctions/pidLog'
import { createLogLevels } from './LogFunctions/logLevels'

const loggers = [baseLog, timestampLog, pidLog] as const
const { silly, info } = createLogLevels(loggers)

silly('a', 'b', 'c', { a: 'b' }, 'd', { c: 'd' })
info('a', 'b', 'c', { a: 'b' }, 'd', { c: 'd' })
