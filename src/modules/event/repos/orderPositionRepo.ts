import { injectable } from 'inversify'
import { ICreateOrderPositionData, IOrderPosition, IUpdateOrderPositionData } from '../types'
import database from '../../databaseModels'
import { IOrderPositionRepo } from '../interfaces'
import { OrderStatus } from '../enums'

@injectable()
class OrderPositionRepo implements IOrderPositionRepo {
  /**
   * This function creates a new order position in a database using the provided data.
   * @param {ICreateOrderPositionData} data - ICreateOrderPositionData is a type/interface that defines
   * the shape of the data object that is expected to be passed as an argument to the create method. It
   * likely includes properties such as the order position's name, quantity, price, and any other
   * relevant information needed to create a new order position in
   * @returns The `create` method is returning a Promise that resolves to an `IOrderPosition` object.
   * This object represents a newly created order position in the database, based on the data provided
   * in the `data` parameter.
   */
  async create(data: ICreateOrderPositionData): Promise<IOrderPosition> {
    return database.OrderPosition.create(data)
  }

  /**
   * This function retrieves a single order position based on given criteria and optional scopes.
   * @param {object} criteria - The `criteria` parameter is an object that contains the conditions that
   * will be used to filter the results of the query. It is used as the `where` clause in the query.
   * @param {string[] | false} [scopes] - `scopes` is an optional parameter that can be either an array
   * of strings or a boolean value. If it is an array of strings, it represents the names of the scopes
   * to be applied to the query. If it is `false`, no scopes will be applied. If it is not provided,
   * @returns a Promise that resolves to either an IOrderPosition object or null.
   */
  async getOneByCriteria(criteria: object, scopes?: string[] | false): Promise<IOrderPosition | null> {
    const definedScopes = scopes || (scopes === false ? false : ['defaultScope'])
    const parameters: object = {
      where: criteria
    }
    if (definedScopes) {
      return database.OrderPosition.scope(definedScopes).findOne(parameters)
    }
    return database.OrderPosition.unscoped().findOne(parameters)
  }

  async getByUuid(uuid: string, scopes?: string[]): Promise<IOrderPosition | null> {
    return this.getOneByCriteria({ uuid }, scopes)
  }

  /**
   * This is an async function that retrieves multiple order positions based on given criteria and
   * optional scopes.
   * @param {object} criteria - The `criteria` parameter is an object that specifies the conditions
   * that the returned `IOrderPosition` objects must meet. It is used to filter the results of the
   * query.
   * @param {string[] | false} [scopes] - `scopes` is an optional parameter that can be either an array
   * of strings or a boolean value. If it is an array of strings, it represents the names of the scopes
   * to be applied to the query. If it is `false`, no scopes will be applied. If it is not provided,
   * @returns This function returns a Promise that resolves to an array of `IOrderPosition` objects
   * that match the given criteria. The function uses Sequelize ORM to query the database and applies
   * any specified scopes before returning the results.
   */
  async getManyByCriteria(criteria: object, scopes?: string[] | false): Promise<IOrderPosition[]> {
    const definedScopes = scopes || (scopes === false ? false : ['defaultScope'])
    const parameters: object = {
      where: criteria
    }
    if (definedScopes) {
      return database.OrderPosition.scope(definedScopes).findAll(parameters)
    }
    return database.OrderPosition.unscoped().findAll(parameters)
  }

  async getAllByOrderUuid(orderUuid: string, scopes?: string[]): Promise<IOrderPosition[]> {
    return this.getManyByCriteria({ orderUuid }, scopes)
  }

  async getAllByStatus(status: OrderStatus, scopes?: string[]): Promise<IOrderPosition[]> {
    return this.getManyByCriteria({ status }, scopes)
  }

  /**
   * This function updates order positions in a database based on given criteria and returns an array
   * of updated positions.
   * @param {object} criteria - The `criteria` parameter is an object that specifies the conditions
   * that must be met for the update operation to be performed. It is used to filter the records that
   * need to be updated. The `where` property of the options object is set to this criteria object.
   * @param {object} updates - The `updates` parameter is an object that contains the new values that
   * we want to update in the database. The keys of the object represent the column names in the
   * database table, and the values represent the new values that we want to set for those columns.
   * @returns The `update` method is being called on the `OrderPosition` model of the `database`, with
   * the `updates` object and `criteria` object as its arguments. The method returns a Promise that
   * resolves to an array of numbers representing the number of rows affected by the update operation.
   */
  async update(criteria: object, updates: object): Promise<number[]> {
    return database.OrderPosition.update(updates, {
      where: criteria
    })
  }

  async updateByUuid(uuid: string, updates: IUpdateOrderPositionData): Promise<number[]> {
    return this.update({ uuid }, updates)
  }

  /**
   * This function deletes order positions from a database based on a given criteria object.
   * @param {object} criteria - The `criteria` parameter is an object that specifies the conditions
   * that must be met for the deletion to occur. It is used to filter the records that will be deleted
   * from the `OrderPosition` table in the database. The `where` property of the object is used to
   * specify the conditions. For
   * @returns A Promise that resolves to a number, which represents the number of rows deleted from the
   * "OrderPosition" table in the database that match the given criteria.
   */
  async delete(criteria: object): Promise<number> {
    return database.OrderPosition.destroy({
      where: criteria
    })
  }

  async deleteByUuid(uuid: string): Promise<number> {
    return this.delete({ uuid })
  }

  async deleteAllByOrderUuid(orderUuid: string): Promise<number> {
    return this.delete({ orderUuid })
  }
}

export default OrderPositionRepo
