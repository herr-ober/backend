import { Request, Response, NextFunction } from 'express'
import { InternalError } from '../../errors'
import { container } from '../../modules/dependencyContainer'
import * as EventModule from '../../modules/event'
import { asString } from '../../common/helpers/dataHelper'

const eventService: EventModule.interfaces.IEventService = container.get(EventModule.DI_TYPES.EventService)
const staffService: EventModule.interfaces.IStaffService = container.get(EventModule.DI_TYPES.StaffService)

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

async function addStaff(req: Request, res: Response, next: NextFunction) {
  const eventUuid: string = asString(req.params.eventUuid)
  const name: string = req.body.name
  const role: EventModule.enums.StaffRole = req.body.role

  return staffService
    .createStaff({ eventUuid, name, role })
    .then((staff: EventModule.types.IStaff) => {
      return res.status(200).json({ staff: { uuid: staff.uuid, code: staff.code } })
    })
    .catch((error: Error) => {
      logger.error('Add staff error', { error })
      throw new InternalError('Failed to add staff')
    })
}

async function getStaff(req: Request, res: Response, next: NextFunction) {
  const eventUuid: string = asString(req.params.eventUuid)

  return staffService
    .getAllStaffByEventUuid(eventUuid)
    .then((staffList: EventModule.types.IStaff[]) => {
      return res.status(200).json({ staffList })
    })
    .catch((error: Error) => {
      logger.error('Staff retrieval error', { error })
      throw new InternalError('Failed to retrieve staff')
    })
}

async function updateStaff(req: Request, res: Response, next: NextFunction) {
  const uuid: string = req.body.uuid
  const updates: object = req.body.updates

  return staffService
    .updateStaffByUuid(uuid, updates)
    .then(() => {
      return res.status(204).send()
    })
    .catch((error: Error) => {
      if (error instanceof EventModule.errors.BadStaffUpdateDataError) {
        next(error)
      } else {
        logger.error('Staff update error', { error })
        throw new InternalError('Failed to update staff')
      }
    })
}

async function removeStaff(req: Request, res: Response, next: NextFunction) {
  const uuid: string = req.body.uuid

  return staffService
    .deleteStaffByUuid(uuid)
    .then(() => {
      return res.status(204).send()
    })
    .catch((error: Error) => {
      if (error instanceof EventModule.errors.BadStaffDeletionDataError) {
        next(error)
      } else {
        logger.error('Staff deletion error', { error })
        throw new InternalError('Failed to delete staff')
      }
    })
}

export default {
  createEvent,
  getEvent,
  updateEvent,
  deleteEvent,
  addStaff,
  getStaff,
  updateStaff,
  removeStaff
}
