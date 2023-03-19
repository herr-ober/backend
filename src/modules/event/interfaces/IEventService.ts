import { ICreateEventData, IEvent, IUpdateEventData } from '../types'

export interface IEventService {
  createEvent(data: ICreateEventData): Promise<IEvent>
  getEventByUuid(uuid: string): Promise<IEvent | null>
  getEventByOrganizerUuid(organizerUuid: string): Promise<IEvent | null>
  updateEventByUuid(uuid: string, data: IUpdateEventData): Promise<number[]>
  deleteEventByUuid(uuid: string, suppressError?: boolean): Promise<number>
}
