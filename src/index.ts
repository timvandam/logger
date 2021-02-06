import { baseLog } from './LogFunctions/baseLog'
import { timestampLog } from './LogFunctions/timestampLog'
import { pidLog } from './LogFunctions/pidLog'
import { createLogLevels } from './LogFunctions/logLevelLog'

const loggers = [baseLog, timestampLog, pidLog] as const
const { silly } = createLogLevels(loggers)

const l = silly('a', 'b', 'c', { a: 'b' }, 'd', { c: 'd' })
console.log(l)
