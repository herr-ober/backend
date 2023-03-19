import { ICreateEventData, IEvent, IUpdateEventData } from '../types'

export interface IEventRepo {
  create(data: ICreateEventData): Promise<IEvent>
  getByUuid(uuid: string, scopes?: string[]): Promise<IEvent | null>
  getByOrganizerUuid(organizerUuid: string, scopes?: string[]): Promise<IEvent | null>
  updateByUuid(uuid: string, updates: IUpdateEventData): Promise<number[]>
  deleteByUuid(uuid: string): Promise<number>
}
