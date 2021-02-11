import { Message } from '../LogFunctions/Message'

export type Transport<T extends Message> = (msg: T) => unknown
