import { injectable } from 'inversify'
import { IAccount, ICreateAccountData, IUpdateAccountData } from '../types'
import database from '../../databaseModels'
import { IAccountRepo } from '../interfaces'

@injectable()
class AccountRepo implements IAccountRepo {
  /**
   * It creates an account in the database
   * @param {ICreateAccountData} data - ICreateAccountData
   * @returns An account object
   */
  async create(data: ICreateAccountData): Promise<IAccount> {
    return database.Account.create(data)
  }

  /**
   * It returns a single account record from the database, based on the criteria passed in
   * @param {object} criteria - object
   * @param {string[] | false} [scopes] - An array of scopes to apply to the query.
   * @returns An account object or null
   */
  async getOneByCriteria(criteria: object, scopes?: string[] | false): Promise<IAccount | null> {
    const definedScopes = scopes || (scopes === false ? false : ['defaultScope'])
    const parameters: object = {
      where: criteria
    }
    if (definedScopes) {
      return database.Account.scope(definedScopes).findOne(parameters)
    }
    return database.Account.unscoped().findOne(parameters)
  }

  async getByUuid(uuid: string, scopes?: string[]): Promise<IAccount | null> {
    return this.getOneByCriteria({ uuid }, scopes)
  }

  async getByEmail(email: string, scopes?: string[]): Promise<IAccount | null> {
    return this.getOneByCriteria({ email }, scopes)
  }

  /**
   * It returns an array of accounts that match the criteria
   * @param {object} criteria - object - The criteria to use to find the accounts.
   * @param {string[] | false} [scopes] - An array of scopes to apply to the query.
   * @returns An array of Account objects
   */
  async getManyByCriteria(criteria: object, scopes?: string[] | false): Promise<IAccount[]> {
    const definedScopes = scopes || (scopes === false ? false : ['defaultScope'])
    const parameters: object = {
      where: criteria
    }
    if (definedScopes) {
      return database.Account.scope(definedScopes).findAll(parameters)
    }
    return database.Account.unscoped().findAll(parameters)
  }

  async getByName(name: string, scopes?: string[]): Promise<IAccount[]> {
    return this.getManyByCriteria({ name }, scopes)
  }

  /**
   * It updates the database with the given updates, where the criteria is met
   * @param {object} criteria - object - The criteria to use to find the accounts to update.
   * @param {object} updates - This is the object that contains the new values that you want to update.
   * @returns The number of rows affected.
   */
  async update(criteria: object, updates: object): Promise<number[]> {
    return database.Account.update(updates, {
      where: criteria
    })
  }

  async updateByUuid(uuid: string, updates: IUpdateAccountData): Promise<number[]> {
    return this.update({ uuid }, updates)
  }

  /**
   * It deletes an account from the database
   * @param {object} criteria - object - This is the criteria that you want to use to delete the
   * record.
   * @returns The number of rows deleted.
   */
  async delete(criteria: object): Promise<number> {
    return database.Account.destroy({
      where: criteria
    })
  }

  async deleteByUuid(uuid: string): Promise<number> {
    return this.delete({ uuid })
  }
}

export default AccountRepo
