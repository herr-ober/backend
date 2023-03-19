import { Request, Response, NextFunction } from 'express'
import { InternalError } from '../../errors'
import { container } from '../../modules/dependencyContainer'
import * as EventModule from '../../modules/event'
import { asString } from '../../common/helpers/dataHelper'

const eventService: EventModule.interfaces.IEventService = container.get(EventModule.DI_TYPES.EventService)

async function createEvent(req: Request, res: Response, next: NextFunction) {
  const organizerUuid: string = asString(req.auth!.uuid)
  const name: string = req.body.name
  const location: string = req.body.location
  const date: Date = req.body.date

  return eventService
    .createEvent({ organizerUuid, name, location, date })
    .then((event: EventModule.types.IEvent) => {
      return res.status(200).json({ event: { uuid: event.uuid, name: event.name } })
    })
    .catch((error: Error) => {
      logger.error('Event creation error', { error })
      throw new InternalError('Failed to create event')
    })
}

async function getEvent(req: Request, res: Response, next: NextFunction) {
  const organizerUuid: string = asString(req.auth!.uuid)

  return eventService
    .getEventByOrganizerUuid(organizerUuid)
    .then((event: EventModule.types.IEvent | null) => {
      if (!event)
        throw new EventModule.errors.EventNotFoundError('Cannot find event associated to requesting organizer')

      return res
        .status(200)
        .json({ event: { uuid: event.uuid, name: event.name, location: event.location, date: event.date } })
    })
    .catch((error: Error) => {
      if (error instanceof EventModule.errors.EventNotFoundError) {
        next(error)
      } else {
        logger.error('Event retrieval error', { error })
        throw new InternalError('Failed to retrieve event')
      }
    })
}

async function updateEvent(req: Request, res: Response, next: NextFunction) {
  const organizerUuid: string = asString(req.auth!.uuid)
  const updates: object = req.body.updates

  return eventService
    .getEventByOrganizerUuid(organizerUuid)
    .then((event: EventModule.types.IEvent | null) => {
      if (!event)
        throw new EventModule.errors.EventNotFoundError('Cannot find event associated to requesting organizer')

      return eventService.updateEventByUuid(event.uuid, updates)
    })
    .then(() => {
      return res.status(204).send()
    })
    .catch((error: Error) => {
      if (
        error instanceof EventModule.errors.BadEventUpdateDataError ||
        error instanceof EventModule.errors.EventNotFoundError
      ) {
        next(error)
      } else {
        logger.error('Event update error', { error })
        throw new InternalError('Failed to update event')
      }
    })
}

async function deleteEvent(req: Request, res: Response, next: NextFunction) {
  const organizerUuid: string = asString(req.auth!.uuid)

  return eventService
    .getEventByOrganizerUuid(organizerUuid)
    .then((event: EventModule.types.IEvent | null) => {
      if (!event)
        throw new EventModule.errors.EventNotFoundError('Cannot find event associated to requesting organizer')

      return eventService.deleteEventByUuid(event.uuid)
    })
    .then(() => {
      return res.status(204).send()
    })
    .catch((error: Error) => {
      if (
        error instanceof EventModule.errors.BadEventDeletionDataError ||
        error instanceof EventModule.errors.EventNotFoundError
      ) {
        next(error)
      } else {
        logger.error('Event deletion error', { error })
        throw new InternalError('Failed to delete event')
      }
    })
}

export default {
  createEvent,
  getEvent,
  updateEvent,
  deleteEvent
}
