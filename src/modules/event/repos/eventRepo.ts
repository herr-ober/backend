import { injectable } from 'inversify'
import { IEvent, ICreateEventData, IUpdateEventData } from '../types'
import database from '../../databaseModels'
import { IEventRepo } from '../interfaces'

@injectable()
class EventRepo implements IEventRepo {
  /**
   * It creates an event in the database
   * @param {ICreateEventData} data - ICreateEventData
   * @returns The event that was created.
   */
  async create(data: ICreateEventData): Promise<IEvent> {
    return database.Event.create(data)
  }

  /**
   * It returns a single event from the database, based on the criteria you pass in
   * @param {object} criteria - object
   * @param {string[] | false} [scopes] - An array of scopes to apply to the query.
   * @returns An event object
   */
  async getOneByCriteria(criteria: object, scopes?: string[] | false): Promise<IEvent | null> {
    const definedScopes = scopes || (scopes === false ? false : ['defaultScope'])
    const parameters: object = {
      where: criteria
    }
    if (definedScopes) {
      return database.Event.scope(definedScopes).findOne(parameters)
    }
    return database.Event.unscoped().findOne(parameters)
  }

  async getByUuid(uuid: string, scopes?: string[]): Promise<IEvent | null> {
    return this.getOneByCriteria({ uuid }, scopes)
  }

  async getByOrganizerUuid(organizerUuid: string, scopes?: string[]): Promise<IEvent | null> {
    return this.getOneByCriteria({ organizerUuid }, scopes)
  }

  /**
   * It returns a list of events that match the criteria
   * @param {object} criteria - object - The criteria to search for.
   * @param {string[] | false} [scopes] - An array of scopes to apply to the query.
   * @returns An array of Event objects
   */
  async getManyByCriteria(criteria: object, scopes?: string[] | false): Promise<IEvent[]> {
    const definedScopes = scopes || (scopes === false ? false : ['defaultScope'])
    const parameters: object = {
      where: criteria
    }
    if (definedScopes) {
      return database.Event.scope(definedScopes).findAll(parameters)
    }
    return database.Event.unscoped().findAll(parameters)
  }

  /**
   * It updates the database with the given updates, where the given criteria is met
   * @param {object} criteria - object - The criteria to use to find the events to update.
   * @param {object} updates - object - The object containing the updates to be made.
   * @returns The number of rows affected by the update.
   */
  async update(criteria: object, updates: object): Promise<number[]> {
    return database.Event.update(updates, {
      where: criteria
    })
  }

  async updateByUuid(uuid: string, updates: IUpdateEventData): Promise<number[]> {
    return this.update({ uuid }, updates)
  }

  /**
   * It deletes an event from the database
   * @param {object} criteria - object - This is the criteria that you want to use to delete the
   * record.
   * @returns The number of rows deleted.
   */
  async delete(criteria: object): Promise<number> {
    return database.Event.destroy({
      where: criteria
    })
  }

  async deleteByUuid(uuid: string): Promise<number> {
    return this.delete({ uuid })
  }
}

export default EventRepo
