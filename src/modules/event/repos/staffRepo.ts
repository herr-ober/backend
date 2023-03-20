import { injectable } from 'inversify'
import { IStaffRepo } from '../interfaces'
import database from '../../databaseModels'
import { ICreateStaffData, IStaff, IUpdateStaffData } from '../types'

@injectable()
class StaffRepo implements IStaffRepo {
  /**
   * It creates a new staff member in the database
   * @param {ICreateStaffData} data - ICreateStaffData
   * @returns A promise of a Staff object
   */
  async create(data: ICreateStaffData): Promise<IStaff> {
    return database.Staff.create(data)
  }

  /**
   * It returns a Staff object that matches the criteria passed in
   * @param {object} criteria - object - The criteria to search for.
   * @param {string[] | false} [scopes] - string[] | false
   * @returns A Staff object
   */
  async getOneByCriteria(criteria: object, scopes?: string[] | false): Promise<IStaff | null> {
    const definedScopes = scopes || (scopes === false ? false : ['defaultScope'])
    const parameters: object = {
      where: criteria
    }
    if (definedScopes) {
      return database.Staff.scope(definedScopes).findOne(parameters)
    }
    return database.Staff.unscoped().findOne(parameters)
  }

  async getByUuid(uuid: string, scopes?: string[]): Promise<IStaff | null> {
    return this.getOneByCriteria({ uuid }, scopes)
  }

  async getByCode(code: string, scopes?: string[]): Promise<IStaff | null> {
    return this.getOneByCriteria({ code }, scopes)
  }

  /**
   * It returns a promise of an array of Staff objects, which are found by the criteria object, and
   * optionally scoped by the scopes array
   * @param {object} criteria - object - The criteria to search for.
   * @param {string[] | false} [scopes] - An array of scopes to apply to the query.
   * @returns An array of Staff objects
   */
  async getManyByCriteria(criteria: object, scopes?: string[] | false): Promise<IStaff[]> {
    const definedScopes = scopes || (scopes === false ? false : ['defaultScope'])
    const parameters: object = {
      where: criteria
    }
    if (definedScopes) {
      return database.Staff.scope(definedScopes).findAll(parameters)
    }
    return database.Staff.unscoped().findAll(parameters)
  }

  async getAllByEventUuid(eventUuid: string, scopes?: string[]): Promise<IStaff[]> {
    return this.getManyByCriteria({ eventUuid }, scopes)
  }

  /**
   * It updates a row in the database
   * @param {object} criteria - object - The criteria to use to find the staff member(s) to update.
   * @param {object} updates - object - This is the object that contains the new values for the fields
   * you want to update.
   * @returns The number of rows affected by the update.
   */
  async update(criteria: object, updates: object): Promise<number[]> {
    return database.Staff.update(updates, {
      where: criteria
    })
  }

  async updateByUuid(uuid: string, updates: IUpdateStaffData): Promise<number[]> {
    return this.update({ uuid }, updates)
  }

  /**
   * It deletes a staff member from the database
   * @param {object} criteria - object - This is the criteria that you want to use to delete the
   * record.
   * @returns The number of rows deleted.
   */
  async delete(criteria: object): Promise<number> {
    return database.Staff.destroy({
      where: criteria
    })
  }

  async deleteByUuid(uuid: string): Promise<number> {
    return this.delete({ uuid })
  }

  async deleteByEventUuid(eventUuid: string): Promise<number> {
    return this.delete({ eventUuid })
  }
}

export default StaffRepo
