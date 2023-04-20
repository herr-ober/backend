import { inject, injectable } from 'inversify'
import { DI_TYPES } from '../diTypes'
import { BadEventDeletionDataError, BadEventUpdateDataError } from '../errors'
import { IEventRepo, IEventService } from '../interfaces'
import { ICreateEventData, IEvent, IUpdateEventData } from '../types'

@injectable()
class EventService implements IEventService {
  private readonly eventRepo: IEventRepo

  public constructor(@inject(DI_TYPES.EventRepo) eventRepo: IEventRepo) {
    this.eventRepo = eventRepo
  }

  async createEvent(data: ICreateEventData): Promise<IEvent> {
    return this.eventRepo.create(data)
  }

  async getEventByUuid(uuid: string): Promise<IEvent | null> {
    return this.eventRepo.getByUuid(uuid)
  }

  async getEventByOrganizerUuid(organizerUuid: string): Promise<IEvent | null> {
    return this.eventRepo.getByOrganizerUuid(organizerUuid)
  }

  async updateEventByUuid(uuid: string, data: IUpdateEventData): Promise<number[]> {
    const affectedRows: number[] = await this.eventRepo.updateByUuid(uuid, data)
    if (!affectedRows[0]) {
      throw new BadEventUpdateDataError('Failed to update event - 0 rows affected')
    }
    return affectedRows
  }

  async deleteEventByUuid(uuid: string, suppressError: boolean = false): Promise<number> {
    const affectedRows: number = await this.eventRepo.deleteByUuid(uuid)
    if (affectedRows < 0 && !suppressError) {
      throw new BadEventDeletionDataError('Failed to delete event - 0 rows affected')
    }
    return affectedRows
  }
}

export default EventService
