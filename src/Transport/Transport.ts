import { Message } from '../LogFunctions/Message'

export default interface Transport<T extends Message> {
	transport(msg: T): unknown
}
