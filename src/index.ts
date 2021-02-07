import { baseLog } from './LogFunctions/baseLog'
import { timestampLog } from './LogFunctions/timestampLog'
import { pidLog } from './LogFunctions/pidLog'
import { createLogLevels } from './LogFunctions/logLevels'
import { compose } from './LogFunctions/compose'

const loggers = [baseLog, timestampLog, pidLog] as const
const log = compose(loggers)
const { silly, info } = createLogLevels(loggers)

silly('a', 'b', 'c', { a: 'b' }, 'd', { c: 'd' })
info('a', 'b', 'c', { a: 'b' }, 'd', { c: 'd' })
log('a', 'b', 'c', { a: 'b' }, 'd', { c: 'd' })
