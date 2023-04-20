import { injectable } from 'inversify'
import { ICategoryRepo } from '../interfaces'
import database from '../../databaseModels'
import { ICategory } from '../types'

@injectable()
class CategoryRepo implements ICategoryRepo {
  /**
   * It returns a category from the database based on the criteria you pass in
   * @param {object} criteria - object - The criteria to search for.
   * @param {string[] | false} [scopes] - An array of scopes to apply to the query.
   * @returns A promise that resolves to a Category instance or null.
   */
  async getOneByCriteria(criteria: object, scopes?: string[] | false): Promise<ICategory | null> {
    const definedScopes = scopes || (scopes === false ? false : ['defaultScope'])
    const parameters: object = {
      where: criteria
    }
    if (definedScopes) {
      return database.Category.scope(definedScopes).findOne(parameters)
    }
    return database.Category.unscoped().findOne(parameters)
  }

  async getByUuid(uuid: string, scopes?: string[]): Promise<ICategory | null> {
    return this.getOneByCriteria({ uuid }, scopes)
  }

  /**
   * It returns a promise of an array of Category objects that match the criteria
   * @param {object} criteria - object - The criteria to search for.
   * @param {string[] | false} [scopes] - An array of scopes to apply to the query.
   * @returns An array of Category objects
   */
  async getManyByCriteria(criteria: object, scopes?: string[] | false): Promise<ICategory[]> {
    const definedScopes = scopes || (scopes === false ? false : ['defaultScope'])
    const parameters: object = {
      where: criteria
    }
    if (definedScopes) {
      return database.Category.scope(definedScopes).findAll(parameters)
    }
    return database.Category.unscoped().findAll(parameters)
  }

  async getAll(scopes?: string[]): Promise<ICategory[]> {
    return this.getManyByCriteria({}, scopes)
  }

  /**
   * It updates the database with the given updates, where the criteria is met
   * @param {object} criteria - object - The criteria to find the category to update
   * @param {object} updates - The object containing the updated values.
   * @returns The number of rows affected by the update.
   */
  async update(criteria: object, updates: object): Promise<number[]> {
    return database.Category.update(updates, {
      where: criteria
    })
  }

  /**
   * It deletes a category from the database
   * @param {object} criteria - object - This is the criteria that will be used to find the record(s)
   * that will be deleted.
   * @returns The number of rows deleted.
   */
  async delete(criteria: object): Promise<number> {
    return database.Category.destroy({
      where: criteria
    })
  }
}

export default CategoryRepo
